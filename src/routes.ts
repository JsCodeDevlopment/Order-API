import { Router } from "express";
import path from "node:path";
import { categoryController } from "./app/controllers/CategoryController";
import { productController } from "./app/controllers/ProductController";
import multer from "multer";

export const router = Router();
const upload = multer({
  storage: multer.diskStorage({
    destination(req, files, callback) {
      callback(null, path.resolve(__dirname, "..", "uploads"));
    },
    filename(req, file, callback) {
        callback(null, `${Date.now()}-${file.originalname}`)
    },
  }),
});

// CASOS DE USOS → São as situações que vou precisar na minha aplicação que aqui vou ter que ter rotas que correspodam a essas ações.

// ----ROTAS CATEGORIA----
// criar categoria ✔
router.post("/categories", categoryController.create);
// listar categorias ✔
router.get("/categories", categoryController.showAll);
// deletar categoria ✔
router.delete("/categories/:id", categoryController.delete);

// ----ROTAS PRODUTOS----
// criar produto ✔
router.post("/products", upload.single("image"), productController.create);
// listar produtos ✔
router.get("/products", productController.showAll);
// listar produtos pela categoria ❌
router.get("/products/:category", productController.showAll);
// deletar produto ✔
router.delete("/products/:id", productController.delete);

// ----ROTAS PEDIDOS----
// criar pedidos ❌
router.post("/order", categoryController.showAll);
// listar pedidos ❌
router.get("/order", categoryController.showAll);
// mudar status dos pedidos ❌
router.patch("/order", categoryController.showAll);
// deletar/cancelar pedidos ❌
router.delete("/order/:id", categoryController.showAll);
