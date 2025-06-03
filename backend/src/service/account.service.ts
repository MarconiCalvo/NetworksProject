import { prisma } from "../utils/prisma";
import { generateIbanNumber } from "../utils/generateIBAN";

export const createAccount = async (
  currency: string,
  balance: number,
  user_id: number
) => {
  const number = await generateIbanNumber();

  // Paso 1: crear la cuenta
  const account = await prisma.accounts.create({
    data: {
      number,
      currency,
      balance,
    },
  });

  // Paso 2: vincular con el usuario
  await prisma.user_accounts.create({
    data: {
      user_id,
      account_id: account.id,
    },
  });

  return account;
};

export const getAccounts = async (userName: string) => {
  if (!userName) {
    throw new Error("userName es requerido");
  }

  if (userName.toLowerCase() === "admin") {
    return prisma.accounts.findMany({
      include: {
        user_accounts: { include: { users: true } },
      },
    });
  }
  const user = await prisma.users.findUnique({
    where: { name: userName },
    include: { user_accounts: true },
  });

  if (!user) throw new Error("Usuario no encontrado");

  const accountIds = user.user_accounts.map((ua) => ua.account_id);

  return prisma.accounts.findMany({
    where: { id: { in: accountIds } },
  });
};

export const getAccountByNumber = async (number: string) => {
  return prisma.accounts.findUnique({
    where: { number },
    select: { id: true },
  });
};

export const getAllAccounts = async () => {
  return prisma.accounts.findMany({
    select: {
      id: true,
      number: true,
      currency: true,
      balance: true,
    },
  });
};

export const getAccountOwnerName = async (
  accountNumber: string
): Promise<string | null> => {
  const account = await prisma.accounts.findUnique({
    where: { number: accountNumber },
    include: {
      user_accounts: {
        include: {
          users: true,
        },
      },
    },
  });

  if (!account || account.user_accounts.length === 0) {
    return null;
  }

  return account.user_accounts[0].users.name;
};

export const getAccountWithTransfers = async (accountNumber: string) => {
  const account = await prisma.accounts.findUnique({
    where: { number: accountNumber },
    include: {
      transfers_transfers_from_account_idToaccounts: true,
      transfers_transfers_to_account_idToaccounts: true,
    },
  });

  if (!account) return null;

  const debits = account.transfers_transfers_from_account_idToaccounts.map(
    (t) => ({
      type: "debit",
      amount: t.amount,
      currency: t.currency,
      date: t.created_at,
    })
  );

  const credits = account.transfers_transfers_to_account_idToaccounts.map(
    (t) => ({
      type: "credit",
      amount: t.amount,
      currency: t.currency,
      date: t.created_at,
    })
  );

  const transactions = [...debits, ...credits].sort(
    (a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime()
  );

  const calculatedBalance = transactions.reduce((sum, t) => {
    return t.type === "credit"
      ? sum + Number(t.amount)
      : sum - Number(t.amount);
  }, 0);

  return {
    id: account.id,
    number: account.number,
    currency: account.currency,
    registeredBalance: Number(account.balance),
    calculatedBalance,
    transactions,
  };
};
