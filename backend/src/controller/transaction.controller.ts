import { Request, Response } from "express";
import * as transactionService from "../service/transaction.service";
import {
  generateHmacForAccountTransfer,
  generateHmacForPhoneTransfer,
} from "../utils/generateHmac";

export const generateHmac = (req: Request, res: Response) => {
  try {
    const { sender, timestamp, transaction_id, amount } = req.body;

    if (!sender || !timestamp || !transaction_id || !amount?.value) {
      return res.status(400).json({ error: "Datos incompletos para generar HMAC." });
    }

    let hmac: string;

    if (sender.phone) {
      hmac = generateHmacForPhoneTransfer(
        sender.phone,
        timestamp,
        transaction_id,
        amount.value
      );
    } else if (sender.account_number) {
      hmac = generateHmacForAccountTransfer(
        sender.account_number,
        timestamp,
        transaction_id,
        amount.value
      );
    } else {
      return res.status(400).json({ error: "Falta número de cuenta o teléfono del remitente." });
    }

    res.json({ hmac_md5: hmac });
  } catch (err) {
    console.error("❌ Error generando HMAC:", err);
    res.status(500).json({ error: "Error generando HMAC" });
  }
};

export const receiveTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = req.body;

    if (!transaction?.hmac_md5) {
      return res.status(400).json({ error: "HMAC no proporcionado." });
    }

    const isValid = transactionService.verifyHmac(transaction, transaction.hmac_md5);

    if (!isValid) {
      return res.status(401).json({ error: "HMAC inválido. Transacción rechazada." });
    }

    transactionService.logTransaction(transaction);
    const result = await transactionService.routeTransfer(transaction);

    res.status(200).json(result);
  } catch (err: any) {
    console.error("❌ Error procesando transacción:", err.message);
    res.status(400).json({ error: err.message });
  }
};
