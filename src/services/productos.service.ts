import { ProductosRepository } from "../repositories/productos.repository";
import { ProductoRequestDTO, ProductoResponseDTO } from "../dto/productos.dto";
import { AppExeption } from "../exceptions/app.exception";

const MAX_ENTERO = 2147483647;

export class ProductosService {
  constructor(private readonly productosRepository: ProductosRepository) {}

  private validarId(id: number): void {
    if (!Number.isInteger(id) || id <= 0 || id > MAX_ENTERO) {
      throw new AppExeption("ID_INVALIDO", "El id debe ser un número entero positivo", 400);
    }
  }

  private validarCuerpo(data: unknown, esParcial: boolean): void {
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      throw new AppExeption("CUERPO_INVALIDO", "El cuerpo debe ser un objeto JSON", 400);
    }

    const campos = data as Record<string, unknown>;
    const permitidos = ["nombre", "precio", "categoria", "stock"];

    for (const clave of Object.keys(campos)) {
      if (!permitidos.includes(clave)) {
        throw new AppExeption("CAMPO_NO_PERMITIDO", `El campo '${clave}' no está permitido`, 400);
      }
    }

    if (esParcial && Object.keys(campos).length === 0) {
      throw new AppExeption("CUERPO_VACIO", "Debes enviar al menos un campo para actualizar", 400);
    }

    for (const campo of ["nombre", "categoria"]) {
      const valor = campos[campo];
      if (valor === undefined && esParcial) continue;
      if (typeof valor !== "string" || valor.trim() === "") {
        throw new AppExeption(
          `${campo.toUpperCase()}_INVALIDO`,
          `El campo '${campo}' es obligatorio y debe ser un texto no vacío`,
          400,
        );
      }
    }

    for (const campo of ["precio", "stock"]) {
      const valor = campos[campo];
      if (valor === undefined && esParcial) continue;
      if (typeof valor !== "number" || !Number.isInteger(valor) || valor < 0 || valor > MAX_ENTERO) {
        throw new AppExeption(
          `${campo.toUpperCase()}_INVALIDO`,
          `El campo '${campo}' es obligatorio y debe ser un entero entre 0 y ${MAX_ENTERO}`,
          400,
        );
      }
    }
  }

  async getProductos(): Promise<ProductoResponseDTO[]> {
    return await this.productosRepository.findAll();
  }

  async getProductoPorId(id: number): Promise<ProductoResponseDTO> {
    this.validarId(id);

    const producto = await this.productosRepository.findById(id);

    if (!producto) {
      throw new AppExeption("PRODUCTO_NO_ENCONTRADO", "Producto no encontrado", 404);
    }

    return producto;
  }

  async crearProducto(data: ProductoRequestDTO): Promise<ProductoResponseDTO> {
    this.validarCuerpo(data, false);

    return await this.productosRepository.create(data);
  }

  async actualizarProducto(
    id: number,
    data: Partial<ProductoRequestDTO>,
  ): Promise<ProductoResponseDTO> {
    this.validarId(id);
    this.validarCuerpo(data, true);

    const productoActualizado = await this.productosRepository.update(id, data);

    if (!productoActualizado) {
      throw new AppExeption("PRODUCTO_NO_ENCONTRADO", "Producto no encontrado", 404);
    }

    return productoActualizado;
  }

  async eliminarProducto(id: number): Promise<void> {
    this.validarId(id);

    const eliminado = await this.productosRepository.delete(id);

    if (!eliminado) {
      throw new AppExeption("PRODUCTO_NO_ENCONTRADO", "Producto no encontrado", 404);
    }
  }
}