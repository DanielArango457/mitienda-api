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

  res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
};