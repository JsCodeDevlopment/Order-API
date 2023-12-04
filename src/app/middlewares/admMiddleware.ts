import { Request, Response, NextFunction } from "express";

export async function AdiminMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user.rule !== "ADM") {
      res.status(401).json({ message: "Não autorizado." });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ message: "Token Inválido" });
  }
}
