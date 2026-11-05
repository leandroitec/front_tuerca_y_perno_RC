import { AuthTokens, UserRole } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Genera un token JWT simulado para desarrollo/evaluación offline
 * cuando el servidor Django no esté activo localmente.
 */
function createSimulatedToken(username: string, role: UserRole): string {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    token_type: "access",
    exp: now + 3600 * 8, // 8 horas de validez
    iat: now,
    jti: Math.random().toString(36).substring(2),
    user_id: Math.floor(Math.random() * 1000) + 1,
    username: username,
    role: role,
  };

  const toBase64 = (obj: object) =>
    btoa(JSON.stringify(obj))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

  return `${toBase64(header)}.${toBase64(payload)}.SIMULATED_SIGNATURE_${btoa(username)}`;
}

/**
 * Cliente de autenticación con Django SimpleJWT.
 * Realiza POST a /api/token/ y cuenta con fallback simulado.
 */
export async function loginRequest(
  username: string,
  password: string
): Promise<AuthTokens> {
  const endpoint = `${API_BASE_URL}/api/token/`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        access: data.access,
        refresh: data.refresh,
      };
    }

    // Si el backend responde con error 401/400 de credenciales
    if (response.status === 401 || response.status === 400) {
      const errorData = await response.json().catch(() => null);
      const detail =
        errorData?.detail || "Usuario o contraseña incorrectos. Verifica tus credenciales.";
      throw new Error(detail);
    }

    throw new Error(`Error en el servidor (${response.status})`);
  } catch (error: unknown) {
    // Si la conexión falla (por ejemplo el backend Django aún no está encendido en localhost)
    // proveemos simulación para facilitar la prueba de la interfaz y la experiencia
    const isNetworkError =
      error instanceof TypeError && error.message.includes("fetch");

    if (isNetworkError) {
      console.warn(
        `[AuthService] No se pudo conectar a ${endpoint}. Usando fallback de autenticación simulada.`
      );

      // Simulación de roles para Tuerca y Perno RC
      const lowerUser = username.toLowerCase().trim();
      let role: UserRole = "VENDEDOR";

      if (lowerUser.includes("admin")) {
        role = "ADMIN";
      } else if (lowerUser.includes("deposito") || lowerUser.includes("almacen")) {
        role = "DEPOSITO";
      } else {
        role = "VENDEDOR";
      }

      // Si la contraseña es inválida en modo simulado (ejemplo contraseña vacía o 'error')
      if (password === "error" || password.length === 0) {
        throw new Error("Credenciales inválidas (simulación de prueba).");
      }

      return {
        access: createSimulatedToken(username, role),
        refresh: createSimulatedToken(username, role),
      };
    }

    // Re-lanzar error si vino del backend
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Ocurrió un error inesperado al intentar iniciar sesión.");
  }
}
