"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { AuthContextType, User, UserRole } from "@/types/auth";
import { decodeJWT, isTokenExpired } from "@/lib/jwt";
import { loginRequest } from "@/lib/auth-service";

export const TOKEN_COOKIE_NAME = "auth_token";
export const REFRESH_COOKIE_NAME = "refresh_token";
export const USER_COOKIE_NAME = "auth_user";
export const ROLE_COOKIE_NAME = "auth_role";
export const USERNAME_COOKIE_NAME = "auth_username";

/**
 * Normaliza el string de rol proveniente de la API (ej: "admin", "ventas", "deposito")
 * al tipo estándar UserRole ("ADMIN", "VENDEDOR", "DEPOSITO").
 * Si el backend envía un rol no mapeado, preserva el valor en mayúsculas sin hardcodear.
 */
export function normalizeRole(rawRole?: string): UserRole {
  if (!rawRole) return "VENDEDOR";
  const r = String(rawRole).trim().toUpperCase();

  if (r === "ADMIN" || r === "ADMINISTRADOR") return "ADMIN";
  if (r === "VENTAS" || r === "VENDEDOR") return "VENDEDOR";
  if (r === "DEPOSITO" || r === "DEPÓSITO" || r === "ALMACEN") return "DEPOSITO";

  return r as UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Inicializa la sesión leyendo token, username y rol desde cookies y localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken =
          Cookies.get(TOKEN_COOKIE_NAME) ||
          (typeof window !== "undefined" ? localStorage.getItem(TOKEN_COOKIE_NAME) : null);

        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        // Verificar expiración del JWT
        if (isTokenExpired(storedToken)) {
          console.warn("[Auth] El token ha expirado. Limpiando sesión.");
          Cookies.remove(TOKEN_COOKIE_NAME, { path: "/" });
          Cookies.remove(REFRESH_COOKIE_NAME, { path: "/" });
          Cookies.remove(USER_COOKIE_NAME, { path: "/" });
          Cookies.remove(ROLE_COOKIE_NAME, { path: "/" });
          Cookies.remove(USERNAME_COOKIE_NAME, { path: "/" });

          if (typeof window !== "undefined") {
            localStorage.removeItem(TOKEN_COOKIE_NAME);
            localStorage.removeItem(USER_COOKIE_NAME);
            localStorage.removeItem(ROLE_COOKIE_NAME);
            localStorage.removeItem(USERNAME_COOKIE_NAME);
          }

          setUser(null);
          setRole(null);
          setToken(null);
          setIsLoading(false);
          return;
        }

        // Recuperar datos de usuario persistidos
        const storedUserJson =
          Cookies.get(USER_COOKIE_NAME) ||
          (typeof window !== "undefined" ? localStorage.getItem(USER_COOKIE_NAME) : null);

        let resolvedUser: User | null = null;

        if (storedUserJson) {
          try {
            const parsed = JSON.parse(storedUserJson);
            if (parsed && parsed.username) {
              const userRole = normalizeRole(parsed.role || parsed.rol);
              resolvedUser = {
                id: parsed.id,
                username: parsed.username,
                role: userRole,
                email: parsed.email,
              };
            }
          } catch {
            // Error al parsear JSON, se recurre a decodificar el token
          }
        }

        // Si no había usuario guardado en JSON, recuperar de cookies/localStorage individuales o JWT
        if (!resolvedUser) {
          const storedUsername =
            Cookies.get(USERNAME_COOKIE_NAME) ||
            (typeof window !== "undefined" ? localStorage.getItem(USERNAME_COOKIE_NAME) : null);
          const storedRoleRaw =
            Cookies.get(ROLE_COOKIE_NAME) ||
            (typeof window !== "undefined" ? localStorage.getItem(ROLE_COOKIE_NAME) : null);

          const payload = decodeJWT(storedToken);
          const resolvedRole = normalizeRole(storedRoleRaw || payload?.role || payload?.user_role);
          const resolvedUsername =
            storedUsername ||
            payload?.username ||
            (payload?.user_id ? `Usuario #${payload.user_id}` : "Usuario");

          resolvedUser = {
            id: payload?.user_id,
            username: resolvedUsername,
            role: resolvedRole,
          };
        }

        setUser(resolvedUser);
        setRole(resolvedUser.role);
        setToken(storedToken);
      } catch (err) {
        console.error("[Auth] Error al inicializar sesión:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Función de inicio de sesión con Django REST Framework
  const login = useCallback(
    async (username: string, password: string): Promise<void> => {
      setIsLoading(true);
      try {
        const response = await loginRequest(username, password);
        const { access, refresh, usuario } = response;

        // 1. Persistencia de tokens (1 día para access, 7 para refresh)
        Cookies.set(TOKEN_COOKIE_NAME, access, {
          expires: 1,
          sameSite: "lax",
          path: "/",
        });

        if (refresh) {
          Cookies.set(REFRESH_COOKIE_NAME, refresh, {
            expires: 7,
            sameSite: "lax",
            path: "/",
          });
        }

        // 2. Extracción dinámica del rol y datos del usuario devuelto por Django
        // Formato esperado de Django: { access, refresh, usuario: { id, username, rol } }
        const rawRole = usuario?.rol || usuario?.role;
        const normalizedRole = normalizeRole(rawRole);
        const resolvedUsername = usuario?.username || username;
        const resolvedId = usuario?.id ?? decodeJWT(access)?.user_id;

        const resolvedUser: User = {
          id: resolvedId,
          username: resolvedUsername,
          role: normalizedRole,
          email: usuario?.email,
        };

        // 3. Persistir datos del usuario en Cookies y localStorage para sobrevivir recargas (F5)
        Cookies.set(USER_COOKIE_NAME, JSON.stringify(resolvedUser), {
          expires: 1,
          sameSite: "lax",
          path: "/",
        });
        Cookies.set(ROLE_COOKIE_NAME, normalizedRole, {
          expires: 1,
          sameSite: "lax",
          path: "/",
        });
        Cookies.set(USERNAME_COOKIE_NAME, resolvedUsername, {
          expires: 1,
          sameSite: "lax",
          path: "/",
        });

        if (typeof window !== "undefined") {
          localStorage.setItem(TOKEN_COOKIE_NAME, access);
          localStorage.setItem(USER_COOKIE_NAME, JSON.stringify(resolvedUser));
          localStorage.setItem(ROLE_COOKIE_NAME, normalizedRole);
          localStorage.setItem(USERNAME_COOKIE_NAME, resolvedUsername);
        }

        // 4. Actualizar estado del contexto
        setRole(normalizedRole);
        setUser(resolvedUser);
        setToken(access);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Función de cierre de sesión
  const logout = useCallback(() => {
    Cookies.remove(TOKEN_COOKIE_NAME, { path: "/" });
    Cookies.remove(REFRESH_COOKIE_NAME, { path: "/" });
    Cookies.remove(USER_COOKIE_NAME, { path: "/" });
    Cookies.remove(ROLE_COOKIE_NAME, { path: "/" });
    Cookies.remove(USERNAME_COOKIE_NAME, { path: "/" });

    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_COOKIE_NAME);
      localStorage.removeItem(USER_COOKIE_NAME);
      localStorage.removeItem(ROLE_COOKIE_NAME);
      localStorage.removeItem(USERNAME_COOKIE_NAME);
      window.location.href = "/login";
    }

    setUser(null);
    setRole(null);
    setToken(null);
  }, []);

  const value: AuthContextType = {
    user,
    role,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
}

export default AuthContext;
