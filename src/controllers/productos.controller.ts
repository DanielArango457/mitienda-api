import { Request, Response } from "express";
import { ProductosService } from "../services/productos.service";

export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  getProductos = (req: Request, res: Response): void => {
    const productos = this.productosService.getProductos();
    res.status(200).json(productos);
  };

  getProductoPorId = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    const producto = this.productosService.getProductoPorId(id);
    res.status(200).json(producto);
  };

  crearProducto = (req: Request, res: Response): void => {
    const nuevoProducto = this.productosService.crearProducto(req.body);
    res.status(201).json(nuevoProducto);
  };

  actualizarProducto = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    const productoActualizado = this.productosService.actualizarProducto(id, req.body);
    res.status(200).json(productoActualizado);
  };

  eliminarProducto = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    this.productosService.eliminarProducto(id);
    res.status(204).send();
  };
}