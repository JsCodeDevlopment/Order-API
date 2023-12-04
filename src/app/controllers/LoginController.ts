import { Request, Response } from "express";
import { Register } from "../models/Register";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class LoginController {
  async login(req: Request, res: Response): Promise<undefined | void> {
    try {
      const { email, password } = req.body;

      const user = await Register.findOne({ email })
      if (!user) {
        res.status(401).json({ message: "Email inexistente." });
        return;
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(401).json({ message: "Senha Inválida." });
      } else {
        const token = jwt.sign({id: user.id}, "secretpassword");
        res.status(200).json({ token });
      }
    } catch (error) {
      console.error(error, "Erro no servidor ao fazer o login.");
    }
  }
}

export const loginController = new LoginController()