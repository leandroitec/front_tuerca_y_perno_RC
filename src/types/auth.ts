export type UserRole = "ADMIN" | "VENDEDOR" | "DEPOSITO";

export interface UsuarioApi {
  id?: number | string;
  username: string;
  rol?: string;
  role?: string;
  email?: string;
}

export interface User {
  id?: number | string;
  username: string;
  email?: string;
  role: UserRole;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  usuario?: UsuarioApi;
}

export interface JWTPayload {
  user_id?: number | string;
  username?: string;
  role?: UserRole;
  user_role?: string;
  groups?: string[];
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export interface AuthContextType {
  user: User | null;
  role?: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}
