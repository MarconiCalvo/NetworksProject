// src/services/user.service.ts
import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma"; // asegúrate de tener este módulo creado

export const createUser = async (
  name: string,
  email: string,
  phone: string,
  password: string
) => {
  const exists = await prisma.users.findUnique({ where: { email } });

  if (exists) {
    throw new Error("El correo ya está registrado.");
  }

  if (!/^\d{8}$/.test(phone)) {
    throw new Error("El número de teléfono debe tener 8 dígitos.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("El correo electrónico no es válido.");
  }

  const password_hash = await bcrypt.hash(password, 10);

  const newUser = await prisma.users.create({
    data: {
      name,
      email,
      phone,
      password_hash,
    },
  });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
  };
};

export const getUsers = async () => {
  const users = await prisma.users.findMany({
    where: {
      NOT: { name: { equals: "Admin", mode: "insensitive" } },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return users;
};
