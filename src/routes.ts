import { Router } from "express";
import path from "node:path";
import { categoryController } from "./app/controllers/CategoryController";
import { productController } from "./app/controllers/ProductController";
import { orderController } from "./app/controllers/OrderController";
import multer from "multer";
import { registerController } from "./app/controllers/RegisterController";

export const router = Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, files, callback) {
      callback(null, path.resolve(__dirname, "..", "uploads"));
    },
    filename(req, file, callback) {
      callback(null, `${Date.now()}-${file.originalname}`);
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
// listar produtos pela categoria ✔
router.get("/products/:categoryId/products",productController.showByCategories);
// deletar produto ✔
router.delete("/products/:id", productController.delete);

// ----ROTAS PEDIDOS----
// criar pedidos ✔
router.post("/orders", orderController.create);
// listar pedidos ✔
router.get("/orders", orderController.showAll);
// mudar status dos pedidos ✔
router.patch("/orders/:orderId", orderController.change);
// deletar/cancelar pedidos ✔
router.delete("/orders/:id", orderController.delete);

// ----ROTAS REGISTER----
// criar usuário ✔
router.post("/register", upload.single("image"), registerController.create);
// criar atualizar dados do usuário ✔
router.get("/register", registerController.showAll);
// criar recuperar senha ❌
router.get("/register", registerController.create);
// criar deletar usuário ❌
router.get("/register", registerController.create);

// ----ROTAS LOGIN----
// autenticar login ❌
router.get("/login", registerController.create);
