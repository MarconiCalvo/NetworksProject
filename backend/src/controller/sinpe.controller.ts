import { Request, Response } from "express";
import {
  sendSinpeTransfer,
  findPhoneSubscription,
  findPhoneLinkForUser,
  processSinpeMovilIncoming,
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
    return res.status(500).json({
      status: "NACK",
      message: "Error del servidor",
    });
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

    if (!sender?.phone_number || !receiver?.phone_number || !amount?.value || !hmac_md5) {
      return res.status(400).json({
        status: "NACK",
        message: "Faltan datos en la solicitud.",
      });
    }

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
      return res.status(403).json({
        status: "NACK",
        message: "HMAC inválido.",
      });
    }

    const transfer = await sendSinpeTransfer(
      sender.phone_number,
      receiver.phone_number,
      amount.value,
      amount.currency,
      description
    );

    return res.status(201).json({
      status: "ACK",
      message: "Transferencia realizada correctamente.",
      transaction_id,
      transfer,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "NACK",
      message: `Error al procesar la transferencia: ${error.message}`,
    });
  }
};

export const receiveSinpeMovilTransfer = async (req: Request, res: Response) => {
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

    console.log("📱 Recibiendo transferencia SINPE Móvil externa:", req.body);

    if (!sender?.phone_number || !receiver?.phone_number || !amount?.value || !hmac_md5) {
      return res.status(400).json({
        status: "NACK",
        message: "Faltan datos en la solicitud SINPE Móvil.",
      });
    }

    const hmacPayload = {
      version,
      timestamp,
      transaction_id,
      sender: {
        phone: sender.phone_number,
        bank_code: sender.bank_code || "external",
        name: sender.name || "Usuario externo"
      },
      receiver: {
        phone: receiver.phone_number,
        account_number: "temp",
        bank_code: "119",
        name: receiver.name || "Usuario local"
      },
      amount,
      description
    };

    const { generateHmacForPhoneTransfer } = await import("../utils/generateHmac");
    const expectedHmac = generateHmacForPhoneTransfer(
      sender.phone_number,
      timestamp,
      transaction_id,
      amount.value
    );

    if (expectedHmac !== hmac_md5) {
      console.log("❌ HMAC inválido para transferencia SINPE Móvil entrante");
      return res.status(403).json({
        status: "NACK",
        message: "HMAC inválido.",
      });
    }

    const result = await processSinpeMovilIncoming(
      sender.phone_number,
      receiver.phone_number,
      amount.value,
      amount.currency || "CRC",
      description
    );

    return res.status(200).json({
      status: "ACK",
      message: "Servicio SINPE Móvil registrado correctamente en ambas bases de datos",
      transaction_id,
      result
    });

  } catch (error: any) {
    console.error("❌ Error procesando transferencia SINPE Móvil entrante:", error.message);
    return res.status(500).json({
      status: "NACK",
      message: `Error al registrar el servicio: ${error.message}`,
    });
  }
};

export const validatePhone = async (req: Request, res: Response) => {
  const { phone } = req.params;

  try {
    const sub = await findPhoneSubscription(phone);

    if (!sub) {
      return res.status(404).json({
        status: "NACK",
        message: "Número no registrado",
      });
    }

    return res.json({
      status: "ACK",
      message: "Número registrado",
      name: sub.sinpe_client_name,
      bank_code: sub.sinpe_bank_code,
      phone: sub.sinpe_number,
    });
  } catch {
    return res.status(500).json({
      status: "NACK",
      message: "Error interno del servidor",
    });
  }
};
