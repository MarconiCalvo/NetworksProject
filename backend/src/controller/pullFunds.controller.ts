import { Request, Response } from "express";
import { handleEnviarPullFunds, handleRecibirPullFunds } from "../service/pullFunds.service";

export const pullFundsService = async (req: Request, res: Response) => {
  try {
    const result = await handleEnviarPullFunds(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error en pullFundsService:", error);
    res.status(error.status || 500).json({
      error: error.message || "Error interno del servidor"
    });
  }
};

export const pullFundsReceiver = async (req: Request, res: Response) => {
  try {
    const result = await handleRecibirPullFunds(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error en pullFundsReceiver:", error);
    res.status(error.status || 500).json({
      error: error.message || "Error interno del servidor"
    });
  }
};
