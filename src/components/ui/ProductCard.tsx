import React from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import type { EstadoStock, Producto } from "@/types/producto";
import { formatCurrency } from "@/lib/utils";

/** A partir de esta cantidad (inclusive) se muestra "Últimas unidades" */
export const UMBRAL_ULTIMAS_UNIDADES = 5;

/** Convierte el precio decimal de la API ("125000.00") a moneda local ($ 125.000,00) */
export function formatearPrecio(precio: string | number): string {
  return formatCurrency(precio, "Precio a consultar");
}

export function obtenerEstadoStock(stock: number): EstadoStock {
  if (stock <= 0) return "SIN_STOCK";
  if (stock <= UMBRAL_ULTIMAS_UNIDADES) return "ULTIMAS_UNIDADES";
  return "EN_STOCK";
}

const ESTILOS_BADGE: Record<
  EstadoStock,
  { texto: string; contenedor: string; punto: string }
> = {
  EN_STOCK: {
    texto: "En stock",
    contenedor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    punto: "bg-emerald-500",
  },
  ULTIMAS_UNIDADES: {
    texto: "Últimas unidades",
    contenedor: "bg-amber-100 text-amber-800 border-amber-300",
    punto: "bg-amber-500",
  },
  SIN_STOCK: {
    texto: "Sin stock",
    contenedor: "bg-red-100 text-red-800 border-red-200",
    punto: "bg-red-500",
  },
};

interface StockBadgeProps {
  stock: number;
  className?: string;
}

/** Etiqueta visual del estado de stock (verde / amarillo / rojo) */
export function StockBadge({ stock, className = "" }: StockBadgeProps) {
  const estilo = ESTILOS_BADGE[obtenerEstadoStock(stock)];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wide whitespace-nowrap ${estilo.contenedor} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${estilo.punto}`} aria-hidden="true" />
      {estilo.texto}
    </span>
  );
}

export interface ProductCardProps {
  producto: Producto;
}

export function ProductCard({ producto }: ProductCardProps) {
  const { id, nombre, marca, categoria, precio, stock } = producto;

  const nombreMarca =
    typeof marca === "string" ? marca : marca.nombre;

  const nombreCategoria =
    typeof categoria === "string" ? categoria : categoria.nombre;

  return (
    <Link
      href={`/catalogo/${id}`}
      className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-brand-500/50 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
    >
      {/* Franja de seguridad industrial */}
      <div
        className="h-1.5 bg-[repeating-linear-gradient(-45deg,#facc15_0_8px,#1e293b_8px_16px)]"
        aria-hidden="true"
      />

      {/* Cabecera visual del producto */}
      <div className="relative h-32 bg-slate-900 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px] opacity-10"
          aria-hidden="true"
        />
        <Package
          className="relative w-12 h-12 text-slate-600 transition-colors duration-200 group-hover:text-brand-500"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-wider">
          {nombreCategoria}
        </span>
      </div>

      {/* Información del producto */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
          {nombreMarca}
        </p>
        <h2 className="mt-1 text-base font-bold leading-snug text-slate-900 line-clamp-2 transition-colors group-hover:text-brand-600">
          {nombre}
        </h2>

        <div className="mt-auto pt-4 flex flex-wrap items-end justify-between gap-2">
          <p className="text-xl font-black tracking-tight text-slate-900">
            {formatearPrecio(precio)}
          </p>
          <StockBadge stock={stock} />
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
