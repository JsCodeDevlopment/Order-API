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

      const resetLink = `${process.env.FRONT_BASE_URL}/changepassword?token=${resetPasswordToken}`;
      await transporter.sendMail({
        to: email,
        subject: "Redefinir Senha",
        html: 
        `<body style="background-color: #2B2B2B; color: #FFF; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
          <div style="padding: 20px;">
            <img src="https://cdn.discordapp.com/attachments/303213411544596481/1192490948765167778/logo-for-lightBG.png?ex=65a944bd&is=6596cfbd&hm=95ad96d53b597afba7eee8a34ee14ca894f2bd73cc60e45efb4b84b2acfc5d70" alt="Logo" width="200">
          </div>
          <h2 style="color: #E6324B;">Redefinição de Senha</h2>
          <p>Por favor, clique no botão abaixo para redefinir sua senha:</p>
          <div style="margin-top: 20px; bargin-bottom: 20px;">
            <a href="${resetLink}" style="text-decoration: none;">
              <button style="background-color: #E6324B; color: #FFF; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer; border-radius: 5px;">Clique para Redefinir</button>
            </a>
          </div>
          <div style="display: inline-block; margim-top: 40px; background-color: #000; color: #FFF; text-align: center; padding: 10px; position: fixed; bottom: 0; width: 100%;">
            <p style="color: #E6324B;">PickApp</p>
            <p>© Todos os direitos reservados.</p>
            <p>Designed by <a href="https://jonatas-silva-developer.vercel.app/" style="color: #FFF; text-decoration: none;">Jonatas</a></p>
          </div>
        </div>
      </body>`,
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
      const token = req.query.token as string;
      const { password } = req.body;

      const payload = jwt.verify(token, "token-to-rever") as { email: string };
      const user = await Register.findOne({ email: payload.email });
      if (!user || !user.resetPasswordToken || (user.resetPasswordExpires && user.resetPasswordExpires < new Date())) {
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
