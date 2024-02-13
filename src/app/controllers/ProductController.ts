import { Request, Response } from "express";
import { IProduct } from "../../interfaces/IProduct";
import { Product } from "../models/Product";
import { Category } from "../models/Category";

class ProductController {
  async create(req: Request, res: Response): Promise<IProduct | undefined> {
    try {
      const { name, description, price, ingredients, category } = req.body;
      const imagePath = req.file?.filename;

      if (!imagePath) {
        console.log("o imagePath tá vazio mano");
      }

      if (!name && !price) {
        res.status(400).json({
          error:
            "Nome ou preço ausentes, esses campos são obrigatórios 🤦‍♂️",
        });
      }

      const productExists = await Product.findOne({ name });
      if (productExists) {
        res.status(400).json({
          error: "O produto que você está tentando cadastrar já existe. 🤦‍♂️",
        });
        return;
      }

      const product = await Product.create({
        name,
        description,
        imagePath,
        price: Number(price),
        category,
        ingredients: ingredients ? JSON.parse(ingredients) : [],
      });

      res.status(201).json(await Product.findById(product._id).populate("category").exec());
    } catch (error) {
      console.error(error, "Erro na criação dessa categoria. 🤦‍♂️");
    }
  }

  async showAll(req: Request, res: Response): Promise<IProduct | undefined> {
    try {
      const products = await Product.find();

      if (!products) {
        res.status(500).json({ error: "Erro ao buscar seus produtos 🤦‍♂️" });
        return;
      }

      res.json(products);
    } catch (error) {
      console.error(error, "Erro no servidor ao buscar seus produtos. 🤦‍♂️");
    }
  }

  async showByCategories(
    req: Request,
    res: Response
  ): Promise<IProduct | undefined> {
    try {
      const { categoryId } = req.params;
      const products = await Product.find()
        .where("category")
        .equals(categoryId);

      if (!products) {
        res.status(500).json({ error: "Erro ao buscar seus produtos 🤦‍♂️" });
        return;
      }

      res.json(products);
    } catch (error) {
      console.error(error, "Erro no servidor ao buscar seus produtos. 🤦‍♂️");
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await Product.findByIdAndDelete(id);

      if (!deleted) {
        res
          .status(400)
          .json({
            error:
              "O Produto que você está tentando excluir não existe ou não foi encontrado.",
          });
      } else {
        res.status(200).json();
      }
    } catch (error) {
      console.error(error, "Erro no servidor ao deletar seu produto. 🤦‍♂️");
    }
  }
}

export const productController = new ProductController();
