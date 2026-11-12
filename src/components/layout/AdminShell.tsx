"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { canAccessRoute } from "@/lib/admin-navigation";
import { getRoleBadge } from "@/lib/roles";
import AdminSidebar from "@/components/layout/AdminSidebar";

interface AdminShellProps {
  children: React.ReactNode;
}

/** Tarjeta centrada para los estados de acceso (sesión inválida / rol sin permiso). */
function AccessCard({
  title,
  message,
  action,
}: {
  title: string;
  message: React.ReactNode;
  action: React.ReactNode;
}) {
  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div
        role="alert"
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center"
      >
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <ShieldAlert className="w-7 h-7" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">{title}</h1>
        <p className="text-slate-600 mb-6">{message}</p>
        {action}
      </div>
    </div>
  );
}

/**
 * Estructura cliente del panel administrativo.
 * El middleware ya bloquea /admin/* sin cookie válida; este componente
 * agrega la validación visual con el AuthContext:
 *  - Muestra un esqueleto mientras se restaura la sesión.
 *  - Informa si la sesión no es válida en el cliente.
 *  - Bloquea las secciones a las que el rol del usuario no tiene acceso.
 */
export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname() ?? "";
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)]" aria-busy="true">
        <div className="hidden lg:block w-72 shrink-0 bg-slate-900 border-r border-slate-800 p-5 space-y-4">
          <div className="h-12 rounded-lg bg-slate-800 animate-pulse" />
          <div className="h-10 rounded-lg bg-slate-800 animate-pulse" />
          <div className="h-10 rounded-lg bg-slate-800 animate-pulse" />
          <div className="h-10 rounded-lg bg-slate-800 animate-pulse" />
        </div>
        <div className="flex-1 p-8 space-y-4">
          <div className="h-8 w-1/3 rounded-lg bg-slate-200 animate-pulse" />
          <div className="h-40 rounded-2xl bg-slate-200 animate-pulse" />
        </div>
        <span className="sr-only">Verificando sesión...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <AccessCard
        title="Sesión no válida"
        message="Necesitás iniciar sesión para ingresar al panel de administración."
        action={
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(pathname || "/admin")}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-sm transition-colors"
          >
            <LogIn className="w-4 h-4" aria-hidden="true" />
            Iniciar Sesión
          </Link>
        }
      />
    );
  }

  const hasAccess = canAccessRoute(user.role, pathname);

  return (
    <div className="lg:flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        {hasAccess ? (
          children
        ) : (
          <AccessCard
            title="Acceso restringido"
            message={
              <>
                Tu rol{" "}
                <strong className="text-slate-900">{getRoleBadge(user.role).text}</strong>{" "}
                no tiene permisos para ingresar a esta sección.
              </>
            }
            action={
              <Link
                href="/admin"
                className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-slate-700 border border-slate-300 bg-white hover:bg-slate-100 rounded-lg transition-colors"
              >
                Volver al Panel de Control
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
