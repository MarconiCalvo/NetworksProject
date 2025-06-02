// src/controllers/message.controller.ts

import { Request, Response } from "express";

export const receiveMessage = (req: Request, res: Response) => {
  console.log("📥 Headers:", req.headers);
  console.log("📦 Raw body recibido:", req.body);

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Falta el campo 'message'." });
    }

    return res.status(200).json({ success: true, received: message });
  } catch (err: any) {
    console.error("❌ Error procesando JSON:", err.message);
    return res.status(500).json({ error: "Error interno." });
  }
};
