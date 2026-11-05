import React from "react";

const CANTIDAD_TARJETAS = 8;

/** Esqueleto de una ProductCard (misma estructura y alturas) */
function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="h-1.5 bg-slate-300" />
      <div className="h-32 bg-slate-200" />
      <div className="flex flex-col flex-1 p-5">
        <div className="h-3 w-16 rounded bg-slate-200" />
        <div className="mt-2.5 h-4 w-full rounded bg-slate-200" />
        <div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />
        <div className="mt-6 flex items-end justify-between gap-2">
          <div className="h-6 w-28 rounded bg-slate-300" />
          <div className="h-6 w-20 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export default function CatalogoLoading() {
  return (
    <div className="min-h-full bg-slate-100" aria-busy="true">
      <span className="sr-only" role="status">
        Cargando catálogo de productos...
      </span>

      <div className="animate-pulse" aria-hidden="true">
        {/* Encabezado */}
        <section className="bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="h-3 w-24 rounded bg-slate-700" />
            <div className="mt-3 h-9 w-72 max-w-full rounded bg-slate-700" />
            <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-800" />
          </div>
          <div className="h-1.5 bg-slate-700" />
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Barra de filtros */}
          <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex-1 h-10 rounded-lg bg-slate-200" />
            <div className="sm:w-60 h-10 rounded-lg bg-slate-200" />
          </div>

          {/* Contador de resultados */}
          <div className="h-4 w-48 rounded bg-slate-200" />

          {/* Grilla de tarjetas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: CANTIDAD_TARJETAS }, (_, indice) => (
              <ProductCardSkeleton key={indice} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
