import express, { Application } from "express";
import cors from "cors";
import { productosRouter } from "./routes/productos.route";
import { errorMiddleware } from "./middlewares/error.middleware";

export const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/productos", productosRouter);

app.use(errorMiddleware);