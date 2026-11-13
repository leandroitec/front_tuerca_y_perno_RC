"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { UMBRAL_ULTIMAS_UNIDADES } from "@/components/ui/ProductCard";
import { getTodosLosProductos } from "@/lib/services/producto-service";
import { getVentasDelDia } from "@/lib/services/venta-service";
import { calcularResumenVentas, formatearMoneda } from "@/lib/ventas";
import { ADMIN_NAV_ITEMS, canAccessNavItem } from "@/lib/admin-navigation";
import type { ResumenVentas } from "@/types/venta";

interface ResumenStock {
  productos: number;
  unidades: number;
  stockBajo: number;
}

/** Puede el rol entrar a la sección con este href (misma regla que el menú). */
function puedeEntrar(role: Parameters<typeof canAccessNavItem>[0], href: string) {
  const item = ADMIN_NAV_ITEMS.find((i) => i.href === href);
  return !!item && canAccessNavItem(role, item);
}

export default function AdminDashboardPage() {
  const { user, token, logout } = useAuth();
  const puedeVerVentas = puedeEntrar(user?.role, "/admin/ventas");
  const puedeVerProductos = puedeEntrar(user?.role, "/admin/productos");

  const [ventasHoy, setVentasHoy] = useState<ResumenVentas | null>(null);
  const [stock, setStock] = useState<ResumenStock | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Métricas reales desde la API de Django
  useEffect(() => {
    if (!token) return;
    let cancelado = false;

    getTodosLosProductos(token)
      .then((productos) => {
        if (cancelado) return;
        setStock({
          productos: productos.length,
          unidades: productos.reduce((acc, p) => acc + p.stock, 0),
          stockBajo: productos.filter((p) => p.stock <= UMBRAL_ULTIMAS_UNIDADES).length,
        });
      })
      .catch(() => !cancelado && setError("No se pudieron cargar las métricas de stock."));

    if (puedeVerVentas) {
      getVentasDelDia(token)
        .then((ventas) => !cancelado && setVentasHoy(calcularResumenVentas(ventas)))
        .catch(() => !cancelado && setError("No se pudieron cargar las ventas del día."));
    }

    return () => {
      cancelado = true;
    };
  }, [token, puedeVerVentas]);

  const cargando = "…";

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

      {error && (
        <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Métricas reales (API de Django) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Ventas del Día
          </div>
          {puedeVerVentas ? (
            <>
              <div className="text-3xl font-black text-slate-900 mt-2">
                {ventasHoy ? ventasHoy.cantidad : cargando}
              </div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">
                {ventasHoy ? `${formatearMoneda(ventasHoy.total)} facturado` : "Cargando..."}
              </div>
            </>
          ) : (
            <>
              <div className="text-3xl font-black text-slate-300 mt-2">—</div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                No disponible para tu rol
              </div>
            </>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Productos en Catálogo
          </div>
          <div className="text-3xl font-black text-brand-600 mt-2">
            {stock ? stock.productos : cargando}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            {stock ? `${stock.unidades.toLocaleString("es-AR")} unidades en stock` : "Cargando..."}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Stock Bajo
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {stock ? stock.stockBajo : cargando}
          </div>
          <div className="text-xs text-amber-600 font-semibold mt-1">
            Productos con {UMBRAL_ULTIMAS_UNIDADES} unidades o menos
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
          {puedeVerVentas && (
          <Link
            href="/admin/ventas"
            className="group block border border-slate-200 rounded-xl p-5 hover:border-brand-500 hover:shadow-md transition-all duration-200 bg-slate-50/50 hover:bg-white"
          >
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-1">
              Gestión de Ventas
            </h3>
            <p className="text-sm text-slate-600">
              Consultá ventas del día, finalizá órdenes pendientes e inspeccioná el historial.
            </p>
          </Link>
          )}

          {puedeVerProductos && (
          <Link
            href="/admin/productos"
            className="group block border border-slate-200 rounded-xl p-5 hover:border-brand-500 hover:shadow-md transition-all duration-200 bg-slate-50/50 hover:bg-white"
          >
            <div className="text-2xl mb-2">📦</div>
            <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-1">
              Control de Inventario
            </h3>
            <p className="text-sm text-slate-600">
              Administrá el stock de áridos, bulonería y herramientas (altas, bajas y edición).
            </p>
          </Link>
          )}

          <Link
            href="/catalogo"
            className="group block border border-slate-200 rounded-xl p-5 hover:border-brand-500 hover:shadow-md transition-all duration-200 bg-slate-50/50 hover:bg-white"
          >
            <div className="text-2xl mb-2">🛒</div>
            <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-1">
              Catálogo de Clientes
            </h3>
            <p className="text-sm text-slate-600">
              Explorá la vista pública de artículos, fichas técnicas y disponibilidad para obras.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
