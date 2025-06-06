import { prisma } from "./prisma";

export const generateIbanNumber = async (): Promise<string> => {
  let iban: string;
  let exists = true;

  const countryCode = "CR";
  const checkDigits = "21"; // Opcional: se puede calcular luego
  const fixedZero = "0";
  const bankCode = "119";   // Cambia según tu banco
  const branchCode = "0001"; // Como indicaste

  do {
    // Número de cuenta del cliente: 12 dígitos aleatorios
    const accountNumber = Math.floor(Math.random() * 1_000_000_000_000)
      .toString()
      .padStart(12, "0");

    iban = `${countryCode}${checkDigits}${fixedZero}${bankCode}${branchCode}${accountNumber}`;

    // Verificar si ya existe en la BD
    const account = await prisma.accounts.findUnique({
      where: { number: iban },
    });

    exists = !!account;
  } while (exists);

  return iban;
};
