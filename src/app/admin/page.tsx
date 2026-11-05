"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Encabezado del Dashboard */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Ruta Privada Protegida
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Panel de Control | Tuerca y Perno RC
          </h1>
          <p className="text-slate-600 mt-1">
            Bienvenido, <strong className="text-slate-900">{user?.username || "Usuario"}</strong>. Has ingresado con el rol de{" "}
            <span className="font-bold text-brand-600 uppercase">{user?.role || "VENDEDOR"}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="outline" size="md">
              Ver Tienda
            </Button>
          </Link>
          <Button variant="danger" size="md" onClick={logout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Métricas y Accesos Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Pedidos del Día
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">38</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            +14% vs. día anterior
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Fijaciones en Stock
          </div>
          <div className="text-3xl font-black text-brand-600 mt-2">124.500</div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Tornillos, tuercas y pernos
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Corralón / Áridos
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">42 Bolsas</div>
          <div className="text-xs text-amber-600 font-semibold mt-1">
            8 envíos programados
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Estado de Sesión
          </div>
          <div className="text-base font-bold text-emerald-600 mt-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            Token JWT Activo
          </div>
          <div className="text-xs text-slate-400 mt-1 font-mono truncate">
            Almacenado en Cookies
          </div>
        </div>
      </div>

      {/* Módulos de Trabajo según Rol */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Operaciones Disponibles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-slate-200 rounded-xl p-5 hover:border-brand-500 transition-colors">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-bold text-slate-900 mb-1">Presupuestos y Ventas</h3>
            <p className="text-sm text-slate-600">
              Generar presupuestos para obras civiles, talleres metalúrgicos y clientes de mostrador.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-5 hover:border-brand-500 transition-colors">
            <div className="text-2xl mb-2">📦</div>
            <h3 className="font-bold text-slate-900 mb-1">Control de Depósito</h3>
            <p className="text-sm text-slate-600">
              Recepción de mercadería, control de stock de áridos, cemento y bulonería clasificada.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-5 hover:border-brand-500 transition-colors">
            <div className="text-2xl mb-2">🚛</div>
            <h3 className="font-bold text-slate-900 mb-1">Despacho de Camiones</h3>
            <p className="text-sm text-slate-600">
              Hoja de ruta para camiones con hidrogrúa y logística de entrega en obras.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
