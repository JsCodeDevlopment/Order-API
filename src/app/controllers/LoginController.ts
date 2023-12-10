import { Request, Response } from "express";
import { Register } from "../models/Register";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { transporter } from "./RegisterController";
import { IRegister } from "../../interfaces/IRegister";


class LoginController {
  async login(req: Request, res: Response): Promise<undefined | void> {
    try {
      const { email, password } = req.body;

      const user = await Register.findOne({ email });
      if (!user) {
        res.status(401).json({ message: "Email inexistente." });
        return;
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(401).json({ message: "Senha Inválida." });
      } else {
        const token = jwt.sign({ id: user.id }, "secretpassword");
        res.status(200).json({ token });
      }
    } catch (error) {
      console.error(error, "Erro no servidor ao fazer o login.");
    }
  }

  async verify (req: Request, res: Response): Promise<void> {
    try {
      const verificationToken  = req.params.token

      const user = await Register.findOne({ verificationToken }) as IRegister
      if (user.verificationToken !== verificationToken) {
        res.status(401).json({ message: 'Falha na verificação. Código de verificação inválido.' })
      }

      res.status(200).json({ message: 'Sucesso! agora só logar e usar...' })
    } catch (error) {
      console.error(error, 'Erro no servidor ao verificar o email.')
    }
  }

  async recover(req: Request, res: Response) {
    try {
      const { email } = req.body
      const user = await Register.findOne({ email })
      if(!user) {
        return res.status(404).json({ message: "Usuário não encontrado." })
      }

      const resetPasswordToken = jwt.sign({ email }, "token-to-rever", { expiresIn: '1h' })
      user.resetPasswordToken = resetPasswordToken
      user.resetPasswordExpires = new Date(Date.now() + 1000 * 3600)
      await user.save()

      const resetLink = `http://seu-url-do-aplicativo/reset-password/${resetPasswordToken}`
      await transporter.sendMail({
        to: email,
        subject: 'Redefinir Senha',
        text: `Clique no seguinte link para redefinir sua senha: ${resetLink}`
      })

      res.json({ message: "Um e-mail foi enviado com instruções para redefinir sua senha." })
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async reset(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const payload = jwt.verify(token, "token-to-reset") as { email: string };
      const user = await Register.findOne({ email: payload.email });
      if (
        !user ||
        !user.resetPasswordToken ||
        (user.resetPasswordExpires && user.resetPasswordExpires < new Date())
      ) {
        return res.status(401).json({ message: "Token inválido ou expirado" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      res.status(202).json({ message: "Senha redefinida com sucesso." });
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Token inválido ou expirado" });
    }
  }
}

export const loginController = new LoginController();
