import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";
import FilterBar from "@/components/ui/FilterBar";
import ProductCard from "@/components/ui/ProductCard";
import type { ProductosQuery, ProductosResponse } from "@/types/producto";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const metadata: Metadata = {
  title: "Catálogo de Productos | Tuerca y Perno RC",
  description:
    "Herramientas, bulonería, sanitarios y materiales de construcción con stock actualizado en Tuerca y Perno RC.",
};

type SearchParams = Record<string, string | string[] | undefined>;

interface CatalogoPageProps {
  searchParams: Promise<SearchParams>;
}

type QueryCatalogo = ProductosQuery & { page: number };

function primerValor(valor: string | string[] | undefined): string | undefined {
  const texto = (Array.isArray(valor) ? valor[0] : valor)?.trim();
  return texto ? texto : undefined;
}

/** Normaliza los searchParams de la URL (page, categoria, search) */
function parsearQuery(searchParams: SearchParams): QueryCatalogo {
  const pagina = Number.parseInt(primerValor(searchParams.page) ?? "1", 10);

  return {
    page: Number.isInteger(pagina) && pagina > 0 ? pagina : 1,
    categoria: primerValor(searchParams.categoria),
    search: primerValor(searchParams.search),
  };
}

function construirParams(query: ProductosQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.page && query.page > 1) params.set("page", String(query.page));
  if (query.categoria) params.set("categoria", query.categoria);
  if (query.search) params.set("search", query.search);
  return params;
}

/** GET /api/productos/?page=&categoria=&search= */
async function obtenerProductos(query: QueryCatalogo): Promise<ProductosResponse> {
  const params = construirParams(query);
  params.set("page", String(query.page));

  const respuesta = await fetch(`${API_BASE_URL}/api/productos/?${params.toString()}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!respuesta.ok) {
    throw new Error(`No se pudo obtener el catálogo (HTTP ${respuesta.status}).`);
  }

  return (await respuesta.json()) as ProductosResponse;
}

function hrefPagina(query: QueryCatalogo, pagina: number): string {
  const qs = construirParams({ ...query, page: pagina }).toString();
  return qs ? `/catalogo?${qs}` : "/catalogo";
}

interface PaginacionProps {
  query: QueryCatalogo;
  hayAnterior: boolean;
  haySiguiente: boolean;
}

function Paginacion({ query, hayAnterior, haySiguiente }: PaginacionProps) {
  const base =
    "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors";
  const activo =
    "bg-slate-900 text-white hover:bg-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2";
  const inactivo = "bg-slate-200 text-slate-400 cursor-not-allowed";

  return (
    <nav aria-label="Paginación del catálogo" className="flex items-center justify-between gap-4 pt-2">
      {hayAnterior ? (
        <Link href={hrefPagina(query, query.page - 1)} className={`${base} ${activo}`} rel="prev">
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          Anterior
        </Link>
      ) : (
        <span className={`${base} ${inactivo}`} aria-disabled="true">
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          Anterior
        </span>
      )}

      <span className="text-sm font-medium text-slate-600">
        Página <strong className="text-slate-900">{query.page}</strong>
      </span>

      {haySiguiente ? (
        <Link href={hrefPagina(query, query.page + 1)} className={`${base} ${activo}`} rel="next">
          Siguiente
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      ) : (
        <span className={`${base} ${inactivo}`} aria-disabled="true">
          Siguiente
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const parametros = await searchParams;
  const query = parsearQuery(parametros);
  const { count, next, previous, results } = await obtenerProductos(query);
  const hayFiltros = Boolean(query.categoria || query.search);
  return (
    <div className="min-h-full bg-slate-100">
      {/* Encabezado de la sección */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px] opacity-10"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Catálogo
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-black tracking-tight">
            Productos y materiales
          </h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Herramientas, bulonería, sanitarios y materiales de obra con stock actualizado.
          </p>
        </div>
        <div
          className="h-1.5 bg-[repeating-linear-gradient(-45deg,#facc15_0_10px,#1e293b_10px_20px)]"
          aria-hidden="true"
        />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <FilterBar />

        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
          <p>
            <strong className="text-slate-900">{count}</strong>{" "}
            {count === 1 ? "producto encontrado" : "productos encontrados"}
            {query.categoria && (
              <>
                {" "}en <strong className="text-slate-900">{query.categoria}</strong>
              </>
            )}
            {query.search && (
              <>
                {" "}para &ldquo;<strong className="text-slate-900">{query.search}</strong>&rdquo;
              </>
            )}
          </p>
          {hayFiltros && (
            <Link
              href="/catalogo"
              className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Limpiar filtros
            </Link>
          )}
        </div>

        {results.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((producto) => (
              <li key={producto.id}>
                <ProductCard producto={producto} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="w-14 h-14 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <PackageSearch className="w-7 h-7" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">No encontramos productos</h2>
            <p className="mt-1 max-w-md text-sm text-slate-600">
              Probá con otro término de búsqueda o seleccioná una categoría distinta.
            </p>
            {hayFiltros && (
              <Link
                href="/catalogo"
                className="mt-5 inline-flex items-center px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors"
              >
                Ver todo el catálogo
              </Link>
            )}
          </div>
        )}

        {(previous || next) && (
          <Paginacion query={query} hayAnterior={Boolean(previous)} haySiguiente={Boolean(next)} />
        )}
      </div>
    </div>
  );
}
