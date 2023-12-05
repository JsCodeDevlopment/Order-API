import { Request, Response } from "express";
import { IRegister } from "../../interfaces/IRegister";
import { Register } from "../models/Register";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from 'nodemailer'
import { mailSettings } from "../settings/MailSettings";

export const transporter = nodemailer.createTransport(mailSettings)

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

      const hashedPassword = await bcrypt.hash(password, 12);
      const verificationToken = jwt.sign({ email }, "token-verification", { expiresIn: '1d' })

      const user = await Register.create({
        name,
        email,
        password: hashedPassword,
        imagePath,
        rule,
        verificationToken
      });
      await user.save()

      const verificationLink = `${process.env.BASE_URL}/verify/${verificationToken}`
      await transporter.sendMail({
        to: email,
        subject: "Verifique seu email",
        text: `Clique no seguinte link para verificar seu e-mail: ${verificationLink}`
      })

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
      const { id } = req.params
      const currentUserId = req.user.id

      const deleteUser = await Register.findById(id)
      if(!deleteUser){
        res.status(401).json({ error: 'Usuário que quer deletar não existe.' })
        return
      }

      if(currentUserId === id){
        res.status(401).json({ error: 'Você não pode deletar a si próprio.' })
        return
      }

      await Register.findByIdAndDelete(id)
      res.status(200).json()
    } catch (error) {
      console.error(error, "Erro no servidor ao apagar o usuário");
    }
  }

  async recoverKey(req: Request, res: Response){
    try{

    } catch (error) {
      console.error(error, 'Erro no servidor ao recuperar senha.')
    }
  }
}

export const registerController = new RegisterController();
