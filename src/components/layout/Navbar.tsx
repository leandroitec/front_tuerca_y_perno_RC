"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getRoleBadge } from "@/lib/roles";

export const Navbar = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-slate-950 border-b-4 border-primary shadow-hard-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Logo y Nombre de la Empresa: Placa Mecánica Industrial */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform active:translate-y-0.5 select-none"
          >
            {/* Ícono de Tuerca / Engranaje industrial */}
            <div className="w-11 h-11 rounded-none bg-primary text-secondary border-2 border-slate-900 flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] group-hover:bg-amber-400 transition-colors">
              <svg
                className="w-7 h-7 transform group-hover:rotate-90 transition-transform duration-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <circle cx="12" cy="12" r="3" strokeWidth="2.5" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-heading font-black tracking-wider text-white uppercase leading-none">
                TUERCA Y PERNO <span className="text-primary">RC</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase mt-1">
                DIVISIÓN INDUSTRIAL & CORRALÓN
              </span>
            </div>
          </Link>

          {/* Navegación central: estilo panel de instrumentos */}
          <nav className="hidden lg:flex items-center gap-1 font-heading uppercase tracking-wider text-xs xl:text-sm">
            <Link
              href="/"
              className="px-2.5 py-1.5 font-bold text-slate-300 hover:text-white hover:bg-slate-900 border-2 border-transparent hover:border-slate-800 transition-colors"
            >
              INICIO
            </Link>
            <Link
              href="/catalogo"
              className="px-2.5 py-1.5 font-bold text-slate-300 hover:text-white hover:bg-slate-900 border-2 border-transparent hover:border-slate-800 transition-colors"
            >
              CATÁLOGO
            </Link>
            <Link
              href="/quienes-somos"
              className="px-2.5 py-1.5 font-bold text-slate-300 hover:text-white hover:bg-slate-900 border-2 border-transparent hover:border-slate-800 transition-colors"
            >
              QUIÉNES SOMOS
            </Link>
            <Link
              href="/ubicacion"
              className="px-2.5 py-1.5 font-bold text-slate-300 hover:text-white hover:bg-slate-900 border-2 border-transparent hover:border-slate-800 transition-colors"
            >
              UBICACIÓN
            </Link>
            <Link
              href="/contacto"
              className="px-2.5 py-1.5 font-bold text-slate-300 hover:text-white hover:bg-slate-900 border-2 border-transparent hover:border-slate-800 transition-colors"
            >
              CONTACTO
            </Link>
            {isAuthenticated && user && (
              <Link
                href="/admin"
                className="ml-2 px-3 py-1.5 font-bold text-primary bg-slate-900 hover:bg-slate-800 border-2 border-primary/50 hover:border-primary flex items-center gap-2 transition-all shadow-[2px_2px_0px_0px_#000]"
              >
                <span className="w-2 h-2 rounded-none bg-primary animate-pulse border border-black"></span>
                <span>PANEL</span>
              </Link>
            )}
          </nav>

          {/* Área de Autenticación / Operador */}
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="h-9 w-28 bg-slate-800 animate-pulse border-2 border-slate-700"></div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {/* Info de usuario y credencial de rol */}
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                    OPERADOR: <span className="text-white">{user.username}</span>
                  </span>
                  {(() => {
                    const badge = getRoleBadge(user.role);
                    return (
                      <span
                        className={`text-[9px] text-grey bg-amber-500 font-mono font-black px-2 py-0.5 rounded-none border-2 border-slate-900 uppercase tracking-widest mt-0.5 shadow-[1px_1px_0px_0px_#000] ${badge.className}`}
                      >
                        {badge.text}
                      </span>
                    );
                  })()}
                </div>

                {/* Botón Salir / Desconectar */}
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-heading font-bold uppercase tracking-wider text-slate-200 bg-slate-900 hover:bg-red-600 hover:text-white border-2 border-slate-700 hover:border-slate-900 rounded-none transition-all duration-100 shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none"
                  title="Cerrar Sesión"
                >
                  <svg
                    className="w-4 h-4 text-red-400 group-hover:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      strokeWidth="2.5"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline">SALIR</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-heading font-black uppercase tracking-wider text-secondary bg-primary hover:bg-amber-400 border-2 border-slate-900 border-b-4 border-r-2 rounded-none transition-all shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:border-b-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                <span>ACCESO SISTEMA</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
