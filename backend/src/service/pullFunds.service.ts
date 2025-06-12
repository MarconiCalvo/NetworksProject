import { prisma } from "../utils/prisma";
import https from "https";
import fetch from "node-fetch";
import { Decimal } from "@prisma/client/runtime/library";

interface ErrorResponse {
  error?: string;
  message?: string;
}

const EXTERNAL_ACCOUNT_ID = 999999;

export const handleRecibirPullFunds = async (data: {
  account_number: string;
  cedula: string;
  monto: string;
}) => {
  const { account_number, cedula, monto } = data;

  if (!account_number || !cedula || !monto) {
    throw { status: 400, message: "Faltan datos obligatorios" };
  }

  const cuenta = await prisma.accounts.findUnique({
    where: { number: account_number }
  });

  if (!cuenta) {
    throw { status: 404, message: "Cuenta no encontrada" };
  }

  const usuario = await prisma.users.findUnique({
    where: { id: cuenta.id }
  });

  if (!usuario || usuario.cedula !== cedula) {
    throw { status: 403, message: "Cédula no coincide con el dueño de la cuenta" };
  }

  if (cuenta.balance < new Decimal(monto)) {
    throw { status: 400, message: "Fondos insuficientes" };
  }

  // Realizar la transacción
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Debitar fondos
      const updatedAccount = await tx.accounts.update({
        where: { id: cuenta.id },
        data: {
          balance: {
            decrement: new Decimal(monto)
          }
        }
      });

      // Registrar la transacción
      await tx.transfers.create({
        data: {
          from_account_id: cuenta.id,
          to_account_id: EXTERNAL_ACCOUNT_ID,
          amount: new Decimal(monto),
          currency: cuenta.currency,
          status: "completed",
          description: "Débito por pull funds - Transferencia externa"
        }
      });

      return updatedAccount;
    });

    return {
      message: "Fondos debitados exitosamente",
      account: result
    };
  } catch (error) {
    console.error("Error en la transacción:", error);
    throw { status: 500, message: "Error al procesar la transacción" };
  }
};

export const handleEnviarPullFunds = async (data: {
  account_number: string;
  cedula: string;
  monto: string;
  bancoDestino: { ip: string; puerto: number };
  localAccountNumber: string;
}) => {
  const { account_number, cedula, monto, bancoDestino, localAccountNumber } = data;

  if (!account_number || !cedula || !monto || !bancoDestino || !localAccountNumber) {
    throw { status: 400, message: "Faltan datos" };
  }

  try {
    // Verificar que la cuenta local existe antes de hacer la solicitud
    const cuentaLocal = await prisma.accounts.findUnique({
      where: { number: localAccountNumber }
    });

    if (!cuentaLocal) {
      throw { status: 404, message: "Cuenta local no encontrada" };
    }

    // Configurar la solicitud al otro banco
    const url = `https://${bancoDestino.ip}:${bancoDestino.puerto}/pull-funds`;
    console.log("Enviando solicitud a:", url);

    const respuesta = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ account_number, cedula, monto }),
      agent: new https.Agent({ 
        rejectUnauthorized: false,
        keepAlive: true
      })
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json() as ErrorResponse;
      throw { 
        status: respuesta.status, 
        message: errorData.error || errorData.message || "Error al solicitar fondos" 
      };
    }

    // Si la respuesta es exitosa, acreditar los fondos localmente
    const result = await prisma.$transaction(async (tx) => {
      // Acreditar fondos
      const updatedAccount = await tx.accounts.update({
        where: { number: localAccountNumber },
        data: {
          balance: {
            increment: new Decimal(monto)
          }
        }
      });

      // Registrar la transacción
      await tx.transfers.create({
        data: {
          from_account_id: EXTERNAL_ACCOUNT_ID,
          to_account_id: cuentaLocal.id,
          amount: new Decimal(monto),
          currency: cuentaLocal.currency,
          status: "completed",
          description: `Pull funds recibidos desde cuenta ${account_number} - Transferencia externa`
        }
      });

      return updatedAccount;
    });

    return {
      message: "Fondos recibidos exitosamente",
      account: result
    };
  } catch (error: any) {
    console.error("Error en pull funds:", error);
    throw {
      status: error.status || 500,
      message: error.message || "Error al procesar la solicitud"
    };
  }
};
