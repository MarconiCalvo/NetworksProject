import { prisma } from "../utils/prisma";

export const generateIbanNumber = async (): Promise<string> => {
  let iban: string;
  let exists = true;

  do {
    const random = Math.floor(Math.random() * 1_000_000_000_000)
      .toString()
      .padStart(12, "0");
    iban = `CB${random}`;

    // Verificar que no exista ya
    const account = await prisma.accounts.findUnique({
      where: { number: iban },
    });

    exists = !!account;
  } while (exists);

  return iban;
};
