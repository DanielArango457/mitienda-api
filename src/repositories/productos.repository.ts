import { Producto } from "../data/productos.model";
import { productosData } from "../data/productos.data";

export class ProductosRepository {
  findAll(): Producto[] {
    return productosData;
  }

  findById(id: number): Producto | undefined {
    return productosData.find((producto) => producto.id === id);
  }

  create(producto: Producto): Producto {
    productosData.push(producto);
    return producto;
  }

  update(id: number, data: Partial<Producto>): Producto | undefined {
    const producto = this.findById(id);

    if (!producto) {
      return undefined;
    }

    Object.assign(producto, data);

    return producto;
  }

  delete(id: number): boolean {
    const index = productosData.findIndex((producto) => producto.id === id);

    if (index === -1) {
      return false;
    }

    productosData.splice(index, 1);

    return true;
  }

  getLastId(): number {
    if (productosData.length === 0) {
      return 0;
    }

    return productosData[productosData.length - 1].id;
  }
}