import React, { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { StockBadge, formatearPrecio } from "@/components/ui/ProductCard";
import type { ProductoDetalle } from "@/types/producto";
import StockManager from "./StockManager";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface ProductoPageProps {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/productos/{id}/
 * Envuelto en cache() para que generateMetadata y la página compartan una sola petición.
 * Devuelve null si el id no es válido o el producto no existe (404).
 */
const obtenerProducto = cache(async (id: string): Promise<ProductoDetalle | null> => {
  if (!/^\d+$/.test(id)) return null;

  const respuesta = await fetch(`${API_BASE_URL}/api/productos/${id}/`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (respuesta.status === 404) return null;
  if (!respuesta.ok) {
    throw new Error(`No se pudo obtener el producto #${id} (HTTP ${respuesta.status}).`);
  }

  return (await respuesta.json()) as ProductoDetalle;
});

export async function generateMetadata({ params }: ProductoPageProps): Promise<Metadata> {
  const { id } = await params;
  const producto = await obtenerProducto(id).catch(() => null);

  if (!producto) {
    return { title: "Producto no encontrado | Tuerca y Perno RC" };
  }

  const titulo = `${producto.nombre} - ${typeof producto.marca === "string" ? producto.marca : producto.marca.nombre} | Tuerca y Perno RC`;
  const descripcion =
    producto.descripcion?.trim().slice(0, 160) ||
    `${producto.nombre} de ${typeof producto.marca === "string" ? producto.marca : producto.marca.nombre} en la categoría ${typeof producto.categoria === "string" ? producto.categoria : producto.categoria.nombre}. Consultá precio y stock en Tuerca y Perno RC.`;

  return {
    title: titulo,
    description: descripcion,
    openGraph: { title: titulo, description: descripcion, type: "website" },
  };
}

export default async function ProductoPage({ params }: ProductoPageProps) {
  const { id: productoIdParam } = await params;
  const producto = await obtenerProducto(productoIdParam);

  if (!producto) {
    notFound();
  }

  const { id, nombre, marca, categoria, precio, stock, descripcion } = producto;

  const nombreMarca =
    typeof marca === "string" ? marca : marca.nombre;

  const nombreCategoria =
    typeof categoria === "string" ? categoria : categoria.nombre;

  const fichaTecnica: { etiqueta: string; valor: React.ReactNode }[] = [
    { etiqueta: "Código", valor: <span className="font-mono">#{id}</span> },
    { etiqueta: "Marca", valor: nombreMarca },
    { etiqueta: "Categoría", valor: nombreCategoria },
    { etiqueta: "Precio unitario", valor: formatearPrecio(precio) },
    {
      etiqueta: "Stock disponible",
      valor: `${stock} ${stock === 1 ? "unidad" : "unidades"}`,
    },
  ];

  return (
    <div className="min-h-full bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Migas de pan */}
        <nav aria-label="Ruta de navegación" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            <li>
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-brand-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                Catálogo
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li>
              <Link
                href={`/catalogo?categoria=${encodeURIComponent(nombreCategoria)}`}
                className="hover:text-brand-600 transition-colors"
              >
                {nombreCategoria}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li className="font-medium text-slate-900 truncate max-w-[16rem]" aria-current="page">
              {nombre}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Ficha del producto */}
          <article className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div
              className="h-2 bg-[repeating-linear-gradient(-45deg,#facc15_0_10px,#1e293b_10px_20px)]"
              aria-hidden="true"
            />

            <div className="flex flex-col sm:flex-row">
              <div className="relative sm:w-56 h-48 sm:h-auto shrink-0 bg-slate-900 flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px] opacity-10"
                  aria-hidden="true"
                />
                <Package className="relative w-20 h-20 text-slate-600" strokeWidth={1.25} aria-hidden="true" />
              </div>

              <header className="flex-1 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-900 text-[11px] font-black uppercase tracking-wider">
                    {nombreCategoria}
                  </span>
                  <StockBadge stock={stock} />
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                  {nombreMarca}
                </p>
                <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  {nombre}
                </h1>
                <p className="mt-1 text-sm font-mono text-slate-400">Código #{id}</p>

                <p className="mt-6 text-3xl sm:text-4xl font-black tracking-tight text-brand-600">
                  {formatearPrecio(precio)}
                </p>
                <p className="mt-1 text-xs text-slate-500">Precio por unidad</p>
              </header>
            </div>

            <section className="border-t border-slate-200 p-6 sm:p-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">
                Descripción
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed whitespace-pre-line">
                {descripcion?.trim() || "Este producto todavía no tiene una descripción cargada."}
              </p>
            </section>

            <section className="border-t border-slate-200 p-6 sm:p-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">
                Ficha técnica
              </h2>
              <dl className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 overflow-hidden">
                {fichaTecnica.map(({ etiqueta, valor }) => (
                  <div
                    key={etiqueta}
                    className="grid grid-cols-2 gap-4 px-4 py-3 text-sm odd:bg-slate-50"
                  >
                    <dt className="font-semibold text-slate-500">{etiqueta}</dt>
                    <dd className="font-medium text-slate-900">{valor}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </article>

          {/* Gestión de stock (Client Component) */}
          <aside className="lg:sticky lg:top-24">
            <StockManager productoId={id} stockActual={stock} />
          </aside>
        </div>
      </div>
    </div>
  );
}
