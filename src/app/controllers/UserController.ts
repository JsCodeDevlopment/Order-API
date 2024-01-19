import { Register } from "../models/Register";
import { Request, Response } from "express";

class UserController {
  async me(req: Request, res: Response): Promise<undefined | void> {
    try {
      const { id } = req.user;

      const user = await Register.findById(id);
      if (!user) {
        res.status(500).json({ message: "Usuário não encontrado." });
        return;
      }
      res.status(201).json({user});
    } catch (error) {
      console.error(error, "Erro no servidor ao buscar usuário");
    }
  }
}

export const userController = new UserController();
