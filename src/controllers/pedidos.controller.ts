import { Request, Response } from "express";
import { PedidosService } from "../services/pedidos.service";

export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  crearPedido = async (req: Request, res: Response): Promise<void> => {
    const pedido = await this.pedidosService.crearPedido(req.body);
    res.status(201).json(pedido);
  };

  listarPedidos = async (_req: Request, res: Response): Promise<void> => {
    const pedidos = await this.pedidosService.listarPedidos();
    res.status(200).json(pedidos);
  };
}