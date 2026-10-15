import { ProductosRepository } from "../repositories/productos.repository";
import { ProductoRequestDTO, ProductoResponseDTO } from "../dto/productos.dto";
import { AppExeption } from "../exceptions/app.exception";

export class ProductosService {
  constructor(private readonly productosRepository: ProductosRepository) {}

  async getProductos(): Promise<ProductoResponseDTO[]> {
    return await this.productosRepository.findAll();
  }

  async getProductoPorId(id: number): Promise<ProductoResponseDTO> {
    const producto = await this.productosRepository.findById(id);

    if (!producto) {
      throw new AppExeption("PRODUCTO_NO_ENCONTRADO", "Producto no encontrado", 404);
    }

    return producto;
  }

  async crearProducto(data: ProductoRequestDTO): Promise<ProductoResponseDTO> {
    if (data.precio < 0) {
      throw new AppExeption("PRECIO_INVALIDO", "El precio no puede ser negativo", 400);
    }

    return await this.productosRepository.create(data);
  }

  async actualizarProducto(
    id: number,
    data: Partial<ProductoRequestDTO>,
  ): Promise<ProductoResponseDTO> {
    if (data.precio !== undefined && data.precio < 0) {
      throw new AppExeption("PRECIO_INVALIDO", "El precio no puede ser negativo", 400);
    }

    const productoActualizado = await this.productosRepository.update(id, data);

    if (!productoActualizado) {
      throw new AppExeption("PRODUCTO_NO_ENCONTRADO", "Producto no encontrado", 404);
    }

    return productoActualizado;
  }

  async eliminarProducto(id: number): Promise<void> {
    const eliminado = await this.productosRepository.delete(id);

    if (!eliminado) {
      throw new AppExeption("PRODUCTO_NO_ENCONTRADO", "Producto no encontrado", 404);
    }
  }
}