import { Router } from "express";
import { productosRouter } from "./productos.route";
import { authRouter } from "./auth.route";
import { pedidosRouter } from "./pedidos.route";

const v1Router = Router();

v1Router.use("/productos", productosRouter);
v1Router.use("/auth", authRouter);
v1Router.use("/pedidos", pedidosRouter);

export default v1Router;