import { prisma } from "../config/prisma";

export class UsuariosRepository {
  async findByEmail(email: string) {
    return prisma.usuario.findUnique({ where: { email } });
  }
}