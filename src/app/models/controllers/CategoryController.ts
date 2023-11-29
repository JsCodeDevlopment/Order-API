import { Request, Response } from "express";
import { ICategory } from "../../../interfaces/ICategory";

class CategoryController {
  async store(req: Request, res: Response): Promise<ICategory | undefined> {
    try {
      const { name, icon } = req.body as ICategory;
      if (!name && !icon) {
        res.status(400).json({
          error: "Nome e/ou icone ausente, esses campos são obrigatórios 🤦‍♂️",
        });
      }

      const categoryExists = await repositoryCategory.fyndByName(name)
      if (categoryExists) {
        res.status(400).json({
            error: 'A categoria que você está tentando criar já existe. 🤦‍♂️'
        })
        return
      }

      const category = await repositoryCategory.create({
        name, icon
      })

      res.json(category)
    } catch (error) {}
  }
}

export const categoryController = new CategoryController();
