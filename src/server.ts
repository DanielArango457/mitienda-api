import express, { Application } from "express";
import cors from "cors";
import v1Router from "./routes/v1";
import { errorMiddleware } from "./middlewares/error.middleware";
import { AppExeption } from "./exceptions/app.exception";

export const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", v1Router);

app.use((_req, _res, next) => {
  next(new AppExeption("RUTA_NO_ENCONTRADA", "Ruta no encontrada", 404));
});

app.use(errorMiddleware);