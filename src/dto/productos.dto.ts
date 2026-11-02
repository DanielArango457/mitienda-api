export interface ProductoRequestDTO {
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
  imagen?: string | null;
}

export interface ProductoResponseDTO {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
  imagen: string | null;
}