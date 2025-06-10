import { sinpe } from "../prisma/sinpeClient";
import fetch from "node-fetch";
import https from "https";

interface PullFundsParams {
  account_number: string;
  cedula: string;
  monto: number;
  bancoDestino: { ip: string; puerto: string };
  localAccountNumber: string;
}

export const enviarPullFunds = async ({
  account_number,
  cedula,
  monto,
  bancoDestino,
  localAccountNumber,
}: PullFundsParams) => {
  const url = `https://${bancoDestino.ip}:${bancoDestino.puerto}/api/pull-funds`;

  const respuesta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account_number, cedula, monto }),
    agent: new https.Agent({ rejectUnauthorized: false }), // Solo para desarrollo
  });

  const data = await respuesta.json();

  if (respuesta.ok) {
    // Sumar el monto al balance de la cuenta local
    const cuentaLocal = await sinpe.accounts.findUnique({
      where: { number: localAccountNumber },
    });

    if (cuentaLocal) {
      await sinpe.accounts.update({
        where: { number: localAccountNumber },
        data: {
          balance: cuentaLocal.balance.plus(monto),
        },
      });
    }
  }

  return { ok: respuesta.ok, data };
};