import {
  ActualizarStockPayload,
  ProductoDetalle,
  ProductosQuery,
  ProductosResponse,
} from "@/types/producto";

import { ProductoFormValues } from "@/lib/validations/producto";

import {
  mockFetchProductos,
  mockFetchProductoById,
  mockCreateProducto,
  mockUpdateProducto,
  mockDeleteProducto,
  mockActualizarStock,
} from "@/lib/mocks/producto-mock";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const USE_PRODUCT_MOCKS =
  process.env.NEXT_PUBLIC_USE_PRODUCT_MOCKS === "true";

/**
 * Construye los headers de autenticación.
 */
function buildHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Convierte los valores del formulario al formato de Django.
 * Los selectores HTML devuelven strings.
 * La API recibe números enteros.
 */
function toApiPayload(values: ProductoFormValues) {
  return {
    nombre: values.nombre,
    precio: Number(values.precio),
    stock: Number.parseInt(values.stock, 10),
    categoria: Number(values.categoria_id),
    marca: Number(values.marca_id),
    descripcion: values.descripcion ?? "",
  };
}

/**
 * GET /api/productos/?page=&categoria=&search=
 */
export async function fetchProductos(
  token?: string,
  query?: ProductosQuery
): Promise<ProductosResponse> {
  if (USE_PRODUCT_MOCKS) {
    return mockFetchProductos(query);
  }

  const params = new URLSearchParams();
  if (query?.page && query.page > 1) params.set("page", String(query.page));
  if (query?.categoria) params.set("categoria", query.categoria);
  if (query?.search) params.set("search", query.search);

  try {
    const res = await fetch(`${API_BASE}/api/productos/?${params.toString()}`, {
      headers: buildHeaders(token),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Error al obtener productos (${res.status})`);
    }

    return res.json();
  } catch {
    // Si la API no está disponible y ocurre un error de conexión, fallback a mocks
    console.warn("[producto-service] API no disponible, activando fallback a mock.");
    return mockFetchProductos(query);
  }
}

/**
 * GET /api/productos/{id}/
 */
export async function fetchProductoById(
  id: string | number,
  token?: string
): Promise<ProductoDetalle | null> {
  if (USE_PRODUCT_MOCKS) {
    return mockFetchProductoById(id);
  }

  try {
    const res = await fetch(`${API_BASE}/api/productos/${id}/`, {
      headers: buildHeaders(token),
      cache: "no-store",
    });

    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`Producto no encontrado (${res.status})`);
    }

    return res.json();
  } catch {
    console.warn(`[producto-service] Fallback a mock para producto #${id}.`);
    return mockFetchProductoById(id);
  }
}

/**
 * POST /api/productos/
 */
export async function createProducto(
  values: ProductoFormValues,
  token: string
): Promise<Response> {
  if (USE_PRODUCT_MOCKS) {
    return mockCreateProducto(values);
  }

  return fetch(`${API_BASE}/api/productos/`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(toApiPayload(values)),
  });
}

/**
 * PUT /api/productos/{id}/
 */
export async function updateProducto(
  id: string | number,
  values: ProductoFormValues,
  token: string
): Promise<Response> {
  if (USE_PRODUCT_MOCKS) {
    return mockUpdateProducto(id, values);
  }

  return fetch(`${API_BASE}/api/productos/${id}/`, {
    method: "PUT",
    headers: buildHeaders(token),
    body: JSON.stringify(toApiPayload(values)),
  });
}

/**
 * DELETE /api/productos/{id}/
 */
export async function deleteProducto(
  id: string | number,
  token: string
): Promise<Response> {
  if (USE_PRODUCT_MOCKS) {
    return mockDeleteProducto(id);
  }

  return fetch(`${API_BASE}/api/productos/${id}/`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });
}

/**
 * POST /api/productos/{id}/actualizar-stock/
 */
export async function actualizarStock(
  productoId: number | string,
  payload: ActualizarStockPayload,
  token?: string
): Promise<Response> {
  if (USE_PRODUCT_MOCKS) {
    try {
      const prod = mockActualizarStock(productoId, payload.accion, payload.cantidad);
      return new Response(JSON.stringify(prod), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(
        JSON.stringify({
          detail: err instanceof Error ? err.message : "Error al actualizar stock",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  try {
    const res = await fetch(
      `${API_BASE}/api/productos/${productoId}/actualizar-stock/`,
      {
        method: "POST",
        headers: buildHeaders(token),
        body: JSON.stringify(payload),
      }
    );
    return res;
  } catch {
    // Si la API falla, responder desde mock
    const prod = mockActualizarStock(productoId, payload.accion, payload.cantidad);
    return new Response(JSON.stringify(prod), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}