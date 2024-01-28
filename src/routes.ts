import { Router } from "express";
import path from "node:path";
import { categoryController } from "./app/controllers/CategoryController";
import { productController } from "./app/controllers/ProductController";
import { orderController } from "./app/controllers/OrderController";
import multer from "multer";
import { registerController } from "./app/controllers/RegisterController";
import { AuthMiddleware } from "./app/middlewares/authMiddleware";
import { loginController } from "./app/controllers/LoginController";
import { AdminMiddleware } from "./app/middlewares/admMiddleware";
import { userController } from "./app/controllers/UserController";

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

// ----ROTAS USERS----
// rota para autenticar quem logar ✔
router.get("/me", AuthMiddleware, userController.me);

// ----ROTAS REGISTER----
// criar usuário ✔ OBS: Autenticar email e mandar para email que está tentando cadastrar ✔
router.post("/register", upload.single("image"), registerController.create);
// atualizar dados do usuário ✔
router.get("/register", registerController.showAll);
// deletar usuário ✔
router.delete("/register/:id", AuthMiddleware, AdminMiddleware, registerController.delete);

// ----ROTAS LOGIN----
// autenticar login ✔
router.post("/login", loginController.login);
// verificação do email ✔
router.get("/verify/:token", loginController.verify);
// esqueci minha senha ✔
router.post("/forgot-password", loginController.recover)
// recuperar senha ✔
router.post("/reset-password/:token", loginController.reset);