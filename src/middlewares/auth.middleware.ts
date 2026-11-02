import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppExeption } from "../exceptions/app.exception";

export const requireAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppExeption("TOKEN_REQUERIDO", "Debes iniciar sesión como administrador", 401);
  }

  const token = header.slice("Bearer ".length).trim();

  let payload: string | jwt.JwtPayload;

  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new AppExeption("TOKEN_INVALIDO", "La sesión no es válida o ya venció", 401);
  }

  if (typeof payload === "string" || payload.rol !== "ADMIN") {
    throw new AppExeption("PERMISO_DENEGADO", "No tienes permiso para esta acción", 403);
  }

  next();
};