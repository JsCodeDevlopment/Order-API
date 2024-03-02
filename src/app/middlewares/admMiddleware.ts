import { Request, Response, NextFunction } from "express";

export async function AdminMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user.rule !== "ADM") {
      res.status(401).json({ message: "Você não tem permissão para essa ação." });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ message: "Falha na autenticação de permição de acesso a essa ação." });
  }
}
