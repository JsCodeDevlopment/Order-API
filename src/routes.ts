import { Router } from "express";
import { categoryController } from "./app/controllers/CategoryController";
import { productController } from "./app/controllers/ProductController";
import { orderController } from "./app/controllers/OrderController";
import { registerController } from "./app/controllers/RegisterController";
import { AuthMiddleware } from "./app/middlewares/authMiddleware";
import { loginController } from "./app/controllers/LoginController";
import { AdminMiddleware } from "./app/middlewares/admMiddleware";
import { userController } from "./app/controllers/UserController";
import multer from "multer";
import path from "node:path";
import { tableController } from "./app/controllers/TableController";

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

// ----ROTAS CATEGORIA----
// criar categoria ✔
router.post("/categories", AuthMiddleware, AdminMiddleware, categoryController.create);
// editar categoria ✔
router.patch("/categories/:categoryId", AuthMiddleware, AdminMiddleware, categoryController.change);
// listar categorias ✔
router.get("/categories", categoryController.showAll);
// listar categorias com quantos produtos tem na categoria ✔
router.get("/categoriesfull", categoryController.showWithProducts);
// deletar categoria ✔
router.delete("/categories/:id", AuthMiddleware, AdminMiddleware, categoryController.delete);

// ----ROTAS PRODUTOS----
// criar produto ✔
router.post("/products", AuthMiddleware, AdminMiddleware, upload.single("image"), productController.create);
// listar produtos ✔
router.get("/products", productController.showAll);
// listar produtos pela categoria ✔
router.get("/products/:categoryId/products",productController.showByCategories);
// Atualizar produtos ✔
router.patch("/products/:id", AuthMiddleware, AdminMiddleware, upload.single("image"), productController.change);
// deletar produto ✔
router.delete("/products/:id", AuthMiddleware, AdminMiddleware, productController.delete);

// ----ROTAS PEDIDOS----
// criar pedidos ✔
router.post("/orders", orderController.create);
// listar pedidos ✔
router.get("/orders", orderController.showAll);
// mudar status dos pedidos ✔
router.patch("/orders/:orderId", orderController.change);
// mudar observações dos pedidos ✔
router.patch("/orders/observations/:orderId", orderController.changeOrderObservations);
// deletar/cancelar pedidos ✔
router.delete("/orders/:id", orderController.delete);

// ----ROTAS TABLES----
// rota para criar mesas ✔
router.post("/table", AuthMiddleware, AdminMiddleware, tableController.create);
// rota para exibir todas as  mesas ✔
router.get("/table", tableController.showAll);
// rota para deletar mesas ✔
router.delete("/table/:id", AuthMiddleware, AdminMiddleware, tableController.delete);

// ----ROTAS USERS----
// rota para autenticar quem logar ✔
router.get("/me", AuthMiddleware, userController.me);

// ----ROTAS REGISTER----
// criar usuário ✔ OBS: Autenticar email e mandar para email que está tentando cadastrar ✔
router.post("/register", upload.single("image"), registerController.create);
// vizualizar dados do usuário ✔
router.get("/register", registerController.showAll);
// atualizar dados do usuário ✔
router.patch("/register", upload.single("image"), registerController.change);
// atualizar senha do usuário ✔
router.patch("/register/update-password", AuthMiddleware, registerController.updatePassword);
// editar permição usuário ✔
router.patch("/register/rule/:id", AuthMiddleware, AdminMiddleware, registerController.changeRule);
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
router.post("/reset-password", loginController.reset);