import { Router } from "express";
import { container } from "../../config/container";
import { AuthController } from "../../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/login", (req, res) => {
  return container.resolve<AuthController>("authController").login(req, res);
});