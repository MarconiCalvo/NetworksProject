import { sinpe as prismaSinpe } from "../prisma/sinpeClient";
import { bccr as prismaBccr } from "../prisma/bccrClient";

export const findPhoneLinkForUser = async (username: string) => {
  // Buscar al usuario por nombre
  const user = await prismaSinpe.users.findUnique({
    where: { name: username },
    select: {
      id: true,
      user_accounts: {
        select: {
          accounts: {
            select: { number: true },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Buscar si alguna cuenta tiene vínculo en phone_links
  for (const ua of user.user_accounts) {
    const accountNumber = ua.accounts.number;

    const phoneLink = await prismaSinpe.phone_links.findUnique({
      where: { account_number: accountNumber },
    });

    if (phoneLink) {
      return {
        phone: phoneLink.phone,
        account: accountNumber,
      };
    }
  }

  return null;
};

export const findPhoneSubscription = async (phone: string) => {
  return await prismaBccr.sinpe_subscriptions.findUnique({
    where: { sinpe_number: phone },
    select: {
      sinpe_number: true,
      sinpe_bank_code: true,
      sinpe_client_name: true,
    },
  });
};

export const sendSinpeTransfer = async (
  senderPhone: string,
  receiverPhone: string,
  amount: number,
  currency: string,
  comment?: string
) => {
  // 1. Validar que el número receptor esté registrado en BCCR
  const subscription = await prismaBccr.sinpe_subscriptions.findUnique({
    where: { sinpe_number: receiverPhone },
  });

  if (!subscription) {
    throw new Error("El número de destino no está registrado en SINPE Móvil.");
  }

  // 2. Obtener cuenta destino (nuestra base de datos)
  const receiverLink = await prismaSinpe.phone_links.findUnique({
    where: { phone: receiverPhone },
  });

  if (!receiverLink) {
    throw new Error("No existe una cuenta vinculada al número receptor.");
  }

  const toAccount = await prismaSinpe.accounts.findUnique({
    where: { number: receiverLink.account_number },
  });

  if (!toAccount) {
    throw new Error("La cuenta destino no existe.");
  }

  // 3. Buscar si el emisor está en phone_links (si no, asumimos externo)
  const senderLink = await prismaSinpe.phone_links.findUnique({
    where: { phone: senderPhone },
  });

  let fromAccountId: number | null = null;

  if (senderLink) {
    const from = await prismaSinpe.accounts.findUnique({
      where: { number: senderLink.account_number },
    });

    if (!from) {
      throw new Error(
        "La cuenta origen vinculada al número remitente no existe."
      );
    }

    if (Number(from.balance) < amount) {
      throw new Error("Fondos insuficientes en la cuenta origen.");
    }

    fromAccountId = from.id;

    // Descontar fondos del emisor
    await prismaSinpe.accounts.update({
      where: { id: from.id },
      data: { balance: { decrement: amount } },
    });
  }

  // 4. Acreditar fondos al receptor
  await prismaSinpe.accounts.update({
    where: { id: toAccount.id },
    data: { balance: { increment: amount } },
  });

  // 5. Registrar transferencia
  const transfer = await prismaSinpe.transfers.create({
    data: {
      from_account_id: fromAccountId ??0, // puede ser null si viene de banco externo
      to_account_id: toAccount.id,
      amount,
      currency,
      description: comment ?? "",
      status: "completed",
    },
  });

  return transfer;
};
