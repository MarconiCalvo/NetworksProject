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
    !hmac_md5
  ) {
    return res.status(400).json({ error: "Faltan campos requeridos." });
  }

  // Registrar la transacción en logs
  logTransaction(transaction);

  // Validar HMAC
  const isValid = verifyHmac(transaction, hmac_md5);
  if (!isValid) {
    return res.status(401).json({ error: "HMAC inválido." });
  }

  try {
    // Verificamos si la cuenta emisora existe
    const fromAccount = await prisma.accounts.findUnique({
      where: { number: sender.account_number },
    });

    if (fromAccount) {
      await processTransfer(transaction); // Transferencia entre dos cuentas locales
    } else {
      await createExternalCredit(transaction); // Solo acreditar
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
