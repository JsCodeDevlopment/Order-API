import { Request, Response } from "express";
import { IRegister } from "../../interfaces/IRegister";
import { Register } from "../models/Register";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import { mailSettings } from "../settings/MailSettings";

export const transporter = nodemailer.createTransport(mailSettings);

class RegisterController {
  async create(req: Request, res: Response): Promise<IRegister | undefined> {
    try {
      const { name, email, password, rule } = req.body as IRegister;
      const imagePath = req.file?.filename;

      if (!name && !email && !password && !rule) {
        res.status(400).json({
          error:
            "Nome, email, categoria e/ou senha ausente, esses campos são obrigatórios 🤦‍♂️",
        });
      }

      const userExists = (await Register.findOne({ email })) as IRegister;
      if (userExists) {
        res.status(400).json({
          error: "O email que você está tentando cadastrar já existe. 🤦‍♂️",
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const verificationToken = jwt.sign({ email }, "token-verification", {
        expiresIn: "1d",
      });

      const user = await Register.create({
        name,
        email,
        password: hashedPassword,
        imagePath,
        rule,
        verificationToken,
      });
      await user.save();

      const verificationLink = `${verificationToken}`;
      await transporter.sendMail({
        to: email,
        subject: "Verifique seu email",
        html: 
    `<body style="background-color: #2B2B2B; color: #FFF; font-family: Arial, sans-serif;">
      <div style="text-align: center; padding: 20px;">
        <img src="https://cdn.discordapp.com/attachments/303213411544596481/1192490948765167778/logo-for-lightBG.png?ex=65a944bd&is=6596cfbd&hm=95ad96d53b597afba7eee8a34ee14ca894f2bd73cc60e45efb4b84b2acfc5d70" alt="Logo" width="200">
      </div>
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #E6324B;">Verifique seu email!</h2>
        <p>Parabéns, falta pouco para você concluir a criação de sua conta!</p>
        <p>Copie o token abaixo e cole no sistema para verificar seu e-mail e usar sua conta.</p>
        <div style="background-color: #f0f0f0; padding: 10px; margin-top: 20px;">
            <p style="font-size: 18px; color: #333; margin: 0;">Token: <span style="font-weight: bold; color: #007bff;">${verificationLink}</span></p>
        </div>
    </div>
    <div style="background-color: #000; color: #FFF; text-align: center; padding: 10px; position: fixed; bottom: 0; width: 100%;">
        <p style="color: #E6324B;">PickApp</p>
        <p>© Todos os direitos reservados.</p>
        <p>Designed by <a href="https://jonatas-silva-developer.vercel.app/" style="color: #FFF; text-decoration: none;">Jonatas</a></p>
      </div>
    </body>`,
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
        res.status(400).json({ error: "Erro ao buscar os usuários 🤦‍♂️" });
        return;
      }

      res.json(users);
    } catch (error) {
      console.error(error, "Erro no servidor ao buscar os usuários. 🤦‍♂️");
    }
  }

  async delete(req: Request, res: Response): Promise<void | undefined> {
    try {
      const { id } = req.params;
      const currentUserId = req.user.id;

      const deleteUser = await Register.findById(id);
      if (!deleteUser) {
        res.status(401).json({ error: "Usuário que quer deletar não existe." });
        return;
      }

      if (currentUserId === id) {
        res.status(401).json({ error: "Você não pode deletar a si próprio." });
        return;
      }

      await Register.findByIdAndDelete(id);
      const image = deleteUser.imagePath
      const caminhoImagem = path.join(__dirname, "../../../uploads", image);
      await fs.unlink(caminhoImagem);

      res.status(200).json();
    } catch (error) {
      console.error(error, "Erro no servidor ao apagar o usuário");
    }
  }

  async recoverKey(req: Request, res: Response) {
    try {
    } catch (error) {
      console.error(error, "Erro no servidor ao recuperar senha.");
    }
  }
}

export const registerController = new RegisterController();
