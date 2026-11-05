"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";

// Función auxiliar para colorear la etiqueta del rol
function getRoleBadge(role: UserRole) {
  switch (role) {
    case "ADMIN":
      return {
        text: "Administrador",
        className: "bg-purple-100 text-purple-800 border-purple-200",
      };
    case "VENDEDOR":
      return {
        text: "Ventas",
        className: "bg-emerald-100 text-emerald-800 border-emerald-200",
      };
    case "DEPOSITO":
      return {
        text: "Depósito / Corralón",
        className: "bg-amber-100 text-amber-800 border-amber-200",
      };
    default:
      return {
        text: role,
        className: "bg-slate-100 text-slate-800 border-slate-200",
      };
  }
}

export const Navbar = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Nombre de la Empresa */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform active:scale-95"
          >
            <div className="w-10 h-10 rounded-lg bg-brand-500 flex items-center justify-center text-white shadow-md group-hover:bg-brand-600 transition-colors">
              {/* Icono de Tuerca / Tornillo */}
              <svg
                className="w-6 h-6 transform group-hover:rotate-45 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider text-white uppercase font-sans">
                Tuerca y Perno <span className="text-brand-500">RC</span>
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 font-medium uppercase -mt-1">
                Ferretería & Corralón
              </span>
            </div>
          </Link>

          {/* Navegación central */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Inicio
            </Link>
            {isAuthenticated && user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="text-sm font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                Panel Administración
              </Link>
            )}
          </nav>

          {/* Área de Autenticación / Usuario */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-8 w-24 bg-slate-800 animate-pulse rounded-md"></div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {/* Info de usuario y badge de rol */}
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold text-white">
                    {user.username}
                  </span>
                  {(() => {
                    const badge = getRoleBadge(user.role);
                    return (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badge.className}`}
                      >
                        {badge.text}
                      </span>
                    );
                  })()}
                </div>

                {/* Botón Cerrar Sesión */}
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-red-600/90 border border-slate-700 hover:border-red-600 rounded-lg transition-all duration-150 shadow-sm"
                  title="Cerrar Sesión"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 rounded-lg shadow-sm transition-all duration-150"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                <span>Iniciar Sesión</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
