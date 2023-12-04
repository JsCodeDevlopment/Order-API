import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Register } from "../models/Register";

export async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.header("Authorization");
  if (!authorization) {
    res.status(401).json({ message: "Token não fornecido." });
    return;
  }
  const token = authorization.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, "secretpassword") as any;

    const user = await Register.findById(decoded.id);

    if (!user) {
      res.status(401).json({ message: "Usuário não encontrado." });
      return
    }

    req.user = { id: user.id, rule: user.rule };
    next();
  } catch (error) {
    res.status(401).json({ message: "Token Inválido" });
  }
}
