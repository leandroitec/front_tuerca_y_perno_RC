import { PaginatedResponse } from "@/types/producto";
import {
  EstadoVenta,
  EstadoVentaApi,
  FinalizarVentaResponse,
  Venta,
  VentaApi,
} from "@/types/venta";
import {
  getMockVentas,
  getMockVentasDelDia,
  finalizarMockVenta,
} from "@/lib/mocks/venta-mock";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Los mocks de ventas están activos salvo que se desactiven explícitamente
 * con NEXT_PUBLIC_USE_VENTA_MOCKS=false.
 */
export const USE_VENTA_MOCKS = process.env.NEXT_PUBLIC_USE_VENTA_MOCKS !== "false";

function buildHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ── Adaptador API (Django) -> modelo del frontend ─────────────────────────

const ESTADOS_API: Partial<Record<EstadoVentaApi, EstadoVenta>> = {
  PENDIENTE: "pendiente",
  COMPLETADA: "finalizada",
};

/**
 * Convierte una venta de Django al modelo de la UI.
 * Devuelve null para estados que el frontend no maneja (CANCELADA).
 */
export function adaptarVentaApi(venta: VentaApi): Venta | null {
  const estado = ESTADOS_API[venta.estado];
  if (!estado) return null;

  const { username, first_name, last_name } = venta.usuario_vendedor;
  const nombreCompleto = [first_name, last_name].filter(Boolean).join(" ").trim();

  return {
    id: venta.id,
    fecha: venta.fecha,
    cliente: venta.cliente.nombre,
    total: Number.parseFloat(venta.total),
    estado,
    vendedor: nombreCompleto || username,
  };
}

function adaptarLista(ventas: VentaApi[]): Venta[] {
  return ventas.map(adaptarVentaApi).filter((v): v is Venta => v !== null);
}

// ── Endpoints ─────────────────────────────────────────────────────────────

/** GET /api/ventas/ */
export async function fetchVentas(token: string): Promise<PaginatedResponse<Venta>> {
  if (USE_VENTA_MOCKS) {
    return getMockVentas();
  }

  const res = await fetch(`${API_BASE}/api/ventas/`, {
    headers: buildHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Error al obtener ventas (${res.status})`);
  }

  const data: PaginatedResponse<VentaApi> = await res.json();
  return { ...data, results: adaptarLista(data.results) };
}

/** GET /api/ventas/ventas-del-dia/ */
export async function fetchVentasDelDia(token: string): Promise<Venta[]> {
  if (USE_VENTA_MOCKS) {
    return getMockVentasDelDia();
  }

  const res = await fetch(`${API_BASE}/api/ventas/ventas-del-dia/`, {
    headers: buildHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Error al obtener las ventas del día (${res.status})`);
  }

  return adaptarLista(await res.json());
}

/** POST /api/ventas/{id}/finalizar-venta/ */
export async function finalizarVenta(
  id: number,
  token: string
): Promise<FinalizarVentaResponse> {
  if (USE_VENTA_MOCKS) {
    return finalizarMockVenta(id);
  }

  const res = await fetch(`${API_BASE}/api/ventas/${id}/finalizar-venta/`, {
    method: "POST",
    headers: buildHeaders(token),
  });

  if (!res.ok) {
    throw new Error(`No se pudo finalizar la venta #${id} (${res.status})`);
  }

  return res.json();
}
