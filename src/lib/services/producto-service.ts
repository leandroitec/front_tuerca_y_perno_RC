import Cookies from "js-cookie";
import {
  ActualizarStockPayload,
  Producto,
  ProductoDetalle,
  ProductosQuery,
  ProductosResponse,
} from "@/types/producto";
import { ProductoFormValues } from "@/lib/validations/producto";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

export const TOKEN_COOKIE_NAME = "auth_token";

/**
 * Clase para errores originados en llamadas a la API de Django REST Framework.
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
 * Construye los encabezados estándar para las peticiones HTTP.
 */
export function buildHeaders(token?: string, isJson: boolean = true): HeadersInit {
  const authToken = token || getStoredToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  return headers;
}

/**
 * Procesa la respuesta de error de DRF y lanza una excepción descriptiva.
 */
export async function handleApiError(response: Response, defaultMessage: string): Promise<never> {
  let errorData: Record<string, unknown> | null = null;
  try {
    errorData = (await response.json()) as Record<string, unknown>;
  } catch {
    // Si la respuesta no es JSON válido, se ignora
  }

  let message = defaultMessage;

  if (response.status === 401) {
    message =
      (typeof errorData?.detail === "string" && errorData.detail) ||
      "No autorizado (401). Tu sesión ha expirado o el token es inválido.";
  } else if (response.status === 403) {
    message =
      (typeof errorData?.detail === "string" && errorData.detail) ||
      "Acceso denegado (403). No posees los permisos necesarios.";
  } else if (response.status === 404) {
    message =
      (typeof errorData?.detail === "string" && errorData.detail) ||
      "Recurso no encontrado (404).";
  } else if (response.status === 400) {
    if (typeof errorData?.detail === "string") {
      message = errorData.detail;
    } else if (Array.isArray(errorData?.non_field_errors) && errorData.non_field_errors.length > 0) {
      message = String(errorData.non_field_errors[0]);
    } else if (errorData && typeof errorData === "object") {
      // Tomar el primer error de campo devuelto por Django
      const firstKey = Object.keys(errorData)[0];
      const val = errorData[firstKey];
      if (Array.isArray(val) && val.length > 0) {
        message = `${firstKey}: ${val[0]}`;
      } else if (typeof val === "string") {
        message = `${firstKey}: ${val}`;
      } else {
        message = "Datos de formulario inválidos (400). Verifica los campos.";
      }
    } else {
      message = "Solicitud incorrecta (400).";
    }
  } else if (typeof errorData?.detail === "string") {
    message = errorData.detail;
  } else {
    message = `${defaultMessage} (HTTP ${response.status})`;
  }

  throw new ApiError(message, response.status, errorData);
}

/**
 * Convierte los valores del formulario al formato numérico/relacional esperado por Django DRF.
 */
export function toApiPayload(values: Partial<ProductoFormValues> | Record<string, unknown>) {
  return {
    nombre: values.nombre as string | undefined,
    precio: typeof values.precio === "number" ? values.precio : Number(values.precio),
    stock: typeof values.stock === "number" ? values.stock : Number.parseInt(String(values.stock), 10),
    categoria: typeof values.categoria_id === "number" ? values.categoria_id : Number(values.categoria_id),
    marca: typeof values.marca_id === "number" ? values.marca_id : Number(values.marca_id),
    descripcion: (values.descripcion as string | undefined) ?? "",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICIOS DE PRODUCTOS (DJANGO REST FRAMEWORK)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/productos/?page=&categoria=&search=
 * Obtiene el listado público o paginado de productos desde Django.
 * Acepta polimórficamente (query?, token?) o (token?, query?).
 */
export async function getProductos(
  arg1?: ProductosQuery | string,
  arg2?: string | ProductosQuery
): Promise<ProductosResponse> {
  let query: ProductosQuery | undefined;
  let token: string | undefined;

  if (typeof arg1 === "string") {
    token = arg1;
    if (arg2 && typeof arg2 === "object") query = arg2;
  } else if (arg1 && typeof arg1 === "object") {
    query = arg1;
    if (typeof arg2 === "string") token = arg2;
  } else {
    if (typeof arg2 === "string") token = arg2;
    else if (arg2 && typeof arg2 === "object") query = arg2;
  }

  const params = new URLSearchParams();
  if (query?.page && query.page > 1) params.set("page", String(query.page));
  if (query?.categoria) params.set("categoria", query.categoria);
  if (query?.search) params.set("search", query.search);

  const queryString = params.toString() ? `?${params.toString()}` : "";
  const endpoint = `${API_BASE_URL}/api/productos/${queryString}`;

  const res = await fetch(endpoint, {
    method: "GET",
    headers: buildHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    await handleApiError(res, "Error al obtener productos");
  }

  return res.json();
}
export const fetchProductos = getProductos;

/**
 * Recorre todas las páginas de un endpoint paginado de DRF y devuelve la
 * lista completa. Pide ?page=N en vez de seguir el campo "next", porque el
 * backend lo arma con http:// y el navegador lo bloquea desde un sitio https.
 */
export async function getTodasLasPaginas<T>(
  path: string,
  token: string | undefined,
  errorMessage: string
): Promise<T[]> {
  const items: T[] = [];
  const separador = path.includes("?") ? "&" : "?";

  // Límite de seguridad para no quedar en un bucle infinito
  for (let page = 1; page <= 100; page++) {
    const sufijo = page > 1 ? `${separador}page=${page}` : "";
    const res = await fetch(`${API_BASE_URL}${path}${sufijo}`, {
      method: "GET",
      headers: buildHeaders(token),
      cache: "no-store",
    });

    if (!res.ok) {
      await handleApiError(res, errorMessage);
    }

    const data = await res.json();
    if (Array.isArray(data)) return data as T[];

    items.push(...((data.results ?? []) as T[]));
    if (!data.next) break;
  }

  return items;
}

/**
 * GET /api/productos/ (todas las páginas)
 * Lista completa de productos para el panel de administración.
 */
export async function getTodosLosProductos(token?: string): Promise<Producto[]> {
  return getTodasLasPaginas<Producto>(
    "/api/productos/",
    token,
    "Error al obtener productos"
  );
}

/**
 * GET /api/productos/{id}/
 * Obtiene el detalle técnico y stock de un producto específico.
 */
export async function getProductoById(
  id: string | number,
  token?: string
): Promise<ProductoDetalle | null> {
  const endpoint = `${API_BASE_URL}/api/productos/${id}/`;

  const res = await fetch(endpoint, {
    method: "GET",
    headers: buildHeaders(token),
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    await handleApiError(res, `Error al obtener el producto #${id}`);
  }

  return res.json();
}
export const fetchProductoById = getProductoById;

/**
 * POST /api/productos/
 * Crea un nuevo producto en Django. Devuelve el objeto Response nativo
 * para que ProductForm procese los errores de validación de campo (HTTP 400).
 */
export async function createProducto(
  values: ProductoFormValues | Record<string, unknown>,
  token?: string
): Promise<Response> {
  const endpoint = `${API_BASE_URL}/api/productos/`;
  const payload = toApiPayload(values);

  return fetch(endpoint, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });
}

/**
 * Versión de conveniencia de createProducto que lanza ApiError si la respuesta falla.
 */
export async function createProductoData(
  values: ProductoFormValues | Record<string, unknown>,
  token?: string
): Promise<ProductoDetalle> {
  const res = await createProducto(values, token);
  if (!res.ok) {
    await handleApiError(res, "Error al crear el producto");
  }
  return res.json();
}

/**
 * PUT /api/productos/{id}/
 * Actualiza un producto existente en Django. Devuelve el Response nativo.
 */
export async function updateProducto(
  id: string | number,
  values: ProductoFormValues | Record<string, unknown>,
  token?: string
): Promise<Response> {
  const endpoint = `${API_BASE_URL}/api/productos/${id}/`;
  const payload = toApiPayload(values);

  return fetch(endpoint, {
    method: "PUT",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });
}

/**
 * Versión de conveniencia de updateProducto que lanza ApiError si la respuesta falla.
 */
export async function updateProductoData(
  id: string | number,
  values: ProductoFormValues | Record<string, unknown>,
  token?: string
): Promise<ProductoDetalle> {
  const res = await updateProducto(id, values, token);
  if (!res.ok) {
    await handleApiError(res, `Error al actualizar el producto #${id}`);
  }
  return res.json();
}

/**
 * DELETE /api/productos/{id}/
 * Elimina un producto por ID.
 */
export async function deleteProducto(
  id: string | number,
  token?: string
): Promise<Response> {
  const endpoint = `${API_BASE_URL}/api/productos/${id}/`;

  return fetch(endpoint, {
    method: "DELETE",
    headers: buildHeaders(token, false),
  });
}

/**
 * Versión de conveniencia de deleteProducto que lanza ApiError en caso de fallo.
 */
export async function deleteProductoData(
  id: string | number,
  token?: string
): Promise<void> {
  const res = await deleteProducto(id, token);
  if (!res.ok && res.status !== 204) {
    await handleApiError(res, `Error al eliminar el producto #${id}`);
  }
}

/**
 * POST /api/productos/{id}/actualizar-stock/
 * Modifica las existencias de un producto sumando o restando unidades.
 */
export async function actualizarStock(
  productoId: number | string,
  payload: ActualizarStockPayload,
  token?: string
): Promise<Response> {
  const endpoint = `${API_BASE_URL}/api/productos/${productoId}/actualizar-stock/`;

  return fetch(endpoint, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICIOS DE CATÁLOGOS AUXILIARES (CATEGORÍAS Y MARCAS)
// ─────────────────────────────────────────────────────────────────────────────

export interface CatalogoItem {
  id: number;
  nombre: string;
}

export interface CatalogoListResponse {
  results: CatalogoItem[];
}

/**
 * GET /api/categorias/
 * Obtiene el listado de categorías disponibles en la ferretería.
 */
export async function getCategorias(token?: string): Promise<CatalogoItem[]> {
  return getTodasLasPaginas<CatalogoItem>(
    "/api/categorias/",
    token,
    "Error al obtener las categorías"
  );
}

/**
 * GET /api/marcas/
 * Obtiene el listado de marcas registradas.
 */
export async function getMarcas(token?: string): Promise<CatalogoItem[]> {
  return getTodasLasPaginas<CatalogoItem>(
    "/api/marcas/",
    token,
    "Error al obtener las marcas"
  );
}

/**
 * Bandera retrocompatible: en integración real los mocks están inactivos.
 */
export const USE_PRODUCT_MOCKS = false;