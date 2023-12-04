import { Request, Response, NextFunction } from "express";

export async function AdiminMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user.rule !== "ADM") {
      res.status(401).json({ message: "Não autorizado. Você não tem permissão para deletar usuários." });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ message: "Token Inválido" });
  }
}
