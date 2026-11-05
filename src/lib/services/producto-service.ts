import { Producto, ProductoDetalle, ProductosResponse } from "@/types/producto";
import { ProductoFormValues } from "@/lib/validations/producto";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Construye los headers base con Authorization JWT.
 * Lanza error si no hay token disponible.
 */
function buildHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Transforma los valores del formulario (todos string para el input HTML)
 * al payload tipado que espera el backend Django.
 */
function toApiPayload(values: ProductoFormValues) {
  return {
    nombre: values.nombre,
    precio: parseFloat(values.precio),
    stock: parseInt(values.stock, 10),
    categoria_id: parseInt(values.categoria_id, 10),
    marca_id: parseInt(values.marca_id, 10),
    descripcion: values.descripcion ?? "",
  };
}

/** GET /api/productos/ — Obtiene la lista paginada de productos */
export async function fetchProductos(token: string): Promise<ProductosResponse> {
  const res = await fetch(`${API_BASE}/api/productos/`, {
    headers: buildHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Error al obtener productos (${res.status})`);
  }

  return res.json();
}

/** GET /api/productos/{id}/ — Obtiene el detalle de un producto */
export async function fetchProductoById(
  id: string | number,
  token: string
): Promise<ProductoDetalle> {
  const res = await fetch(`${API_BASE}/api/productos/${id}/`, {
    headers: buildHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Producto no encontrado (${res.status})`);
  }

  return res.json();
}

/** POST /api/productos/ — Crea un nuevo producto */
export async function createProducto(
  values: ProductoFormValues,
  token: string
): Promise<Response> {
  return fetch(`${API_BASE}/api/productos/`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(toApiPayload(values)),
  });
}

/** PUT /api/productos/{id}/ — Actualiza un producto existente */
export async function updateProducto(
  id: string | number,
  values: ProductoFormValues,
  token: string
): Promise<Response> {
  return fetch(`${API_BASE}/api/productos/${id}/`, {
    method: "PUT",
    headers: buildHeaders(token),
    body: JSON.stringify(toApiPayload(values)),
  });
}

/** DELETE /api/productos/{id}/ — Elimina un producto */
export async function deleteProducto(
  id: string | number,
  token: string
): Promise<Response> {
  return fetch(`${API_BASE}/api/productos/${id}/`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });
}
