import { Router } from 'express'
import { catergoryController } from './app/models/controllers/CategoryController'

export const router = Router()

// CASOS DE USOS → São as situações que vou precisar na minha aplicação que aqui vou ter que ter rotas que correspodam a essas ações.

// ----ROTAS CATEGORIA----
// criar categoria
router.post('/categories', catergoryController.store)
// listar categorias

// ----ROTAS PRODUTOS----
// criar produto
// listar produtos
// listar produtos pela categoria

// ----ROTAS PEDIDOS----
// criar pedidos
// listar pedidos
// mudar status dos pedidos
// deletar/cancelar pedidos