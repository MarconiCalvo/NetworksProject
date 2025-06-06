import { Request, Response } from "express";
import * as phoneLinkService from "../service/phoneLink.service";

export const associatePhone = async (req: Request, res: Response) => {
  const { account_number, phone, user_name } = req.body;

  if (!account_number || !phone || !user_name) {
    return res.status(400).json({
      error: "Se requieren 'account_number', 'phone' y 'user_name'."
    });
  }

  try {
    const result = await phoneLinkService.linkPhoneToAccount(account_number, phone, user_name);
    return res.status(201).json({
      message: "Teléfono vinculado correctamente.",
      data: result
    });
  } catch (error: any) {
    return res.status(400).json({
      error: error.message || "Error al asociar teléfono."
    });
  }
};
