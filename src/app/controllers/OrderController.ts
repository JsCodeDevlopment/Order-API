import { Request, Response } from "express";
import { IOrder } from "../../interfaces/IOrder";
import { Order } from "../models/Order";

class OrderController {
  async create(req: Request, res: Response): Promise<IOrder | void> {
    try {
      const { table, createdAt, products, observations } = req.body;

      if (!table && !products) {
        res.status(400).json({
          error:
            "Mesa, status e/ou produtos ausentes, esses campos são obrigatórios 🤦‍♂️",
        });
      }
      const order = await Order.create({
        table,
        status: "WAITING",
        createdAt,
        products,
        observations
      });

      res.json(order);
    } catch (error) {
      console.error(error, "Erro na criação desse pedido. 🤦‍♂️");
    }
  }

  async change(req: Request, res: Response): Promise<IOrder | void> {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({
          error: "Status ausente, esses campos é obrigatório 🤦‍♂️",
        });
      }

      if (!["WAITING", "IN_PRODUCTION", "DONE", "CANCELED"].includes(status)) {
        res.status(400).json({
          error:
            "O status escolhido não é permitido. Tente: WAITING, IN_PRODUCTION, DONE ou CANCELED",
        });
      }

      await Order.findByIdAndUpdate(orderId, { status });

      res.sendStatus(204)
    } catch (error) {
      console.error(error, "Erro na alteração desse pedido. 🤦‍♂️");
    }
  }

  async changeOrderObservations(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const { observations } = req.body;

      if (!observations) {
        res.status(500).json({
          error: "Observações ausentes, esse campo é obrigatório 🤦‍♂️",
        });
      }

      await Order.findByIdAndUpdate(orderId, { observations });

      res.sendStatus(204)
    } catch (error) {
      console.error(error, "Erro na alteração das observações desse pedido. 🤦‍♂️");
    }
  }

  async showAll(req: Request, res: Response): Promise<IOrder | undefined> {
    try {
      const orders = await Order.find()
        .sort({ createdAt: 1 })
        .populate("products.product")
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
      const deleted = await Order.findByIdAndDelete(id);

      if (deleted) {
        res.status(200).json();
      }
    } catch (error) {
      console.error(error, "Erro no servidor ao deletar seu pedido. 🤦‍♂️");
    }
  }
}

export const orderController = new OrderController();
