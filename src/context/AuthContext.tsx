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
import { decodeJWT, isTokenExpired, extractRoleFromPayload } from "@/lib/jwt";
import { loginRequest } from "@/lib/auth-service";

const TOKEN_COOKIE_NAME = "auth_token";
const REFRESH_COOKIE_NAME = "refresh_token";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Inicializa la sesión leyendo el token persistido en las cookies
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = Cookies.get(TOKEN_COOKIE_NAME);

        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        if (isTokenExpired(storedToken)) {
          console.warn("[Auth] El token ha expirado. Limpiando sesión.");
          Cookies.remove(TOKEN_COOKIE_NAME, { path: "/" });
          Cookies.remove(REFRESH_COOKIE_NAME, { path: "/" });
          setUser(null);
          setToken(null);
          setIsLoading(false);
          return;
        }

        const payload = decodeJWT(storedToken);
        if (payload) {
          const role: UserRole = extractRoleFromPayload(payload);
          const username = payload.username || (payload.user_id ? `Usuario #${payload.user_id}` : "Usuario");

          setUser({
            id: payload.user_id,
            username: username,
            role: role,
          });
          setToken(storedToken);
        }
      } catch (err) {
        console.error("[Auth] Error al inicializar sesión:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Función de inicio de sesión
  const login = useCallback(
    async (username: string, password: string): Promise<void> => {
      setIsLoading(true);
      try {
        const { access, refresh } = await loginRequest(username, password);

        // Guardar en cookies con atributos seguros para ser legibles tanto por Next.js Middleware como por cliente
        Cookies.set(TOKEN_COOKIE_NAME, access, {
          expires: 1, // 1 día
          sameSite: "lax",
          path: "/",
        });

        if (refresh) {
          Cookies.set(REFRESH_COOKIE_NAME, refresh, {
            expires: 7, // 7 días
            sameSite: "lax",
            path: "/",
          });
        }

        const payload = decodeJWT(access);
        const role: UserRole = extractRoleFromPayload(payload);
        const resolvedUsername = payload?.username || username;

        setUser({
          id: payload?.user_id,
          username: resolvedUsername,
          role: role,
        });
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
    setUser(null);
    setToken(null);

    // Redirigir al login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, []);

  const value: AuthContextType = {
    user,
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
