import { Request, Response } from "express";
import { ProductosService } from "../services/productos.service";

export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  getProductos = async (req: Request, res: Response): Promise<void> => {
    const productos = await this.productosService.getProductos();
    res.status(200).json(productos);
  };

  getProductoPorId = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const producto = await this.productosService.getProductoPorId(id);
    res.status(200).json(producto);
  };

  crearProducto = async (req: Request, res: Response): Promise<void> => {
    const nuevoProducto = await this.productosService.crearProducto(req.body);
    res.status(201).json(nuevoProducto);
  };

  actualizarProducto = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const productoActualizado = await this.productosService.actualizarProducto(id, req.body);
    res.status(200).json(productoActualizado);
  };

  eliminarProducto = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    await this.productosService.eliminarProducto(id);
    res.status(204).send();
  };
}