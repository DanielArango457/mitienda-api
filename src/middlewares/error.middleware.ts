import { Request, Response, NextFunction } from "express";
import { AppExeption } from "../exceptions/app.exception";
import { logger } from "../config/logger";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppExeption) {
    logger.warn(err.code, {
      statusCode: err.statusCode,
      method: req.method,
      path: req.originalUrl,
    });

    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
    });

    return;
  }

  if (err instanceof SyntaxError && "body" in err) {
    logger.warn("JSON_INVALIDO", {
      statusCode: 400,
      method: req.method,
      path: req.originalUrl,
    });

    res.status(400).json({
      code: "JSON_INVALIDO",
      message: "El cuerpo de la petición no es un JSON válido",
    });

    return;
  }

  logger.error("INTERNAL_SERVER_ERROR", {
    method: req.method,
    path: req.originalUrl,
    error: err instanceof Error ? err.message : String(err),
  });

  res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
};