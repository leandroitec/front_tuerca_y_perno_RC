"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Receipt,
  Wallet,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Venta } from "@/types/venta";
import {
  fetchVentas,
  fetchVentasDelDia,
  finalizarVenta,
  USE_VENTA_MOCKS,
} from "@/lib/services/venta-service";
import {
  actualizarEstadoVenta,
  calcularResumenVentas,
  esDelDia,
  formatearFechaHora,
  formatearMoneda,
} from "@/lib/ventas";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import BadgeStatus from "@/components/ui/BadgeStatus";

interface Feedback {
  tipo: "exito" | "error";
  texto: string;
}

interface ResumenCardProps {
  titulo: string;
  valor: string;
  detalle: string;
  icon: LucideIcon;
  acento: string;
}

/** Tarjeta de métrica del resumen diario. */
function ResumenCard({ titulo, valor, detalle, icon: Icon, acento }: ResumenCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{titulo}</p>
        <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${acento}`}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </span>
      </div>
      <p className="text-2xl font-black text-slate-900 mt-2">{valor}</p>
      <p className="text-xs text-slate-500 font-medium mt-1">{detalle}</p>
    </div>
  );
}

export default function VentasAdminPage() {
  const { token } = useAuth();

  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventasDelDia, setVentasDelDia] = useState<Venta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [finalizandoId, setFinalizandoId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  /** Carga en paralelo el historial y las ventas del día. */
  const cargarVentas = useCallback(async () => {
    if (!token && !USE_VENTA_MOCKS) return;
    setIsLoading(true);
    setFetchError(null);
    try {
      const [historial, delDia] = await Promise.all([
        fetchVentas(token ?? ""),
        fetchVentasDelDia(token ?? ""),
      ]);
      setVentas(historial.results);
      setVentasDelDia(delDia);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Error desconocido al cargar ventas.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    cargarVentas();
  }, [cargarVentas]);

  // El mensaje de resultado se oculta solo a los 4 segundos.
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  /** Finaliza la venta en la API (o mock) y actualiza el estado local. */
  const handleFinalizar = useCallback(
    async (venta: Venta) => {
      setFinalizandoId(venta.id);
      setFeedback(null);
      try {
        const { mensaje } = await finalizarVenta(venta.id, token ?? "");
        // La API sólo devuelve un mensaje: se actualiza la venta en ambas listas.
        setVentas((prev) => actualizarEstadoVenta(prev, venta.id, "finalizada"));
        setVentasDelDia((prev) => actualizarEstadoVenta(prev, venta.id, "finalizada"));
        setFeedback({ tipo: "exito", texto: `Venta #${venta.id}: ${mensaje}` });
      } catch (err) {
        setFeedback({
          tipo: "error",
          texto: err instanceof Error ? err.message : `No se pudo finalizar la venta #${venta.id}.`,
        });
      } finally {
        setFinalizandoId(null);
      }
    },
    [token]
  );

  const resumen = useMemo(() => calcularResumenVentas(ventasDelDia), [ventasDelDia]);

  const columns: Column<Venta>[] = [
    {
      header: "N°",
      accessor: (v) => <span className="font-mono font-semibold text-slate-900">#{v.id}</span>,
    },
    {
      header: "Fecha",
      accessor: (v) => (
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          {formatearFechaHora(v.fecha)}
          {esDelDia(v.fecha) && (
            <span className="px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 text-[10px] font-bold uppercase">
              Hoy
            </span>
          )}
        </span>
      ),
    },
    {
      header: "Cliente",
      accessor: (v) => <span className="font-medium text-slate-900">{v.cliente}</span>,
    },
    { header: "Vendedor", accessor: "vendedor" },
    {
      header: "Total",
      accessor: (v) => (
        <span className="font-semibold text-slate-900 whitespace-nowrap">{formatearMoneda(v.total)}</span>
      ),
      className: "text-right",
    },
    {
      header: "Estado",
      accessor: (v) => <BadgeStatus status={v.estado} />,
    },
    {
      header: "Acción",
      accessor: (v) =>
        v.estado === "pendiente" ? (
          <Button
            variant="primary"
            size="sm"
            isLoading={finalizandoId === v.id}
            disabled={finalizandoId !== null}
            onClick={() => handleFinalizar(v)}
            aria-label={`Finalizar venta #${v.id}`}
          >
            Finalizar Venta
          </Button>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
      className: "text-right",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Encabezado ─────────────────────────────────────────────────── */}
      <div className="mb-8">
        <nav className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
          <Link href="/admin" className="hover:text-brand-500 transition-colors">
            Panel Admin
          </Link>
          <span>/</span>
          <span className="text-slate-600 font-medium">Ventas</span>
        </nav>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Ventas</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Resumen de las ventas del día e historial completo de transacciones.
          {USE_VENTA_MOCKS && (
            <span className="ml-2 inline-flex px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[11px] font-bold uppercase">
              Datos simulados
            </span>
          )}
        </p>
      </div>

      {/* ── Error de carga ─────────────────────────────────────────────── */}
      {fetchError && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800"
        >
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" aria-hidden="true" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Error al cargar ventas</p>
            <p className="text-xs text-red-600 mt-0.5">{fetchError}</p>
          </div>
          <Button variant="outline" size="sm" onClick={cargarVentas}>
            Reintentar
          </Button>
        </div>
      )}

      {/* ── Resumen: Ventas del día ────────────────────────────────────── */}
      <section aria-labelledby="titulo-resumen" className="mb-10">
        <h2 id="titulo-resumen" className="text-lg font-bold text-slate-900 mb-4">
          Ventas del día
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-busy="true">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-[118px] rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResumenCard
              titulo="Ventas de hoy"
              valor={String(resumen.cantidad)}
              detalle={resumen.cantidad === 1 ? "1 transacción registrada" : `${resumen.cantidad} transacciones registradas`}
              icon={Receipt}
              acento="bg-slate-100 text-slate-700"
            />
            <ResumenCard
              titulo="Facturado hoy"
              valor={formatearMoneda(resumen.total)}
              detalle="Pendientes + finalizadas"
              icon={Wallet}
              acento="bg-brand-100 text-brand-700"
            />
            <ResumenCard
              titulo="Pendientes"
              valor={String(resumen.pendientes)}
              detalle={`${formatearMoneda(resumen.totalPendiente)} por cerrar`}
              icon={Clock}
              acento="bg-amber-100 text-amber-700"
            />
            <ResumenCard
              titulo="Finalizadas"
              valor={String(resumen.finalizadas)}
              detalle={`${formatearMoneda(resumen.totalFinalizado)} cobrados`}
              icon={CheckCircle2}
              acento="bg-emerald-100 text-emerald-700"
            />
          </div>
        )}
      </section>

      {/* ── Historial ──────────────────────────────────────────────────── */}
      <section aria-labelledby="titulo-historial">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
          <h2 id="titulo-historial" className="text-lg font-bold text-slate-900">
            Historial de ventas
          </h2>
          {!isLoading && !fetchError && (
            <p className="text-sm text-slate-500">
              {ventas.length === 1 ? "1 venta" : `${ventas.length} ventas`}
            </p>
          )}
        </div>

        {/* Resultado de "Finalizar Venta" */}
        {feedback && (
          <div
            role="status"
            className={`mb-4 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium ${
              feedback.tipo === "exito"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {feedback.tipo === "exito" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
            {feedback.texto}
          </div>
        )}

        <DataTable<Venta>
          columns={columns}
          data={ventas}
          isLoading={isLoading}
          emptyMessage="Todavía no hay ventas registradas."
        />
      </section>
    </div>
  );
}
