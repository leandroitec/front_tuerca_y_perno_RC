/**
 * Tipos del módulo de Catálogo.
 * Reflejan los contratos de la API REST de Django (DRF) para /api/productos/.
 */

/** Producto tal como lo devuelve el listado GET /api/productos/ */
export interface Producto {
  id: number;
  nombre: string;
  /** DRF serializa los DecimalField como string (ej. "125000.00") */
  precio: string;
  stock: number;
  categoria: string;
  marca: string;
}

/** Producto devuelto por GET /api/productos/{id}/ (incluye la descripción) */
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

/** Payload de POST /api/productos/{id}/actualizar-stock/ */
export interface ActualizarStockPayload {
  accion: AccionStock;
  cantidad: number;
}

/** Estado visual del stock que se muestra en el Badge */
export type EstadoStock = "EN_STOCK" | "ULTIMAS_UNIDADES" | "SIN_STOCK";
