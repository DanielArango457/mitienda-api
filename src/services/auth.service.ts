import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { UsuariosRepository } from "../repositories/usuarios.repository";
import { AppExeption } from "../exceptions/app.exception";
import { env } from "../config/env";
import { logger } from "../config/logger";

export class AuthService {
  constructor(private readonly usuariosRepository: UsuariosRepository) {}

  async login(data: unknown) {
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      throw new AppExeption("CUERPO_INVALIDO", "El cuerpo debe ser un objeto JSON", 400);
    }

    const { email, password } = data as Record<string, unknown>;

    if (typeof email !== "string" || email.trim() === "") {
      throw new AppExeption("EMAIL_INVALIDO", "El campo 'email' es obligatorio", 400);
    }

    if (typeof password !== "string" || password === "") {
      throw new AppExeption("PASSWORD_INVALIDO", "El campo 'password' es obligatorio", 400);
    }

    const usuario = await this.usuariosRepository.findByEmail(email.trim().toLowerCase());

    const claveCorrecta = usuario
      ? await bcrypt.compare(password, usuario.passwordHash)
      : false;

    if (!usuario || !claveCorrecta) {
      throw new AppExeption("CREDENCIALES_INVALIDAS", "Correo o contraseña incorrectos", 401);
    }

    const token = jwt.sign(
      { sub: String(usuario.id), email: usuario.email, rol: usuario.rol },
      env.jwtSecret,
      { expiresIn: "8h" },
    );

    logger.info("LOGIN_EXITOSO", { usuarioId: usuario.id });

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }
}