import { Producto } from "./productos.model";

export const productosData: Producto[] = [
  {
    id: 1,
    nombre: "Camiseta MiTienda",
    precio: 45000,
    categoria: "Ropa",
    stock: 20,
    imagen: "https://placehold.co/600x600/png?text=Camiseta",
  },
  {
    id: 2,
    nombre: "Tenis Urbanos",
    precio: 150000,
    categoria: "Calzado",
    stock: 10,
    imagen: "https://placehold.co/600x600/png?text=Tenis",
  },
  {
    id: 3,
    nombre: "Gorra MiTienda",
    precio: 30000,
    categoria: "Accesorios",
    stock: 15,
    imagen: "https://placehold.co/600x600/png?text=Gorra",
  },
];