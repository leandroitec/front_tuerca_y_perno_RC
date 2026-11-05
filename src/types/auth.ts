export type UserRole = "ADMIN" | "VENDEDOR" | "DEPOSITO";

export interface User {
  id?: number | string;
  username: string;
  email?: string;
  role: UserRole;
}

export interface AuthTokens {
  access: string;
  refresh: string;
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
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}
