import { Request, Response } from "express";
import { IOrder } from "../../interfaces/IOrder";
import { Order } from "../models/Order";

class OrderController {
  async create(req: Request, res: Response): Promise<IOrder | void> {
    try {
      const { table, status, createdAt, products } = req.body

      if (!table && !products && !status) {
        res.status(400).json({
          error:
            "Mesa, status e/ou produtos ausentes, esses campos são obrigatórios 🤦‍♂️",
        });
      }

      const order = await Order.create({
        table,
        status,
        createdAt,
        products,
      });

      res.json(order);
    } catch (error) {
      console.error(error, "Erro na criação dessa categoria. 🤦‍♂️");
    }
  }

    async showAll(req: Request, res: Response): Promise<IOrder | undefined> {
      try {
        const orders = await Order.find();

        if (!orders) {
          res.status(500).json({ error: "Erro ao buscar seus pedidos 🤦‍♂️" });
          return;
        }

        res.json(orders);
      } catch (error) {
        console.error(error, "Erro no servidor ao buscar seus pedidos. 🤦‍♂️");
      }
    }

    async delete(req: Request, res: Response): Promise<void> {
      try {
        const { id } = req.params;
        const deleted = await Order.findByIdAndDelete( id );

        if(deleted){
          res.status(200).json()
        }

      } catch (error) {
        console.error(error, "Erro no servidor ao deletar seu pedido. 🤦‍♂️");
      }
    }
}

export const orderController = new OrderController();
