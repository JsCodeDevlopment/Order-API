import { Request, Response } from "express";
import { IRegister } from "../../interfaces/IRegister";
import { Register } from "../models/Register";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { mailSettings } from "../settings/MailSettings";
import { TemplateCreateAccount } from "../settings/templates/createAccount";

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
        html: TemplateCreateAccount(verificationLink),
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

  async change(req: Request, res: Response): Promise<IRegister | undefined> {
    try {
      const { name, id } = req.body as IRegister;
      const imagePath = req.file?.filename;

      if (!name && !imagePath) {
        res.status(400).json({ error: "Não há nada para alterar" });
        return;
      }

      const User = await Register.findById(id) as IRegister
      if(User.name === name){
        res.status(400).json({ error: "Não existe motivos para trocar o nome para o mesmo que já está usando." })
        return
      }

      if (imagePath) {
        const image = imagePath;
        const caminhoImagem = path.join(__dirname, "../../../uploads", image);
        fs.access(caminhoImagem, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(caminhoImagem, (err) => {
              if (err) {
                console.error(err, "Erro ao deletar imagem antiga.");
              }
            });
          } else {
            console.error("Arquivo não encontrado.");
          }
        });
      }

      const changedUser = await Register.findByIdAndUpdate(id, {name, imagePath})
      res.status(200).json(changedUser)
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
      const image = deleteUser.imagePath;
      const caminhoImagem = path.join(__dirname, "../../../uploads", image);
      fs.access(caminhoImagem, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(caminhoImagem, (err) => {
            if (err) {
              console.error(err, "Erro ao deletar imagem antiga.");
            }
          });
        } else {
          console.error("Arquivo não encontrado.");
        }
      });

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
