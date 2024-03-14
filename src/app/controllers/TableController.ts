import { Request, Response } from "express";
import { Table } from "../models/Tables";

class TableController {
  async create(req: Request, res: Response): Promise<ITable | undefined> {
    try {
      const { tableNumber } = req.body;

      if (!tableNumber) {
        res.status(400).json({
          error: "Nome ausente esse campo é obrigatória 🤦‍♂️",
        });
        return;
      }
      const name = `Mesa: ${tableNumber}`;

      const numberTable = (await Table.find()).filter((table) => table.name === name);

      if (numberTable.length > 0 && name === numberTable[0].name) {
        res.status(400).json({
          error: "Essa mesa já existe 🤦‍♂️",
        });
        return;
      }

      const table = await Table.create({ name });
      res.status(201).json(table);
    } catch (error) {
      console.error(error, "Erro na criação dessa mesa. 🤦‍♂️");
    }
  }

  async showAll(req: Request, res: Response): Promise<void> {
    try {
      const tables = await Table.find();
      res.json(tables);
    } catch (error) {
      console.error(error, "Erro ao exibir todas as mesas. 🤦‍♂️");
    }
  }
  
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await Table.findByIdAndDelete(id);

      res.sendStatus(204);
    } catch (error) {
      console.error(error, "Erro ao deletar essa mesa. 🤦‍♂️");
    }
  }
}

export const tableController = new TableController();
