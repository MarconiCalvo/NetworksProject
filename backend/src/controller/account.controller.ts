import { Request, Response } from "express";
import * as accountService from "../service/account.service";
import { generateIbanNumber } from "../utils/generateIBAN";

export const createAccount = async (req: Request, res: Response) => {
  const { currency, balance, user_id } = req.body;

  if (!currency || !balance || !user_id) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    const newAccount = await accountService.createAccount(
      currency,
      balance,
      user_id
    );
    return res.status(201).json(newAccount);
  } catch (err: any) {
    console.error("❌ Error al crear cuenta:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const getNewIban = async (_req: Request, res: Response) => {
  try {
    const iban = await generateIbanNumber();
    res.status(200).json({ iban });
  } catch (err: any) {
    res.status(500).json({ error: "No se pudo generar un IBAN." });
  }
};

export const getAccounts = async (req: Request, res: Response) => {
  const user = req.query.user as string;

  try {
    const accounts = await accountService.getAccounts(user);
    res.json(accounts);
  } catch (err: any) {
    console.error("Error al obtener cuentas:", err.message);
    res.status(500).json({ error: "Error al cargar cuentas" });
  }
};

export const getAccountByNumber = async (req: Request, res: Response) => {
  const { number } = req.params;

  if (!number) {
    return res.status(400).json({ error: "El número de cuenta es requerido." });
  }

  try {
    const account = await accountService.getAccountByNumber(number);
    if (!account) {
      return res.status(404).json({ error: "Cuenta no encontrada." });
    }
    res.json(account);
  } catch (error: any) {
    console.error("❌ Error al buscar cuenta:", error.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const getAllAccounts = async (_req: Request, res: Response) => {
  try {
    const accounts = await accountService.getAllAccounts();
    res.json(accounts);
  } catch (err: any) {
    console.error("❌ Error al obtener todas las cuentas:", err.message);
    res.status(500).json({ error: "Error al obtener las cuentas." });
  }
};

export const getAccountOwnerName = async (req: Request, res: Response) => {
  const { number } = req.params;

  try {
    const ownerName = await accountService.getAccountOwnerName(number);
    if (!ownerName) {
      return res
        .status(404)
        .json({ error: "No se encontró el dueño de la cuenta." });
    }
    res.json({ name: ownerName });
  } catch (err: any) {
    console.error("Error al obtener dueño de la cuenta:", err.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const getAccountTransactionDetails = async (
  req: Request,
  res: Response
) => {
  const { number } = req.params;

  try {
    const result = await accountService.getAccountWithTransfers(number);

    if (!result) {
      return res.status(404).json({ error: "Cuenta no encontrada." });
    }

    res.json(result);
  } catch (err: any) {
    console.error("❌ Error al obtener detalles de la cuenta:", err.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
