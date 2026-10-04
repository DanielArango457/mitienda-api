import { createContainer, asClass, InjectionMode } from "awilix";
import { ProductosController } from "../controllers/productos.controller";
import { ProductosService } from "../services/productos.service";
import { ProductosRepository } from "../repositories/productos.repository";

export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  productosController: asClass(ProductosController).scoped(),
  productosService: asClass(ProductosService).scoped(),
  productosRepository: asClass(ProductosRepository).scoped(),
});