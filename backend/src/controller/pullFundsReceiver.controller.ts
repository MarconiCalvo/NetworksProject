import { Request, Response } from "express";
import { sinpe } from "../prisma/sinpeClient";

export const recibirPullFunds = async (req: Request, res: Response) => {
  const { account_number, cedula, monto } = req.body;

  // 1. Validar datos
  if (!account_number || !cedula || !monto) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  // 2. Buscar la cuenta
  const cuenta = await sinpe.accounts.findUnique({
    where: { number: account_number },
  });

  if (!cuenta) {
    return res.status(404).json({ error: "Cuenta no encontrada" });
  }

  // 3. Verificar saldo suficiente
  if (cuenta.balance.lt(monto)) {
    return res.status(400).json({ error: "Saldo insuficiente" });
  }

  // 4. Restar el monto al balance
  await sinpe.accounts.update({
    where: { number: account_number },
    data: {
      balance: cuenta.balance.minus(monto),
    },
  });

  // 5. Responder éxito
  return res.json({ mensaje: "Pull funds realizado correctamente" });
};