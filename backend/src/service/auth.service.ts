import { sinpe } from "../prisma/sinpeClient";
import bcrypt from "bcryptjs";

export const loginUser = async (name: string, password: string) => {
  const user = await sinpe.users.findUnique({ where: { name } });

  if (!user) {
    throw new Error("Nombre o contraseña incorrectos");
  }

  const hashed = user.password_hash?.trim(); // Limpia espacios si hay
  const plain = password.trim();

  const isPasswordValid =
    hashed === plain || (await bcrypt.compare(plain, hashed));

  if (!isPasswordValid) {
    throw new Error("Nombre o contraseña incorrectos");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};
