import crypto from "crypto";
import { prisma } from "../utils/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import fetch from "node-fetch";
import rawBanks from "../config/bank.json";

const SHARED_SECRET = process.env.HMAC_SECRET || "supersecreta123";

// Configuración del banco local - debe ser configurado según el banco
const LOCAL_BANK_CODE = process.env.LOCAL_BANK_CODE || "CB";

interface Sender {
  account_number: string;
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

const getBankCode = (accountNumber: string): string =>
  accountNumber.substring(0, 2);

const isExternalBank = (bankCode: string): boolean => {
  return bankCode !== LOCAL_BANK_CODE;
};

const isSenderLocal = (senderBankCode: string): boolean => {
  return senderBankCode === LOCAL_BANK_CODE;
};

export const generateTransactionHmac = (data: object): string => {
  const { hmac_md5, ...cleanData } = data as any;
  const stringified = JSON.stringify(cleanData);
  console.log("🔐 String para HMAC:", stringified);

  return crypto
    .createHmac("md5", SHARED_SECRET)
    .update(stringified)
    .digest("hex");
};

export const verifyHmac = (data: object, receivedHmac: string): boolean => {
  const expected = generateTransactionHmac(data);
  const valid = expected === receivedHmac;
  console.log(`🧾 HMAC válido: ${valid}`);
  return valid;
};

export const logTransaction = (transaction: object): void => {
  console.log("📦 Transacción recibida:");
  console.log(JSON.stringify(transaction, null, 2));
};

// Asegurar que una moneda existe en la base de datos
const ensureCurrencyExists = async (currency: string) => {
  await prisma.currencies.upsert({
    where: { code: currency },
    update: {},
    create: {
      code: currency,
      name: currency === "CRC" ? "Costa Rican Colón" :
        currency === "USD" ? "US Dollar" :
          currency === "EUR" ? "Euro" : currency,
    },
  });
};

// Obtener o crear cuenta del sistema
const getOrCreateSystemAccount = async (accountNumber: string, currency: string, initialBalance: number = 999999999) => {
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

// Procesar transferencia interna (ambas cuentas en el mismo banco)
export const processInternalTransfer = async (transaction: TransferPayload) => {
  const { sender, receiver, amount } = transaction;

  console.log("🏠 Procesando transferencia interna");

  const from = await prisma.accounts.findUnique({
    where: { number: sender.account_number },
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

// Procesar débito local para transferencia externa (cuando el emisor es local)
export const processOutgoingDebit = async (transaction: TransferPayload) => {
  const { sender, amount } = transaction;

  console.log("💸 Procesando débito saliente:", sender.account_number);

  const from = await prisma.accounts.findUnique({
    where: { number: sender.account_number },
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

  // Solo debitar la cuenta origen, sin crear transferencia interna
  await prisma.accounts.update({
    where: { id: from.id },
    data: {
      balance: { decrement: new Decimal(amount.value) },
    },
  });

  console.log("✅ Débito saliente procesado");
};

// Procesar crédito para transferencia entrante (cuando el receptor es local)
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

  // Solo acreditar la cuenta destino, sin crear transferencia interna
  await prisma.accounts.update({
    where: { id: to.id },
    data: {
      balance: { increment: new Decimal(amount.value) },
    },
  });

  console.log("✅ Crédito entrante procesado");
};

// Enviar transferencia a banco externo
const sendToExternalBank = async (transaction: TransferPayload, bankCode: string) => {
  const url = banks[bankCode];
  if (!url) {
    throw new Error(`Banco ${bankCode} no registrado.`);
  }

  console.log(`🌐 Enviando transferencia a banco ${bankCode}: ${url}`);

  const response = await fetch(`${url}/api/receive-transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error del banco ${bankCode}: ${response.status} - ${errorText}`);
  }

  return await response.json();
};

// Función principal para enrutar transferencias
export const routeTransfer = async (transaction: TransferPayload) => {
  const senderBankCode = getBankCode(transaction.sender.account_number);
  const receiverBankCode = getBankCode(transaction.receiver.account_number);

  console.log(`🏦 Enrutando transferencia: ${senderBankCode} → ${receiverBankCode} (Local: ${LOCAL_BANK_CODE})`);

  // Caso 1: Transferencia completamente interna (ambas cuentas del mismo banco local)
  if (!isExternalBank(senderBankCode) && !isExternalBank(receiverBankCode)) {
    console.log("📍 Caso: Transferencia interna");
    await processInternalTransfer(transaction);
    return { message: "Transferencia interna procesada correctamente." };
  }

  // Caso 2: Transferencia saliente (emisor local, receptor externo)
  if (isSenderLocal(senderBankCode) && isExternalBank(receiverBankCode)) {
    console.log("📍 Caso: Transferencia saliente");

    // Primero procesar el débito local
    await processOutgoingDebit(transaction);

    // Luego enviar al banco externo
    const result = await sendToExternalBank(transaction, receiverBankCode);
    return { message: "Transferencia saliente procesada correctamente.", external_result: result };
  }

  // Caso 3: Transferencia entrante (emisor externo, receptor local)
  if (isExternalBank(senderBankCode) && !isExternalBank(receiverBankCode)) {
    console.log("📍 Caso: Transferencia entrante");
    await processIncomingCredit(transaction);
    return { message: "Transferencia entrante procesada correctamente." };
  }

  // Caso 4: Transferencia de tránsito (ni emisor ni receptor son locales - no debería llegar aquí)
  throw new Error("Transferencia de tránsito no permitida en este banco.");
};

// Funciones de compatibilidad (mantener para no romper código existente)
export const processTransfer = processInternalTransfer;
export const createExternalCredit = processIncomingCredit;