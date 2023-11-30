import { Request, Response } from "express";
import { ICategory } from "../../interfaces/ICategory";
import { Category } from "../models/Category";

class CategoryController {
  async create(req: Request, res: Response): Promise<ICategory | undefined> {
    try {
      const { name, icon } = req.body as ICategory;
      if (!name && !icon) {
        res.status(400).json({
          error: "Nome e/ou icone ausente, esses campos são obrigatórios 🤦‍♂️",
        });
      }

      const categoryExists = await Category.findOne({ name });
      if (categoryExists) {
        res.status(400).json({
          error: "A categoria que você está tentando criar já existe. 🤦‍♂️",
        });
        return;
      }

      const category = await Category.create({
        name,
        icon,
      });

      res.json(category);
    } catch (error) {
      console.error(error, "Erro na criação dessa categoria. 🤦‍♂️");
    }
  }

  async showAll(req: Request, res: Response): Promise<ICategory | undefined> {
    try {
      const categories = await Category.find();

      if (!categories) {
        res.status(500).json({ error: "Erro ao buscar suas categorias 🤦‍♂️" });
        return;
      }

      res.json(categories);
    } catch (error) {
      console.error(error, "Erro no servidor ao buscar suas categorias. 🤦‍♂️");
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await Category.findByIdAndDelete( id );

      if(deleted){
        res.status(200).json()
      }

    } catch (error) {
      console.error(error, "Erro no servidor ao deletar sua categoria. 🤦‍♂️");
    }
  }
}

export const categoryController = new CategoryController();
