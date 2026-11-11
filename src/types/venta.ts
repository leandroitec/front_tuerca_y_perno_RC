/**
 * Tipos del módulo de Ventas.
 *
 * `Venta` es el modelo que usa la UI. La API de Django devuelve otra forma
 * (`VentaApi`), que el servicio adapta antes de llegar a los componentes.
 */

/** Estados de una venta en el frontend. */
export type EstadoVenta = "pendiente" | "finalizada";

/** Venta tal como la consume la interfaz. */
export interface Venta {
  id: number;
  /** Fecha y hora en formato ISO 8601. */
  fecha: string;
  /** Nombre del cliente. */
  cliente: string;
  /** Importe total en pesos. */
  total: number;
  estado: EstadoVenta;
  /** Nombre o usuario del vendedor que registró la venta. */
  vendedor: string;
}

/** Resumen calculado de un conjunto de ventas (ej.: las del día). */
export interface ResumenVentas {
  cantidad: number;
  total: number;
  pendientes: number;
  finalizadas: number;
  totalPendiente: number;
  totalFinalizado: number;
}

/** Respuesta de POST /api/ventas/{id}/finalizar-venta/ */
export interface FinalizarVentaResponse {
  mensaje: string;
}

// ── Contrato de la API de Django (VentaDetalleSerializer) ─────────────────

/** Estados definidos en el modelo `Venta` de Django. */
export type EstadoVentaApi = "PENDIENTE" | "COMPLETADA" | "CANCELADA";

export interface ClienteApi {
  id: number;
  nombre: string;
  cuit: string;
  telefono?: string | null;
  direccion?: string | null;
  email?: string | null;
}

export interface UsuarioVendedorApi {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  rol?: string;
}

/** Venta devuelta por GET /api/ventas/ y GET /api/ventas/ventas-del-dia/ */
export interface VentaApi {
  id: number;
  fecha: string;
  /** Decimal serializado como string ("12345.00"). */
  total: string;
  estado: EstadoVentaApi;
  cliente: ClienteApi;
  usuario_vendedor: UsuarioVendedorApi;
}
