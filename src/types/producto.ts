/**
 * Tipos del módulo de Catálogo.
 * Reflejan los contratos de la API REST de Django (DRF).
 */

export interface CategoriaProducto {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface MarcaProducto {
  id: number;
  nombre: string;
}

/** Producto tal como lo devuelve el listado GET /api/productos/ */
export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: string;
  stock: number;

  // Django devuelve objetos; MOCK puede devolver strings.
  categoria: CategoriaProducto | string;
  categoria_id?: number;

  marca: MarcaProducto | string;
  marca_id?: number;
}

/** Producto devuelto por GET /api/productos/{id}/ */
export interface ProductoDetalle extends Producto {
  descripcion: string;
}

/** Respuesta paginada estándar de Django REST Framework */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type ProductosResponse = PaginatedResponse<Producto>;

/** Filtros aceptados por GET /api/productos/ */
export interface ProductosQuery {
  page?: number;
  categoria?: string;
  search?: string;
}

/** Acciones aceptadas por POST /api/productos/{id}/actualizar-stock/ */
export type AccionStock = "sumar" | "restar" | "fijar";

export interface ActualizarStockPayload {
  accion: AccionStock;
  cantidad: number;
}

/** Estado visual del stock */
export type EstadoStock = "EN_STOCK" | "ULTIMAS_UNIDADES" | "SIN_STOCK";