import { Router } from "express";
import { container } from "../../config/container";
import { PedidosController } from "../../controllers/pedidos.controller";
import { requireAdmin } from "../../middlewares/auth.middleware";

export const pedidosRouter = Router();

pedidosRouter.post("/", (req, res) => {
  return container.resolve<PedidosController>("pedidosController").crearPedido(req, res);
});

pedidosRouter.get("/", requireAdmin, (req, res) => {
  return container.resolve<PedidosController>("pedidosController").listarPedidos(req, res);
});