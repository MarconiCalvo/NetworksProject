import { sinpe as prismaSinpe } from "../prisma/sinpeClient";
import { bccr as prismaBccr } from "../prisma/bccrClient";
import { Decimal } from "@prisma/client/runtime/library";
import https from "https";
import fetch from "node-fetch";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false 
});

export const findPhoneLinkForUser = async (username: string) => {
  const user = await prismaSinpe.users.findUnique({
    where: { name: username },
    select: {
      id: true,
      user_accounts: {
        select: {
          accounts: {
            select: { number: true },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  for (const ua of user.user_accounts) {
    const accountNumber = ua.accounts.number;

    const phoneLink = await prismaSinpe.phone_links.findUnique({
      where: { account_number: accountNumber },
    });

    if (phoneLink) {
      return {
        phone: phoneLink.phone,
        account: accountNumber,
      };
    }
  }

  return null;
};

export const findPhoneSubscription = async (phone: string) => {
  return await prismaBccr.sinpe_subscriptions.findUnique({
    where: { sinpe_number: phone },
    select: {
      sinpe_number: true,
      sinpe_bank_code: true,
      sinpe_client_name: true,
    },
  });
};

export const sendSinpeTransfer = async (
  senderPhone: string,
  receiverPhone: string,
  amount: number,
  currency: string,
  comment?: string
) => {
  // 1. Validar que el número receptor esté registrado en BCCR
  const subscription = await prismaBccr.sinpe_subscriptions.findUnique({
    where: { sinpe_number: receiverPhone },
  });

  if (!subscription) {
    throw new Error("El número de destino no está registrado en SINPE Móvil.");
  }

  console.log(`📱 Receptor encontrado en BCCR: ${subscription.sinpe_client_name} (Banco: ${subscription.sinpe_bank_code})`);

  const receiverBankCode = subscription.sinpe_bank_code;
  const LOCAL_BANK_CODE = "119"; // Tu código de banco
  const isInternalTransfer = receiverBankCode === LOCAL_BANK_CODE;

  console.log(`🏦 Tipo de transferencia: ${isInternalTransfer ? 'Interna' : 'Externa'} (${LOCAL_BANK_CODE} → ${receiverBankCode})`);

  const senderLink = await prismaSinpe.phone_links.findUnique({
    where: { phone: senderPhone },
  });

  let fromAccount: any = null;

  if (senderLink) {
    fromAccount = await prismaSinpe.accounts.findUnique({
      where: { number: senderLink.account_number },
    });

    if (!fromAccount) {
      throw new Error("La cuenta origen vinculada al número remitente no existe.");
    }

    // Convertir balance a número para comparación correcta
    const currentBalance = Number(fromAccount.balance);
    console.log(`💰 Balance actual: ${currentBalance} ${currency}, Monto a enviar: ${amount}`);

    if (currentBalance < amount) {
      throw new Error(`Fondos insuficientes en la cuenta origen. Balance: ${currentBalance} ${currency}, Requerido: ${amount} ${currency}`);
    }

    await prismaSinpe.accounts.update({
      where: { id: fromAccount.id },
      data: { balance: { decrement: new Decimal(amount) } },
    });

    console.log(`💸 Fondos descontados de la cuenta ${fromAccount.number}: ${amount} ${currency}`);
  }

  if (isInternalTransfer) {
    console.log("🏠 Procesando transferencia interna - acreditando al receptor");

    const receiverLink = await prismaSinpe.phone_links.findUnique({
      where: { phone: receiverPhone },
    });

    if (!receiverLink) {
      throw new Error("No existe una cuenta vinculada al número receptor en este banco.");
    }

    const toAccount = await prismaSinpe.accounts.findUnique({
      where: { number: receiverLink.account_number },
    });

    if (!toAccount) {
      throw new Error("La cuenta destino no existe.");
    }

    await prismaSinpe.accounts.update({
      where: { id: toAccount.id },
      data: { balance: { increment: new Decimal(amount) } },
    });

    console.log(`💰 Fondos acreditados a la cuenta ${toAccount.number}: ${amount} ${currency}`);

    const transfer = await prismaSinpe.transfers.create({
      data: {
        from_account_id: fromAccount.id,
        to_account_id: toAccount.id,
        amount: new Decimal(amount),
        currency,
        description: comment ?? "",
        status: "completed",
      },
    });

    return transfer;
  } else {
    console.log("🌐 Procesando transferencia externa - enviando a otro banco");

    const payload_firmado = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      transaction_id: `sinpe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender: {
        phone_number: senderPhone
      },
      receiver: {
        phone_number: receiverPhone
      },
      amount: {
        value: amount,
        currency: currency || "CRC"
      },
      description: comment || "Transferencia SINPE Móvil"
    };

    console.log("📦 Payload construido para banco externo:", payload_firmado);

    const { generateHmacForPhoneTransfer } = await import("../utils/generateHmac");
    const hmac_md5 = generateHmacForPhoneTransfer(
      senderPhone,
      payload_firmado.timestamp,
      payload_firmado.transaction_id,
      amount
    );

    const finalPayload = {
      ...payload_firmado,
      hmac_md5
    };

    console.log("🔐 HMAC generado para transferencia SINPE Móvil");

    try {
      const bankUrl = await import("../config/bank.json");
      const banks: Record<string, string> = bankUrl.default;
      const externalBankUrl = banks[receiverBankCode];

      if (!externalBankUrl) {
        throw new Error(`Banco ${receiverBankCode} no registrado en la configuración.`);
      }

      console.log(`🌐 Enviando transferencia SINPE a banco ${receiverBankCode}: ${externalBankUrl}`);

      const response = await fetch(`${externalBankUrl}/api/sinpe-movil-transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
        agent: httpsAgent, 
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del banco ${receiverBankCode}: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log(`✅ Transferencia externa enviada exitosamente:`, result);

      return {
        id: Date.now(),
        from_account_id: fromAccount?.id,
        to_account_id: null,
        amount: new Decimal(amount),
        currency,
        description: comment ?? `Transferencia SINPE a ${receiverPhone} (${subscription.sinpe_client_name})`,
        status: "completed",
        external_transfer: true,
        receiver_bank: receiverBankCode,
        receiver_phone: receiverPhone,
        receiver_name: subscription.sinpe_client_name,
        external_result: result
      };

    } catch (error) {
      console.error("❌ Error enviando transferencia externa:", error);

      if (fromAccount) {
        await prismaSinpe.accounts.update({
          where: { id: fromAccount.id },
          data: { balance: { increment: new Decimal(amount) } },
        });
        console.log("🔄 Débito revertido debido a error en transferencia externa");
      }

      throw error;
    }
  }
};

export const processSinpeMovilIncoming = async (
  senderPhone: string,
  receiverPhone: string,
  amount: number,
  currency: string,
  description?: string
) => {
  console.log(`💰 Procesando transferencia SINPE Móvil entrante: ${senderPhone} → ${receiverPhone} (${amount} ${currency})`);

  const receiverLink = await prismaSinpe.phone_links.findUnique({
    where: { phone: receiverPhone },
  });

  if (!receiverLink) {
    throw new Error("El número receptor no está vinculado a ninguna cuenta en este banco.");
  }

  const toAccount = await prismaSinpe.accounts.findUnique({
    where: { number: receiverLink.account_number },
  });

  if (!toAccount) {
    throw new Error("La cuenta destino no existe.");
  }

  if (toAccount.currency !== currency) {
    throw new Error(`La cuenta destino es en ${toAccount.currency}, pero la transferencia es en ${currency}.`);
  }

  await prismaSinpe.accounts.update({
    where: { id: toAccount.id },
    data: { balance: { increment: new Decimal(amount) } },
  });

  console.log(`💰 Fondos acreditados a la cuenta ${toAccount.number}: ${amount} ${currency}`);

  console.log(`✅ Transferencia SINPE Móvil entrante completada para ${toAccount.number}`);

  return {
    recipient_account: toAccount.number,
    amount_credited: amount,
    currency,
    status: "completed",
    message: `Transferencia SINPE desde ${senderPhone} procesada exitosamente`
  };
};
