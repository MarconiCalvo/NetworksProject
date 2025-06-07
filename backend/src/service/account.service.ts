import { sinpe } from "../prisma/sinpeClient";
import { generateIbanNumber } from "../utils/generateIBAN";

export const createAccount = async (
  currency: string,
  balance: number,
  user_id: number
) => {
  const number = await generateIbanNumber();

  // Paso 1: crear la cuenta
  const account = await sinpe.accounts.create({
    data: {
      number,
      currency,
      balance,
    },
  });

  // Paso 2: vincular con el usuario
  await sinpe.user_accounts.create({
    data: {
      user_id,
      account_id: account.id,
    },
  });

  return account;
};

export const getAccounts = async (userName: string) => {
  if (userName.toLowerCase() === "admin") {
    const accounts = await sinpe.accounts.findMany({
      include: {
        user_accounts: { include: { users: true } },
      },
    });

    // Convertir balance de Decimal a número
    return accounts.map(account => ({
      ...account,
      balance: Number(account.balance)
    }));
  }

  const user = await sinpe.users.findUnique({
    where: { name: userName },
    include: { user_accounts: true },
  });

  if (!user) throw new Error("Usuario no encontrado");

  const accountIds = user.user_accounts.map((ua: { account_id: number }) => ua.account_id);

  const accounts = await sinpe.accounts.findMany({
    where: { id: { in: accountIds } },
  });

  // Convertir balance de Decimal a número
  return accounts.map(account => ({
    ...account,
    balance: Number(account.balance)
  }));
};

export const getAccountByNumber = async (number: string) => {
  return sinpe.accounts.findUnique({
    where: { number },
    select: { id: true },
  });
};

export const getAllAccounts = async () => {
  const accounts = await sinpe.accounts.findMany({
    select: {
      id: true,
      number: true,
      currency: true,
      balance: true,
    },
  });

  // Convertir balance de Decimal a número
  return accounts.map(account => ({
    ...account,
    balance: Number(account.balance)
  }));
};

export const getAccountOwnerName = async (
  accountNumber: string
): Promise<string | null> => {
  const account = await sinpe.accounts.findUnique({
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
  const account = await sinpe.accounts.findUnique({
    where: { number: accountNumber },
    include: {
      transfers_transfers_from_account_idToaccounts: true,
      transfers_transfers_to_account_idToaccounts: true,
    },
  });

  if (!account) return null;

  const debits = account.transfers_transfers_from_account_idToaccounts.map(
    (t: { amount: any; currency: string; created_at: Date | null }) => ({
      type: "debit",
      amount: Number(t.amount), // Convertir Decimal a número
      currency: t.currency,
      date: t.created_at,
    })
  );

  const credits = account.transfers_transfers_to_account_idToaccounts.map(
    (t: { amount: any; currency: string; created_at: Date | null }) => ({
      type: "credit",
      amount: Number(t.amount), // Convertir Decimal a número
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
