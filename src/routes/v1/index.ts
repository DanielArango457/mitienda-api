import { Router } from "express";
import { productosRouter } from "./productos.route";

const v1Router = Router();

v1Router.use("/productos", productosRouter);

export default v1Router;