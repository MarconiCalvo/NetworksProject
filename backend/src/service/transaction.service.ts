import crypto from "crypto";
import { prisma } from "../utils/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import fetch from "node-fetch";
import https from "https";
import rawBanks from "../config/bank.json";
import {
  generateHmacForAccountTransfer,
  generateHmacForPhoneTransfer,
} from "../utils/generateHmac";

const LOCAL_BANK_CODE = "119";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

interface Sender {
  account_number?: string;
  phone_number?: string;
  bank_code: string;
  name: string;
}

interface Receiver {
  account_number: string;
  bank_code: string;
  name: string;
}

interface Amount {
  value: number;
  currency: string;
}

export interface TransferPayload {
  version: string;
  timestamp: string;
  transaction_id: string;
  sender: Sender;
  receiver: Receiver;
  amount: Amount;
  description: string;
  hmac_md5?: string;
}

const banks: Record<string, string> = rawBanks;

// Extrae el código de banco de un IBAN (posición 6 a 9)
const getBankCode = (accountNumber: string): string =>
  accountNumber.substring(5, 8);

const isExternalBank = (bankCode: string): boolean =>
  bankCode !== LOCAL_BANK_CODE;

const isSenderLocal = (senderBankCode: string): boolean =>
  senderBankCode === LOCAL_BANK_CODE;

export const verifyHmac = (data: TransferPayload, receivedHmac: string): boolean => {
  let expected: string;

if (data.sender.phone_number) {
  console.log("📞 Usando transferencia por teléfono");
  console.log("Sender phone:", data.sender.phone_number);
  expected = generateHmacForPhoneTransfer(
    data.sender.phone_number,
    data.timestamp,
    data.transaction_id,
    data.amount.value
  );
} else if (data.sender.account_number) {
  console.log("🏦 Usando transferencia por cuenta");
  console.log("Sender account_number:", data.sender.account_number);
  expected = generateHmacForAccountTransfer(
    data.sender.account_number,
    data.timestamp,
    data.transaction_id,
    data.amount.value
  );
} else {
  console.log("❌ No se encontró ni phone ni account_number en el sender");
  console.log("📦 Sender recibido:", JSON.stringify(data.sender, null, 2));
  console.log("📦 Payload completo:", JSON.stringify(data, null, 2));
  throw new Error("Sender no tiene un identificador válido para HMAC.");
}

  const valid = expected === receivedHmac;
  console.log(`🧾 HMAC válido: ${valid}`);
  return valid;
};

export const logTransaction = (transaction: object): void => {
  console.log("📦 Transacción recibida:");
  console.log(JSON.stringify(transaction, null, 2));
};

const ensureCurrencyExists = async (currency: string) => {
  await prisma.currencies.upsert({
    where: { code: currency },
    update: {},
    create: {
      code: currency,
      name:
        currency === "CRC"
          ? "Costa Rican Colón"
          : currency === "USD"
            ? "US Dollar"
            : currency === "EUR"
              ? "Euro"
              : currency,
    },
  });
};

const getOrCreateSystemAccount = async (
  accountNumber: string,
  currency: string,
  initialBalance: number = 999999999
) => {
  let systemAccount = await prisma.accounts.findUnique({
    where: { number: accountNumber },
  });

  if (!systemAccount) {
    console.log(`📝 Creando cuenta del sistema: ${accountNumber}`);

    await ensureCurrencyExists(currency);

    systemAccount = await prisma.accounts.create({
      data: {
        number: accountNumber,
        currency: currency,
        balance: new Decimal(initialBalance),
      },
    });
    console.log(`✅ Cuenta del sistema ${accountNumber} creada con ID: ${systemAccount.id}`);
  }

  return systemAccount;
};

export const processInternalTransfer = async (transaction: TransferPayload) => {
  const { sender, receiver, amount } = transaction;

  console.log("🏠 Procesando transferencia interna");

  const from = await prisma.accounts.findUnique({
    where: { number: sender.account_number! },
  });

  const to = await prisma.accounts.findUnique({
    where: { number: receiver.account_number },
  });

  if (!from || !to) {
    throw new Error("Cuenta origen o destino no existe.");
  }

  if (from.currency !== amount.currency || to.currency !== amount.currency) {
    throw new Error("Moneda no coincide con las cuentas.");
  }

  if (from.balance < new Decimal(amount.value)) {
    throw new Error("Fondos insuficientes.");
  }

  await ensureCurrencyExists(amount.currency);

  await prisma.$transaction([
    prisma.transfers.create({
      data: {
        from_account_id: from.id,
        to_account_id: to.id,
        amount: new Decimal(amount.value),
        currency: amount.currency,
        status: "completed",
      },
    }),
    prisma.accounts.update({
      where: { id: from.id },
      data: {
        balance: { decrement: new Decimal(amount.value) },
      },
    }),
    prisma.accounts.update({
      where: { id: to.id },
      data: {
        balance: { increment: new Decimal(amount.value) },
      },
    }),
  ]);

  console.log("✅ Transferencia interna completada");
};

export const processOutgoingDebit = async (transaction: TransferPayload) => {
  const { sender, amount } = transaction;

  console.log("💸 Procesando débito saliente:", sender.account_number);

  const from = await prisma.accounts.findUnique({
    where: { number: sender.account_number! },
  });

  if (!from) {
    throw new Error("Cuenta origen no existe en este banco.");
  }

  if (from.currency !== amount.currency) {
    throw new Error("Moneda no coincide con la cuenta origen.");
  }

  if (from.balance < new Decimal(amount.value)) {
    throw new Error("Fondos insuficientes.");
  }

  await ensureCurrencyExists(amount.currency);

  await prisma.accounts.update({
    where: { id: from.id },
    data: {
      balance: { decrement: new Decimal(amount.value) },
    },
  });

  console.log("✅ Débito saliente procesado");
};

export const processIncomingCredit = async (transaction: TransferPayload) => {
  const { receiver, amount } = transaction;

  console.log("💰 Procesando crédito entrante:", receiver.account_number);

  const to = await prisma.accounts.findUnique({
    where: { number: receiver.account_number },
  });

  if (!to) {
    throw new Error("Cuenta destino no existe.");
  }

  await ensureCurrencyExists(amount.currency);

  await prisma.accounts.update({
    where: { id: to.id },
    data: {
      balance: { increment: new Decimal(amount.value) },
    },
  });

  console.log("✅ Crédito entrante procesado");
};

const sendToExternalBank = async (
  transaction: TransferPayload,
  bankCode: string
) => {
  const url = banks[bankCode];
  if (!url) {
    throw new Error(`Banco ${bankCode} no registrado.`);
  }

  console.log(`🌐 Enviando transferencia a banco ${bankCode}: ${url}`);

  const response = await fetch(`${url}/api/sinpe-transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
    agent: httpsAgent,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error del banco ${bankCode}: ${response.status} - ${errorText}`);
  }

  return await response.json();
};

export const routeTransfer = async (transaction: TransferPayload) => {
 const senderBankCode =
  transaction.sender.account_number?.substring(5, 8) || transaction.sender.bank_code;

  const receiverBankCode =
  transaction.receiver.account_number?.substring(5, 8) || transaction.receiver.bank_code;

  console.log(
    `🏦 Enrutando transferencia: ${senderBankCode} → ${receiverBankCode} (Local: ${LOCAL_BANK_CODE})`
  );

  if (!isExternalBank(senderBankCode) && !isExternalBank(receiverBankCode)) {
    console.log("📍 Caso: Transferencia interna");
    await processInternalTransfer(transaction);
    return { message: "Transferencia interna procesada correctamente." };
  }

  if (isSenderLocal(senderBankCode) && isExternalBank(receiverBankCode)) {
    console.log("📍 Caso: Transferencia saliente");
    await processOutgoingDebit(transaction);
    const result = await sendToExternalBank(transaction, receiverBankCode);
    return {
      message: "Transferencia saliente procesada correctamente.",
      external_result: result,
    };
  }

  if (isExternalBank(senderBankCode) && !isExternalBank(receiverBankCode)) {
    console.log("📍 Caso: Transferencia entrante");
    await processIncomingCredit(transaction);
    return { message: "Transferencia entrante procesada correctamente." };
  }

  throw new Error("Transferencia de tránsito no permitida en este banco.");
};

export const processTransfer = processInternalTransfer;
export const createExternalCredit = processIncomingCredit;
