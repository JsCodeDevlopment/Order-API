import { Router } from 'express'
import { categoryController } from './app/controllers/CategoryController'
import multer from 'multer'

export const router = Router()
const upload = multer.diskStorage({
    
})

// CASOS DE USOS → São as situações que vou precisar na minha aplicação que aqui vou ter que ter rotas que correspodam a essas ações.

// ----ROTAS CATEGORIA----
// criar categoria ✔
router.post('/categories', categoryController.create)
// listar categorias ✔
router.get('/categories', categoryController.showAll)
// deletar categoria ✔
router.delete('/categories/:id', categoryController.delete)

// ----ROTAS PRODUTOS----
// criar produto ❌
router.post('/products', categoryController.showAll)
// listar produtos ❌
router.get('/products', categoryController.showAll)
// listar produtos pela categoria ❌
router.get('/products/:category', categoryController.showAll)

// ----ROTAS PEDIDOS----
// criar pedidos ❌
router.post('/order', categoryController.showAll)
// listar pedidos ❌
router.get('/order', categoryController.showAll)
// mudar status dos pedidos ❌
router.patch('/order', categoryController.showAll)
// deletar/cancelar pedidos ❌
router.delete('/order/:id', categoryController.showAll)