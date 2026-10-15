import { prisma } from "../config/prisma";
import { Producto } from "../data/productos.model";
import { ProductoRequestDTO } from "../dto/productos.dto";

export class ProductosRepository {
  async findAll(): Promise<Producto[]> {
    return prisma.producto.findMany({ orderBy: { id: "asc" } });
  }

  async findById(id: number): Promise<Producto | null> {
    return prisma.producto.findUnique({ where: { id } });
  }

  async create(data: ProductoRequestDTO): Promise<Producto> {
    return prisma.producto.create({ data });
  }

  async update(
    id: number,
    data: Partial<ProductoRequestDTO>,
  ): Promise<Producto | null> {
    const existente = await prisma.producto.findUnique({ where: { id } });

    if (!existente) {
      return null;
    }

    return prisma.producto.update({ where: { id }, data });
  }

  async delete(id: number): Promise<boolean> {
    const resultado = await prisma.producto.deleteMany({ where: { id } });

    return resultado.count > 0;
  }
}