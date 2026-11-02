import { createContainer, asClass, InjectionMode } from "awilix";
import { ProductosController } from "../controllers/productos.controller";
import { ProductosService } from "../services/productos.service";
import { ProductosRepository } from "../repositories/productos.repository";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { UsuariosRepository } from "../repositories/usuarios.repository";

export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  productosController: asClass(ProductosController).scoped(),
  productosService: asClass(ProductosService).scoped(),
  productosRepository: asClass(ProductosRepository).scoped(),
  authController: asClass(AuthController).scoped(),
  authService: asClass(AuthService).scoped(),
  usuariosRepository: asClass(UsuariosRepository).scoped(),
});