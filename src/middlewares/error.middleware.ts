import { Request, Response, NextFunction } from "express";
import { AppExeption } from "../exceptions/app.exception";

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppExeption) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
    });

    return;
  }

  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      code: "JSON_INVALIDO",
      message: "El cuerpo de la petición no es un JSON válido",
    });

    return;
  }

  res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
};