import { Router } from "express";
import { container } from "../config/container";
import { ProductosController } from "../controllers/productos.controller";

export const productosRouter = Router();

productosRouter.get("/", (req, res) => {
  container.resolve<ProductosController>("productosController").getProductos(req, res);
});

productosRouter.get("/:id", (req, res) => {
  container.resolve<ProductosController>("productosController").getProductoPorId(req, res);
});

productosRouter.post("/", (req, res) => {
  container.resolve<ProductosController>("productosController").crearProducto(req, res);
});

productosRouter.put("/:id", (req, res) => {
  container.resolve<ProductosController>("productosController").actualizarProducto(req, res);
});

productosRouter.delete("/:id", (req, res) => {
  container.resolve<ProductosController>("productosController").eliminarProducto(req, res);
});