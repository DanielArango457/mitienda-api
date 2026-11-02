import { Router } from "express";
import { container } from "../../config/container";
import { ProductosController } from "../../controllers/productos.controller";
import { requireAdmin } from "../../middlewares/auth.middleware";

export const productosRouter = Router();

productosRouter.get("/", (req, res) => {
  return container.resolve<ProductosController>("productosController").getProductos(req, res);
});

productosRouter.get("/:id", (req, res) => {
  return container.resolve<ProductosController>("productosController").getProductoPorId(req, res);
});

productosRouter.post("/", requireAdmin, (req, res) => {
  return container.resolve<ProductosController>("productosController").crearProducto(req, res);
});

productosRouter.put("/:id", requireAdmin, (req, res) => {
  return container.resolve<ProductosController>("productosController").actualizarProducto(req, res);
});

productosRouter.delete("/:id", requireAdmin, (req, res) => {
  return container.resolve<ProductosController>("productosController").eliminarProducto(req, res);
});