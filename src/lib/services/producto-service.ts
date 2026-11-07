import {
  ProductoDetalle,
  ProductosResponse,
} from "@/types/producto";

import { ProductoFormValues } from "@/lib/validations/producto";

import {
  mockFetchProductos,
  mockFetchProductoById,
  mockCreateProducto,
  mockUpdateProducto,
  mockDeleteProducto,
} from "@/lib/mocks/producto-mock";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const USE_PRODUCT_MOCKS =
  process.env.NEXT_PUBLIC_USE_PRODUCT_MOCKS === "true";

/**
 * Construye los headers de autenticación.
 */
function buildHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
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
 * GET /api/productos/
 */
export async function fetchProductos(
  token: string
): Promise<ProductosResponse> {
  if (USE_PRODUCT_MOCKS) {
    return mockFetchProductos();
  }

  const res = await fetch(`${API_BASE}/api/productos/`, {
    headers: buildHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Error al obtener productos (${res.status})`);
  }

  return res.json();
}

/**
 * GET /api/productos/{id}/
 */
export async function fetchProductoById(
  id: string | number,
  token: string
): Promise<ProductoDetalle> {
  if (USE_PRODUCT_MOCKS) {
    return mockFetchProductoById(id);
  }

  const res = await fetch(`${API_BASE}/api/productos/${id}/`, {
    headers: buildHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Producto no encontrado (${res.status})`);
  }

  return res.json();
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