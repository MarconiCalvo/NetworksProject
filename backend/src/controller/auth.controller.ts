import { Request, Response } from "express";
import { loginUser } from "../service/auth.service";

export const login = async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body;

    const user = await loginUser(name, password);
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};
