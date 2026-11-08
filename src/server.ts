import express, { Application } from "express";
import cors from "cors";
import v1Router from "./routes/v1";
import { errorMiddleware } from "./middlewares/error.middleware";
import { AppExeption } from "./exceptions/app.exception";

export const app: Application = express();

// No revelar que el servidor usa Express (cabecera X-Powered-By).
app.disable("x-powered-by");

// CORS solo aplica a navegadores web; la app móvil no lo necesita.
// Los orígenes permitidos se definen en la variable CORS_ORIGINS,
// separados por coma. Si no se define, ningún sitio web externo puede llamar a la API.
const origenesPermitidos = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origen) => origen.trim())
  .filter((origen) => origen.length > 0);

app.use(cors({ origin: origenesPermitidos }));
app.use(express.json());

app.use("/api/v1", v1Router);

app.use((_req, _res, next) => {
  next(new AppExeption("RUTA_NO_ENCONTRADA", "Ruta no encontrada", 404));
});

app.use(errorMiddleware);