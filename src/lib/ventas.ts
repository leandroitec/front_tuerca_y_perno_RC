import { EstadoVenta, ResumenVentas, Venta } from "@/types/venta";

/**
 * Utilidades puras del módulo de Ventas (sin React ni red),
 * reutilizables en la vista, el mock y los tests unitarios.
 */

/** Indica si una fecha ISO cae en el mismo día calendario (hora local) que `referencia`. */
export function esDelDia(fechaIso: string, referencia: Date = new Date()): boolean {
  const fecha = new Date(fechaIso);
  return (
    fecha.getFullYear() === referencia.getFullYear() &&
    fecha.getMonth() === referencia.getMonth() &&
    fecha.getDate() === referencia.getDate()
  );
}

/** Calcula cantidades e importes de un conjunto de ventas. */
export function calcularResumenVentas(ventas: readonly Venta[]): ResumenVentas {
  return ventas.reduce<ResumenVentas>(
    (acc, venta) => {
      acc.cantidad += 1;
      switch (venta.estado) {
        case "pendiente":
          acc.pendientes += 1;
          acc.totalPendiente += venta.total;
          acc.total += venta.total;
          break;
        case "finalizada":
          acc.finalizadas += 1;
          acc.totalFinalizado += venta.total;
          acc.total += venta.total;
          break;
        case "cancelada":
          // Las canceladas se cuentan, pero no suman al importe facturado.
          acc.canceladas += 1;
          acc.totalCancelado += venta.total;
          break;
      }
      return acc;
    },
    {
      cantidad: 0,
      total: 0,
      pendientes: 0,
      finalizadas: 0,
      canceladas: 0,
      totalPendiente: 0,
      totalFinalizado: 0,
      totalCancelado: 0,
    }
  );
}

/** Devuelve una copia de la lista con el estado de la venta indicada actualizado. */
export function actualizarEstadoVenta(
  ventas: readonly Venta[],
  id: number,
  estado: EstadoVenta
): Venta[] {
  return ventas.map((venta) => (venta.id === id ? { ...venta, estado } : venta));
}

const formateadorMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
});

/** 125000 -> "$ 125.000,00" */
export function formatearMoneda(valor: number): string {
  return formateadorMoneda.format(valor);
}

const formateadorFecha = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** "2026-11-11T10:32:00-03:00" -> "11/11/2026, 10:32" */
export function formatearFechaHora(fechaIso: string): string {
  const fecha = new Date(fechaIso);
  return Number.isNaN(fecha.getTime()) ? "Fecha inválida" : formateadorFecha.format(fecha);
}
