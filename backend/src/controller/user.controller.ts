import { Request, Response } from "express";
import * as userService from "../service/user.service";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, phone, password } = req.body;

  console.log("✅ Recibido: ", { name, email });

  if (!name || !email || !password) {
    res.status(400).json({ error: "Todos los campos son obligatorios" });
    return;
  }

  try {
    const newUser = await userService.createUser(name, email, phone, password);
    console.log("✅ Usuario creado:", newUser);
    res.status(201).json({ message: "Usuario creado", user: newUser });
  } catch (error: any) {
    console.error("❌ Error al crear usuario:", error.message);
    res.status(409).json({ error: error.message });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await userService.getUsers(); // ✅ Espera la promesa
    res.json(users); // ✅ Devuelve el array directamente
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al cargar usuarios" });
  }
};
