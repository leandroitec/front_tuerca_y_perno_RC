import Cookies from "js-cookie";
import { PaginatedResponse } from "@/types/producto";
import {
  EstadoVenta,
  EstadoVentaApi,
  FinalizarVentaResponse,
  Venta,
  VentaApi,
} from "@/types/venta";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

export const TOKEN_COOKIE_NAME = "auth_token";

/**
 * Clase para errores originados en llamadas al módulo de ventas en Django.
 */
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Obtiene el token JWT persistido en cookies si estamos en el cliente.
 */
export function getStoredToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return Cookies.get(TOKEN_COOKIE_NAME);
}

/**
 * Construye los encabezados estándar con el token Bearer.
 */
export function buildHeaders(token?: string): HeadersInit {
  const authToken = token || getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  return headers;
}

/**
 * Procesa errores de DRF para el módulo de ventas.
 */
export async function handleApiError(response: Response, defaultMessage: string): Promise<never> {
  let errorData: Record<string, unknown> | null = null;
  try {
    errorData = (await response.json()) as Record<string, unknown>;
  } catch {
    // Si la respuesta no es JSON válido
  }

  let message = defaultMessage;

  if (response.status === 401) {
    message =
      (typeof errorData?.detail === "string" && errorData.detail) ||
      "No autorizado (401). Tu sesión ha expirado o no es válida.";
  } else if (response.status === 403) {
    message =
      (typeof errorData?.detail === "string" && errorData.detail) ||
      "Acceso denegado (403). No posees permisos para acceder a ventas.";
  } else if (response.status === 404) {
    message =
      (typeof errorData?.detail === "string" && errorData.detail) ||
      "Venta no encontrada (404).";
  } else if (response.status === 400) {
    message =
      (typeof errorData?.detail === "string" && errorData.detail) ||
      (typeof errorData?.error === "string" && errorData.error) ||
      (Array.isArray(errorData?.non_field_errors) ? String(errorData.non_field_errors[0]) : null) ||
      "Error de validación al procesar la venta (400).";
  } else if (typeof errorData?.detail === "string") {
    message = errorData.detail;
  } else {
    message = `${defaultMessage} (HTTP ${response.status})`;
  }

  throw new ApiError(message, response.status, errorData);
}

// ── Adaptador API (Django) -> Modelo del Frontend ──────────────────────────

const ESTADOS_API: Record<EstadoVentaApi, EstadoVenta> = {
  PENDIENTE: "pendiente",
  COMPLETADA: "finalizada",
  CANCELADA: "cancelada",
};

/** Convierte una venta devuelta por Django al modelo consumido por la UI */
export function adaptarVentaApi(venta: VentaApi): Venta {
  const estado = ESTADOS_API[venta.estado] || "pendiente";

  const { username, first_name, last_name } = venta.usuario_vendedor || {};
  const nombreCompleto = [first_name, last_name].filter(Boolean).join(" ").trim();

  return {
    id: venta.id,
    fecha: venta.fecha,
    cliente: venta.cliente?.nombre ?? "Cliente Mostrador",
    total: typeof venta.total === "number" ? venta.total : Number.parseFloat(venta.total || "0"),
    estado,
    vendedor: nombreCompleto || username || "Vendedor",
  };
}

export function adaptarLista(ventas: VentaApi[]): Venta[] {
  return Array.isArray(ventas) ? ventas.map(adaptarVentaApi) : [];
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICIOS DE VENTAS (DJANGO REST FRAMEWORK)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/ventas/
 * Historial general y paginado de ventas. Requiere token de autenticación.
 */
export async function getVentas(token?: string): Promise<PaginatedResponse<Venta>> {
  const endpoint = `${API_BASE_URL}/api/ventas/`;

  const res = await fetch(endpoint, {
    method: "GET",
    headers: buildHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    await handleApiError(res, "Error al obtener el historial de ventas");
  }

  const data = await res.json();

  // Si Django responde con paginación { count, next, previous, results }
  if (data && Array.isArray(data.results)) {
    return {
      ...data,
      results: adaptarLista(data.results),
    };
  }

  // Si responde con un array directo
  if (Array.isArray(data)) {
    return {
      count: data.length,
      next: null,
      previous: null,
      results: adaptarLista(data),
    };
  }

  return { count: 0, next: null, previous: null, results: [] };
}
export const fetchVentas = getVentas;

/**
 * GET /api/ventas/ventas-del-dia/
 * Obtiene el resumen de ventas del día actual para métricas operativas.
 */
export async function getVentasDelDia(token?: string): Promise<Venta[]> {
  const endpoint = `${API_BASE_URL}/api/ventas/ventas-del-dia/`;

  const res = await fetch(endpoint, {
    method: "GET",
    headers: buildHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    await handleApiError(res, "Error al obtener las ventas del día");
  }

  const data = await res.json();
  const lista = Array.isArray(data) ? data : data.results || [];
  return adaptarLista(lista);
}
export const fetchVentasDelDia = getVentasDelDia;

/**
 * POST /api/ventas/{id}/finalizar-venta/
 * Cierra y confirma una venta pendiente.
 */
export async function finalizarVenta(
  id: number | string,
  token?: string
): Promise<FinalizarVentaResponse> {
  const endpoint = `${API_BASE_URL}/api/ventas/${id}/finalizar-venta/`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: buildHeaders(token),
  });

  if (!res.ok) {
    await handleApiError(res, `No se pudo finalizar la venta #${id}`);
  }

  return res.json();
}

/**
 * Bandera retrocompatible: en integración real los mocks de ventas están inactivos.
 */
export const USE_VENTA_MOCKS = false;
