import { Request, Response } from "express";
import {
  sendSinpeTransfer,
  findPhoneSubscription,
  findPhoneLinkForUser,
} from "../service/sinpe.service";
import { verifyHmac } from "../service/transaction.service";

export const checkUserSinpeLink = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const result = await findPhoneLinkForUser(username);

    if (!result) {
      return res.json({ linked: false });
    }

    return res.json({
      linked: true,
      phone: result.phone,
      account: result.account,
    });
  } catch (err) {
    console.error("❌ Error en verificación SINPE:", err);
    return res.status(500).json({ error: "Error del servidor" });
  }
};

export const handleSinpeTransfer = async (req: Request, res: Response) => {
  try {
    const {
      version,
      timestamp,
      transaction_id,
      sender,
      receiver,
      amount,
      description,
      hmac_md5,
    } = req.body;

    // Validar campos obligatorios
    if (!sender?.phone || !receiver?.phone || !amount?.value || !hmac_md5) {
      return res.status(400).json({ error: "Faltan datos en la solicitud." });
    }

    // Validar HMAC
    const isValid = verifyHmac(
      {
        version,
        timestamp,
        transaction_id,
        sender,
        receiver,
        amount,
        description,
      },
      hmac_md5
    );

    if (!isValid) {
      return res.status(403).json({ error: "HMAC inválido." });
    }

    const transfer = await sendSinpeTransfer(
      sender.phone,
      receiver.phone,
      amount.value,
      amount.currency,
      description
    );

    res.status(201).json({ message: "Transferencia realizada.", transfer });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Error al procesar transferencia." });
  }
};
export const validatePhone = async (req: Request, res: Response) => {
  const { phone } = req.params;

  try {
    const sub = await findPhoneSubscription(phone);

    if (!sub) {
      return res.status(404).json({ error: "No registrado" });
    }

    return res.json({
      name: sub.sinpe_client_name,
      bank_code: sub.sinpe_bank_code,
    });
  } catch {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
