import { Request, Response } from "express";
import { IRegister } from "../../interfaces/IRegister";
import { Register } from "../models/Register";

class RegisterController {
  async create(req: Request, res: Response): Promise<IRegister | undefined> {
    try {
      const { name, email, password, rule } = req.body as IRegister;
      const imagePath = req.file?.filename;

      if (!imagePath) {
        console.log("o imagePath tá vazio mano");
      }

      if (!name && !email && !password && !rule) {
        res.status(400).json({
          error:
            "Nome, email, categoria e/ou senha ausente, esses campos são obrigatórios 🤦‍♂️",
        });
      }

      const userExists = await Register.findOne({ email });
      if (userExists) {
        res.status(400).json({
          error: "O email que você está tentando cadastrar já existe. 🤦‍♂️",
        });
        return;
      }

      const user = await Register.create({
        name,
        email,
        password,
        imagePath,
        rule,
      });

      res.status(201).json(user);
    } catch (error) {
      console.error(error, "Erro na criação desse usuário. 🤦‍♂️");
    }
  }

  async showAll(req: Request, res: Response): Promise<IRegister | undefined> {
    try {
      const users = await Register.find();

      if (!users) {
        res.status(500).json({ error: "Erro ao buscar os usuários 🤦‍♂️" });
        return;
      }

      res.json(users);
    } catch (error) {
      console.error(error, "Erro no servidor ao buscar os usuários. 🤦‍♂️");
    }
  }
}

export const registerController = new RegisterController();
