import { JWTPayload, UserRole } from "@/types/auth";

/**
 * Decodifica el payload de un token JWT de forma segura sin librerías externas pesadas.
 * Compatible con entornos de navegador, Node.js y Next.js Edge Runtime.
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // El payload es la segunda parte del token
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    
    // Decodificación compatible con unicode
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload) as JWTPayload;
  } catch (error) {
    console.error("Error al decodificar JWT:", error);
    return null;
  }
}

/**
 * Verifica si un token JWT ha expirado.
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * Extrae el rol normalizado a partir del payload del token.
 * Soporta roles estándar: ADMIN, VENDEDOR, DEPOSITO.
 */
export function extractRoleFromPayload(payload: JWTPayload | null): UserRole {
  if (!payload) return "VENDEDOR";

  const groupRole = Array.isArray(payload.groups) && payload.groups.length > 0 ? payload.groups[0] : "";
  const rawRole = (payload.role || payload.user_role || groupRole || "")
    .toString()
    .toUpperCase();

  if (rawRole === "ADMIN" || rawRole === "ADMINISTRADOR") return "ADMIN";
  if (rawRole === "DEPOSITO" || rawRole === "DEPÓSITO" || rawRole === "ALMACEN") return "DEPOSITO";
  return "VENDEDOR";
}
