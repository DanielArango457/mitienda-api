import { Router } from "express";
import { productosRouter } from "./productos.route";
import { authRouter } from "./auth.route";

const v1Router = Router();

v1Router.use("/productos", productosRouter);
v1Router.use("/auth", authRouter);

export default v1Router;