import { Request, Response } from "express";
import { IOrder } from "../../interfaces/IOrder";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { IOrdersReport } from "../../interfaces/IOrderReport";

class OrderController {
  async create(req: Request, res: Response): Promise<IOrder | void> {
    try {
      const { table, createdAt, products, observations, userId } = req.body;
      console.log(userId);

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
        observations,
        creator: userId,
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

      res.sendStatus(204);
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

      res.sendStatus(204);
    } catch (error) {
      console.error(
        error,
        "Erro na alteração das observações desse pedido. 🤦‍♂️"
      );
    }
  }

  async showAll(req: Request, res: Response): Promise<IOrder | undefined> {
    try {
      const orders = await Order.find()
        .sort({ createdAt: 1 })
        .populate("products.product")
        .populate("creator");
      if (!orders) {
        res.status(500).json({ error: "Erro ao buscar seus pedidos 🤦‍♂️" });
        return;
      }

      res.json(orders);
    } catch (error) {
      console.error(error, "Erro no servidor ao buscar seus pedidos. 🤦‍♂️");
      res.status(500).json({ error: "Erro ao buscar seus pedidos 🤦‍♂️" });
    }
  }

  async report(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, finalDate } = req.query as any;
      const orders = await Order.find({
        createdAt: { $gte: startDate, $lte: finalDate },
      })
        .sort({ createdAt: 1 })
        .populate("products.product");
      if (!orders) {
        res.status(500).json({ error: "Erro ao buscar seus pedidos 🤦‍♂️" });
        return;
      }
      const ordersReport: IOrdersReport[] = [];

      for (const order of orders) {
        for (const product of order.products) {
          const reportItem = ordersReport.find(item => item.productId === product.product._id.toString());
          if (reportItem) {
            reportItem.quantityTotal += product.quantity;
            if (order.status === 'DONE') {
              reportItem.quantityDone += product.quantity;
            } else if (order.status === 'CANCELED') {
              reportItem.quantityCanceled += product.quantity;
            }
          } else {
            const productName = await Product.findById(product.product._id) as string;
            ordersReport.push({
              productId: product.product._id.toString(),
              productName: productName,
              quantityDone: order.status === 'DONE' ? product.quantity : 0,
              quantityCanceled: order.status === 'CANCELED' ? product.quantity : 0,
              quantityTotal: product.quantity
            });
          }
        }
      }
      res.status(200).json(ordersReport);
    } catch (error) {
      console.error(error, "Erro no servidor ao buscar seus pedidos. 🤦‍♂️");
      res.status(500).json({ error: "Erro ao buscar seus pedidos 🤦‍♂️" });
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
