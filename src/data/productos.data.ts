import { Producto } from "./productos.model";

const foto = (id: number): string =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600`;

export const productosData: Producto[] = [
  { id: 1, nombre: "Camiseta básica blanca", precio: 35000, categoria: "Ropa", stock: 25, imagen: foto(12039633) },
  { id: 2, nombre: "Camiseta negra", precio: 45000, categoria: "Ropa", stock: 18, imagen: foto(8532638) },
  { id: 3, nombre: "Jean clásico azul", precio: 120000, categoria: "Ropa", stock: 12, imagen: foto(4109797) },
  { id: 4, nombre: "Pantalón", precio: 160000, categoria: "Ropa", stock: 10, imagen: foto(1082529) },
  { id: 5, nombre: "Buzo con capota", precio: 130000, categoria: "Ropa", stock: 10, imagen: foto(28701959) },
  { id: 6, nombre: "Chaqueta de jean", precio: 180000, categoria: "Ropa", stock: 6, imagen: foto(18020903) },
  { id: 7, nombre: "Tenis deportivos", precio: 150000, categoria: "Calzado", stock: 15, imagen: foto(9660927) },
  { id: 8, nombre: "Zapatillas casuales", precio: 140000, categoria: "Calzado", stock: 9, imagen: foto(1447257) },
  { id: 9, nombre: "Sandalias", precio: 70000, categoria: "Calzado", stock: 15, imagen: foto(112285) },
  { id: 10, nombre: "Botas de cuero", precio: 220000, categoria: "Calzado", stock: 0, imagen: foto(167706) },
  { id: 11, nombre: "Gorra negra", precio: 40000, categoria: "Accesorios", stock: 20, imagen: foto(1484797) },
  { id: 12, nombre: "Mochila urbana", precio: 110000, categoria: "Accesorios", stock: 2, imagen: foto(13693319) },
];