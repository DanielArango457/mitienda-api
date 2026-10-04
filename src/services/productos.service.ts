import { ProductosRepository } from "../repositories/productos.repository";
import { Producto } from "../data/productos.model";
import { ProductoRequestDTO, ProductoResponseDTO } from "../dto/productos.dto";
import { AppExeption } from "../exceptions/app.exception";

export class ProductosService {
  constructor(private readonly productosRepository: ProductosRepository) {}

  getProductos(): ProductoResponseDTO[] {
    return this.productosRepository.findAll();
  }

  getProductoPorId(id: number): ProductoResponseDTO {
    const producto = this.productosRepository.findById(id);

    if (!producto) {
      throw new AppExeption("PRODUCTO_NO_ENCONTRADO", "Producto no encontrado", 404);
    }

    return producto;
  }

  crearProducto(data: ProductoRequestDTO): ProductoResponseDTO {
    if (data.precio < 0) {
      throw new AppExeption("PRECIO_INVALIDO", "El precio no puede ser negativo", 400);
    }

    const nuevoId = this.productosRepository.getLastId() + 1;

    const nuevoProducto: Producto = {
      id: nuevoId,
      ...data,
    };

    return this.productosRepository.create(nuevoProducto);
  }

  actualizarProducto(id: number, data: ProductoRequestDTO): ProductoResponseDTO {
    const productoActualizado = this.productosRepository.update(id, data);

    if (!productoActualizado) {
      throw new AppExeption("PRODUCTO_NO_ENCONTRADO", "Producto no encontrado", 404);
    }

    return productoActualizado;
  }

  eliminarProducto(id: number): void {
    const eliminado = this.productosRepository.delete(id);

    if (!eliminado) {
      throw new AppExeption("PRODUCTO_NO_ENCONTRADO", "Producto no encontrado", 404);
    }
  }
}