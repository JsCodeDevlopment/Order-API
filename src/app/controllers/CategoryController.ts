import { Request, Response } from "express";
import { ICategory, IFullCategory } from "../../interfaces/ICategory";
import { Category } from "../models/Category";
import { Product } from "../models/Product";

class CategoryController {
  async create(req: Request, res: Response): Promise<ICategory | undefined> {
    try {
      const { name, icon } = req.body as ICategory;
      if (!name && !icon) {
        res.status(400).json({
          error: "Nome e/ou icone ausente, esses campos são obrigatórios",
        });
      }

      const categoryExists = await Category.findOne({ name });
      if (categoryExists) {
        res.status(400).json({
          error: "A categoria que você está tentando criar já existe.",
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

  async showWithProducts(req: Request, res: Response): Promise<IFullCategory | void> {
    try {
      const categories = await Category.find();
      const categoriesWithProductInfo = await Promise.all(categories.map(async (category) => {
          const products = await Product.find({ category: category._id }, '_id name imagePath');
          const productCount = products.length;
          return { category: category.toObject(), productCount, products };
      }));
      res.json(categoriesWithProductInfo);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories with product info' });
  }
  }

  async change(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const { icon, name } = req.body;

      const existsCategory = await Category.findById(categoryId) as ICategory

      if (existsCategory._id === categoryId) {
        res
          .status(500)
          .json({
            error:
              "Você está tentando colocar um nome que já existe em suas categorias!",
          });
        return;
      }

      await Category.findByIdAndUpdate(categoryId, { icon, name });

      res.status(200).json();
    } catch (error) {
      console.error(error, "Erro no servidor ao editar categoria.");
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await Category.findByIdAndDelete(id);

      if (deleted) {
        res.status(200).json();
      }
    } catch (error) {
      console.error(error, "Erro no servidor ao deletar sua categoria. 🤦‍♂️");
    }
  }
}

export const categoryController = new CategoryController();
