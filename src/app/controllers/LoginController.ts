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
        `<body style="background-color: #2B2B2B; width: 100%; height: auto; margin: 0; text-align: center; color: #FFF; font-family: Arial, sans-serif;">

        <div style="width: 100%; max-width: 1082px; text-align: center; padding: 20px;">
            <img src="https://prnt.sc/JFviHo1VXiSO" alt="Logo" width="200px">
        </div>
    
        <div style="width: 100%; max-width: 1082px; text-align: center; padding: 20px;">
            <h2 style="color: #E6324B;">Redefinição de Senha</h2>
            <p>Opa! Falta pouco para você recuperar sua senha, tudo que precisa fazer agora é clicar no botão abaixo e escolher uma nova senha.</p>
            <div style="padding: 10px; text-align: center;">
                <a href="${resetLink}" style="text-decoration: none; cursor: pointer;">
                  <button style="background-color: #E6324B; marim-top: 0; marim-right: auto; marim-bottom: 0; marim-left: auto; color: #FFF; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer; border-radius: 5px;">Clique para Redefinir</button>
                </a>
            </div>
        </div>
    
        <div style="height: auto; width: 100%; max-width: 1082px; background-color: #000; color: #FFF; text-align: center; padding: 10px; bottom: 0;">
        <p style="color: #E6324B;">PickApp</p>
        <p>© Todos os direitos reservados.</p>
        <p>Designed by <a href="https://jonatas-silva-developer.vercel.app/" style="color: #FFF; text-decoration: none;">Jonatas</a></p>
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
