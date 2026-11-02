import { prisma } from "../config/prisma";
import { AppExeption } from "../exceptions/app.exception";

const MAX_ENTERO = 2147483647;

export interface ItemSolicitado {
  productoId: number;
  cantidad: number;
}

export class PedidosRepository {
  async crear(cliente: string, telefono: string, items: ItemSolicitado[]) {
    return prisma.$transaction(async (tx) => {
      const lineas: {
        productoId: number;
        nombre: string;
        precio: number;
        cantidad: number;
      }[] = [];
      let total = 0;

      for (const item of items) {
        const producto = await tx.producto.findUnique({
          where: { id: item.productoId },
        });

        if (!producto) {
          throw new AppExeption(
            "PRODUCTO_NO_ENCONTRADO",
            `El producto ${item.productoId} no existe`,
            404,
          );
        }

        const actualizado = await tx.producto.updateMany({
          where: { id: item.productoId, stock: { gte: item.cantidad } },
          data: { stock: { decrement: item.cantidad } },
        });

        if (actualizado.count === 0) {
          throw new AppExeption(
            "STOCK_INSUFICIENTE",
            `No hay suficiente stock de '${producto.nombre}' (disponible: ${producto.stock})`,
            409,
          );
        }

        lineas.push({
          productoId: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: item.cantidad,
        });

        total += producto.precio * item.cantidad;
      }

      if (total > MAX_ENTERO) {
        throw new AppExeption("TOTAL_INVALIDO", "El total del pedido es demasiado grande", 400);
      }

      return tx.pedido.create({
        data: { cliente, telefono, total, items: { create: lineas } },
        include: { items: true },
      });
    });
  }

  async findAll() {
    return prisma.pedido.findMany({
      orderBy: { id: "desc" },
      include: { items: true },
    });
  }
}