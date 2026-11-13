import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isTokenExpired } from "@/lib/jwt";

/**
 * Middleware para proteger rutas privadas en Next.js App Router.
 * Intercepta cualquier intento de acceder a /admin/* y redirige a /login
 * si no existe una cookie con un token JWT válido.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  // Si no hay token o el token ya ha expirado, redirigir a /login
  if (!token || isTokenExpired(token)) {
    const loginUrl = new URL("/login", request.url);
    // Preservar la ruta a la que intentaba ingresar para redirección posterior
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configuración de rutas interceptadas por el Middleware
export const config = {
  matcher: ["/admin/:path*"],
};
