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
    texto: "EN STOCK",
    contenedor: "bg-emerald-300 text-slate-950 border-slate-900",
    punto: "bg-slate-950",
  },
  ULTIMAS_UNIDADES: {
    texto: "ÚLTIMAS UNIDADES",
    contenedor: "bg-primary text-slate-950 border-slate-900",
    punto: "bg-slate-950",
  },
  SIN_STOCK: {
    texto: "SIN STOCK",
    contenedor: "bg-red-600 text-white border-slate-900",
    punto: "bg-white",
  },
};

interface StockBadgeProps {
  stock: number;
  className?: string;
}

/** Etiqueta visual del estado de stock en bloque industrial (sin bordes redondeados) */
export function StockBadge({ stock, className = "" }: StockBadgeProps) {
  const estilo = ESTILOS_BADGE[obtenerEstadoStock(stock)];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none border-2 text-[10px] font-mono font-black uppercase tracking-wider whitespace-nowrap shadow-[2px_2px_0px_0px_#0f172a] ${estilo.contenedor} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-none ${estilo.punto}`} aria-hidden="true" />
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
      className="group flex flex-col h-full bg-white rounded-none border-2 border-slate-900 shadow-hard hover:shadow-hard-lg hover:-translate-y-1 transition-all duration-150 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      {/* Franja de advertencia industrial (Hazard stripes) */}
      <div
        className="h-2 bg-[repeating-linear-gradient(-45deg,#f59e0b_0_10px,#0f172a_10px_20px)] border-b-2 border-slate-900"
        aria-hidden="true"
      />

      {/* Cabecera visual del producto: chapa de acero maquinado oscuro */}
      <div className="relative h-36 bg-slate-900 flex items-center justify-center overflow-hidden border-b-2 border-slate-900">
        <div
          className="absolute inset-0 bg-[radial-gradient(#f59e0b_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-15"
          aria-hidden="true"
        />
        <Package
          className="relative w-14 h-14 text-slate-500 transition-transform duration-200 group-hover:scale-110 group-hover:text-primary"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        {/* Placa de Categoría remachada */}
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-none bg-primary text-secondary border border-slate-900 text-[10px] font-heading font-black uppercase tracking-wider shadow-[1px_1px_0px_0px_#000]">
          {nombreCategoria}
        </span>
        {/* Código SKU o ID técnico */}
        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-none bg-slate-950/80 text-slate-400 font-mono text-[9px] uppercase tracking-widest border border-slate-800">
          ID #{id}
        </span>
      </div>

      {/* Información técnica del producto */}
      <div className="flex flex-col flex-1 p-5 bg-white">
        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
          {nombreMarca}
        </p>
        <h2 className="mt-1 text-base font-heading font-bold uppercase leading-snug text-slate-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
          {nombre}
        </h2>

        {/* Zona de precio y stock */}
        <div className="mt-auto pt-4 flex flex-wrap items-baseline justify-between gap-2 border-t-2 border-dashed border-slate-200">
          <div>
            <span className="block text-[9px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
              PRECIO
            </span>
            <p className="text-xl font-heading font-black tracking-tight text-slate-950">
              {formatearPrecio(precio)}
            </p>
          </div>
          <StockBadge stock={stock} />
        </div>

        {/* Botón de acción mecánico tipo placa de acero */}
        <div className="mt-4 pt-2">
          <div className="w-full py-2 px-3 bg-slate-900 group-hover:bg-primary text-white group-hover:text-secondary border-2 border-slate-900 text-xs font-heading font-bold uppercase tracking-wider flex items-center justify-between transition-colors shadow-sm">
            <span>VER FICHA TÉCNICA</span>
            <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
