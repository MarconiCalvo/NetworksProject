import { Request, Response } from "express";
import * as transactionService from "../service/transaction.service";

export const generateHmac = (req: Request, res: Response) => {
  try {
    const hmac = transactionService.generateTransactionHmac(req.body);
    res.json({ hmac_md5: hmac });
  } catch (err) {
    console.error("❌ Error generando HMAC:", err);
    res.status(500).json({ error: "Error generando HMAC" });
  }
};

export const receiveTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = req.body;
    const expectedHmac =
      transactionService.generateTransactionHmac(transaction);

    if (expectedHmac !== transaction.hmac_md5) {
      return res
        .status(401)
        .json({ error: "HMAC inválido. Transacción rechazada." });
    }

    transactionService.logTransaction(transaction);
    const result = await transactionService.routeTransfer(transaction);

    res.status(200).json(result);
  } catch (err: any) {
    console.error("❌ Error procesando transacción:", err.message);
    res.status(400).json({ error: err.message });
  }
};
