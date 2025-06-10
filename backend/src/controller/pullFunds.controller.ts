import { Request, Response } from "express";
import * as pullFundsService from "../service/pullFunds.service";

export const enviarPullFunds = async (req: Request, res: Response) => {
  const { account_number, cedula, monto, bancoDestino, localAccountNumber } = req.body;

  if (!account_number || !cedula || !monto || !bancoDestino || !localAccountNumber) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    const result = await pullFundsService.enviarPullFunds({
      account_number,
      cedula,
      monto,
      bancoDestino,
      localAccountNumber,
    });
    return res.status(result.ok ? 200 : 400).json(result.data);
  } catch (err: any) {
    return res.status(500).json({
      error: "Error al enviar la solicitud pull funds",
      detalle: err.message,
    });
  }
};