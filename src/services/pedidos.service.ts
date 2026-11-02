import { PedidosRepository } from "../repositories/pedidos.repository";
import { AppExeption } from "../exceptions/app.exception";
import { logger } from "../config/logger";

const MAX_ENTERO = 2147483647;
const MAX_CANTIDAD = 1000;
const MAX_ITEMS = 50;

export class PedidosService {
  constructor(private readonly pedidosRepository: PedidosRepository) {}

  async crearPedido(data: unknown) {
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      throw new AppExeption("CUERPO_INVALIDO", "El cuerpo debe ser un objeto JSON", 400);
    }

    const campos = data as Record<string, unknown>;

    for (const clave of Object.keys(campos)) {
      if (!["cliente", "telefono", "items"].includes(clave)) {
        throw new AppExeption("CAMPO_NO_PERMITIDO", `El campo '${clave}' no está permitido`, 400);
      }
    }

    const { cliente, telefono, items } = campos;

    if (typeof cliente !== "string" || cliente.trim().length < 2 || cliente.trim().length > 100) {
      throw new AppExeption(
        "CLIENTE_INVALIDO",
        "El campo 'cliente' es obligatorio y debe tener entre 2 y 100 caracteres",
        400,
      );
    }

    if (typeof telefono !== "string" || !/^\+?\d{7,15}$/.test(telefono.replace(/[\s-]/g, ""))) {
      throw new AppExeption(
        "TELEFONO_INVALIDO",
        "El campo 'telefono' debe tener entre 7 y 15 dígitos",
        400,
      );
    }

    if (!Array.isArray(items)) {
      throw new AppExeption("ITEMS_INVALIDO", "El campo 'items' debe ser una lista", 400);
    }

    if (items.length === 0) {
      throw new AppExeption("PEDIDO_VACIO", "El pedido debe tener al menos un producto", 400);
    }

    if (items.length > MAX_ITEMS) {
      throw new AppExeption("ITEMS_INVALIDO", `El pedido no puede tener más de ${MAX_ITEMS} productos`, 400);
    }

    const cantidades: Record<number, number> = {};

    for (const item of items) {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        throw new AppExeption("ITEM_INVALIDO", "Cada producto del pedido debe ser un objeto", 400);
      }

      const { productoId, cantidad } = item as Record<string, unknown>;

      if (
        typeof productoId !== "number" ||
        !Number.isInteger(productoId) ||
        productoId <= 0 ||
        productoId > MAX_ENTERO
      ) {
        throw new AppExeption(
          "ITEM_INVALIDO",
          "Cada producto debe tener un 'productoId' entero positivo",
          400,
        );
      }

      if (
        typeof cantidad !== "number" ||
        !Number.isInteger(cantidad) ||
        cantidad < 1 ||
        cantidad > MAX_CANTIDAD
      ) {
        throw new AppExeption(
          "CANTIDAD_INVALIDA",
          `La 'cantidad' debe ser un entero entre 1 y ${MAX_CANTIDAD}`,
          400,
        );
      }

      const acumulada = (cantidades[productoId] ?? 0) + cantidad;

      if (acumulada > MAX_CANTIDAD) {
        throw new AppExeption(
          "CANTIDAD_INVALIDA",
          `La cantidad de un mismo producto no puede superar ${MAX_CANTIDAD}`,
          400,
        );
      }

      cantidades[productoId] = acumulada;
    }

    const lista = Object.entries(cantidades).map(([productoId, cantidad]) => ({
      productoId: Number(productoId),
      cantidad,
    }));

    const pedido = await this.pedidosRepository.crear(cliente.trim(), telefono.trim(), lista);

    logger.info("PEDIDO_CREADO", {
      pedidoId: pedido.id,
      total: pedido.total,
      productos: lista.length,
    });

    return pedido;
  }

  async listarPedidos() {
    return this.pedidosRepository.findAll();
  }
}