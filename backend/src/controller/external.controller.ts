import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import {
  verifyHmac,
  logTransaction,
  createExternalCredit,
} from "../service/transaction.service";
import { processTransfer } from "../service/transaction.service";

export const receiveTransfer = async (req: Request, res: Response) => {
  const transaction = req.body;

  const {
    version,
    timestamp,
    transaction_id,
    sender,
    receiver,
    amount,
    hmac_md5,
  } = transaction;

  // Validación mínima
  if (
    !version ||
    !timestamp ||
    !transaction_id ||
    !sender ||
    !receiver ||
    !amount ||
    !hmac_md5 ||
    (!sender.account_number && !sender.phone)
  ) {
    return res.status(400).json({ error: "Faltan campos requeridos o identificador de remitente." });
  }

  // Log transacción entrante
  logTransaction(transaction);

  // Verificar validez del HMAC
  const isValid = verifyHmac(transaction, hmac_md5);
  if (!isValid) {
    return res.status(401).json({ error: "HMAC inválido. Transacción rechazada." });
  }

  try {
    // ¿Existe la cuenta del remitente? (solo si es transferencia interna)
    const fromAccount = sender.account_number
      ? await prisma.accounts.findUnique({
          where: { number: sender.account_number },
        })
      : null;

    if (fromAccount) {
      // Transferencia interna
      await processTransfer(transaction);
    } else {
      // Solo acreditar (emisor externo o SINPE Móvil entrante)
      await createExternalCredit(transaction);
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("❌ Error procesando transferencia:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
