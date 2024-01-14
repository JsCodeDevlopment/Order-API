import { Request, Response } from "express";
import { Register } from "../models/Register";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { transporter } from "./RegisterController";

class LoginController {
  async login(req: Request, res: Response): Promise<undefined | void> {
    try {
      const { email, password } = req.body;

      if(!email && !password){
        res.status(401).json({ message: "Email e/ou senha ausentes. Esses campos são obrigatórios!" })
      }

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
        res.status(200).json({ token, user });
      }
    } catch (error) {
      console.error(error, "Erro no servidor ao fazer o login.");
    }
  }

  async verify(req: Request, res: Response): Promise<void> {
    try {
      const token = req.params.token;
      let decoded;

      try {
        decoded = jwt.verify(token, "token-verification") as { email: string };
      } catch {
        res.status(401).json({
            message: "Falha na verificação. Código de verificação inválido.",
          });
        return;
      }

      const user = await Register.findOne({ verificationToken: token });
      if (user?.email !== decoded.email) {
        res
          .status(401)
          .json({
            message: "Falha na verificação. Código de verificação inválido.",
          });
        return;
      }
      await Register.updateOne({ _id: user._id }, { isVerified: true });
      const accessToken = jwt.sign({ id: user.id }, "secretpassword");
      res.status(200).json({ token: accessToken });
    } catch (error) {
      console.error(error, "Erro no servidor ao verificar o email.");
    }
  }

  async recover(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await Register.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      const resetPasswordToken = jwt.sign({ email }, "token-to-rever", {
        expiresIn: "1h",
      });
      user.resetPasswordToken = resetPasswordToken;
      user.resetPasswordExpires = new Date(Date.now() + 1000 * 3600);
      await user.save();

      const resetLink = `http://seu-url-do-aplicativo/reset-password/${resetPasswordToken}`;
      await transporter.sendMail({
        to: email,
        subject: "Redefinir Senha",
        text: `Clique no seguinte link para redefinir sua senha: ${resetLink}`,
      });

      res.json({
        message:
          "Um e-mail foi enviado com instruções para redefinir sua senha.",
      });
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
