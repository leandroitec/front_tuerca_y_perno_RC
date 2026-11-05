"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search } from "lucide-react";

/**
 * Categorías disponibles en el filtro.
 * El contrato de la API no expone un endpoint de categorías, por eso se definen acá
 * y se pueden reemplazar desde afuera con la prop `categorias`.
 */
const CATEGORIAS_POR_DEFECTO: readonly string[] = [
  "Herramientas",
  "Sanitarios",
  "Bulonería",
  "Electricidad",
  "Pinturería",
  "Construcción",
];

/**
 * Custom hook de debounce: devuelve una función que solo ejecuta `callback`
 * cuando pasaron `demoraMs` milisegundos sin nuevas llamadas.
 */
function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  demoraMs: number
) {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Siempre usar la versión más reciente del callback (con los searchParams actuales)
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancelar = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Limpia el timer pendiente al desmontar el componente
  useEffect(() => cancelar, [cancelar]);

  const ejecutar = useCallback(
    (...args: Args) => {
      cancelar();
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        callbackRef.current(...args);
      }, demoraMs);
    },
    [cancelar, demoraMs]
  );

  const estaPendiente = useCallback(() => timerRef.current !== null, []);

  return { ejecutar, cancelar, estaPendiente };
}

type FiltroCatalogo = "search" | "categoria";

export interface FilterBarProps {
  categorias?: readonly string[];
  /** Tiempo de espera del debounce de búsqueda (ms) */
  demoraMs?: number;
}

export function FilterBar({
  categorias = CATEGORIAS_POR_DEFECTO,
  demoraMs = 400,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const searchActual = searchParams.get("search") ?? "";
  const categoriaActual = searchParams.get("categoria") ?? "";

  const [texto, setTexto] = useState(searchActual);

  /** Actualiza los searchParams de la URL y vuelve siempre a la página 1 */
  const actualizarUrl = useCallback(
    (cambios: Partial<Record<FiltroCatalogo, string>>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [clave, valor] of Object.entries(cambios)) {
        if (valor) {
          params.set(clave, valor);
        } else {
          params.delete(clave);
        }
      }
      params.delete("page");

      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  const {
    ejecutar: buscarConDebounce,
    cancelar: cancelarBusqueda,
    estaPendiente,
  } = useDebouncedCallback((termino: string) => {
    if (termino !== searchActual) {
      actualizarUrl({ search: termino });
    }
  }, demoraMs);

  // Si la URL cambia desde afuera (botón "atrás", link "Limpiar filtros"),
  // sincronizar el input, salvo que el usuario esté tipeando.
  useEffect(() => {
    if (isPending || estaPendiente()) return;
    setTexto((actual) => (actual.trim() === searchActual ? actual : searchActual));
  }, [searchActual, isPending, estaPendiente]);

  const handleTextoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const valor = event.target.value;
    setTexto(valor);
    buscarConDebounce(valor.trim());
  };

  // Enter: buscar inmediatamente sin esperar el debounce
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    cancelarBusqueda();
    const termino = texto.trim();
    if (termino !== searchActual) {
      actualizarUrl({ search: termino });
    }
  };

  const handleCategoriaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    cancelarBusqueda();
    actualizarUrl({ categoria: event.target.value, search: texto.trim() });
  };

  // Si la URL trae una categoría que no está en la lista, igual se muestra como opción
  const opcionesCategoria =
    categoriaActual && !categorias.includes(categoriaActual)
      ? [...categorias, categoriaActual]
      : categorias;

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm"
    >
      <div className="relative flex-1">
        <label htmlFor="catalogo-search" className="sr-only">
          Buscar productos
        </label>
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          id="catalogo-search"
          type="search"
          value={texto}
          onChange={handleTextoChange}
          placeholder="Buscar productos (ej. taladro, caño, tornillo)..."
          autoComplete="off"
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
        {isPending && (
          <Loader2
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500 animate-spin"
            aria-label="Buscando"
          />
        )}
      </div>

      <div className="sm:w-60">
        <label htmlFor="catalogo-categoria" className="sr-only">
          Filtrar por categoría
        </label>
        <select
          id="catalogo-categoria"
          value={categoriaActual}
          onChange={handleCategoriaChange}
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 outline-none cursor-pointer transition-all duration-150 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        >
          <option value="">Todas las categorías</option>
          {opcionesCategoria.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}

export default FilterBar;
