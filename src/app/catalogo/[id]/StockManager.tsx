"use client";

import React, { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, LogIn, Minus, Plus, Warehouse } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import type { AccionStock, ActualizarStockPayload } from "@/types/producto";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/** Este componente solo permite sumar o restar unidades */
type AccionEditable = Extract<AccionStock, "sumar" | "restar">;

const ACCIONES: { valor: AccionEditable; etiqueta: string; Icono: typeof Plus }[] = [
  { valor: "sumar", etiqueta: "Sumar", Icono: Plus },
  { valor: "restar", etiqueta: "Restar", Icono: Minus },
];

interface StockManagerProps {
  productoId: number;
  stockActual: number;
}

/** Arma un mensaje legible a partir de la respuesta de error de DRF */
async function obtenerMensajeError(respuesta: Response): Promise<string> {
  if (respuesta.status === 401) {
    return "Tu sesión expiró o no es válida. Iniciá sesión nuevamente.";
  }
  if (respuesta.status === 403) {
    return "No tenés permisos para modificar el stock de este producto.";
  }

  const data: unknown = await respuesta.json().catch(() => null);
  if (data && typeof data === "object") {
    const cuerpo = data as Record<string, unknown>;
    if (typeof cuerpo.detail === "string") return cuerpo.detail;
    if (typeof cuerpo.error === "string") return cuerpo.error;

    // Errores de validación de DRF: { "cantidad": ["Mensaje..."] }
    const primerMensaje = Object.values(cuerpo)
      .flat()
      .find((valor): valor is string => typeof valor === "string");
    if (primerMensaje) return primerMensaje;
  }

  if (respuesta.status === 404) return "El producto ya no existe.";
  return `No se pudo actualizar el stock (HTTP ${respuesta.status}).`;
}

export function StockManager({ productoId, stockActual }: StockManagerProps) {
  const router = useRouter();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();

  const [accion, setAccion] = useState<AccionEditable>("sumar");
  const [cantidad, setCantidad] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [errorCantidad, setErrorCantidad] = useState<string | null>(null);
  const [errorApi, setErrorApi] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const cantidadNumerica = Number(cantidad);
  const cantidadValida = Number.isInteger(cantidadNumerica) && cantidadNumerica > 0;
  const stockResultante = cantidadValida
    ? accion === "sumar"
      ? stockActual + cantidadNumerica
      : stockActual - cantidadNumerica
    : null;

  const limpiarMensajes = () => {
    setErrorCantidad(null);
    setErrorApi(null);
    setMensajeExito(null);
  };

  const handleCantidadChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCantidad(event.target.value);
    limpiarMensajes();
  };

  const handleAccionChange = (nuevaAccion: AccionEditable) => {
    setAccion(nuevaAccion);
    limpiarMensajes();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    limpiarMensajes();

    if (!cantidadValida) {
      setErrorCantidad("Ingresá una cantidad entera mayor a 0.");
      return;
    }
    if (accion === "restar" && cantidadNumerica > stockActual) {
      setErrorCantidad(`No podés restar más de ${stockActual} unidades (stock actual).`);
      return;
    }
    if (!token) {
      setErrorApi("Tu sesión no es válida. Iniciá sesión nuevamente.");
      return;
    }

    const payload: ActualizarStockPayload = { accion, cantidad: cantidadNumerica };
    setEnviando(true);

    try {
      const respuesta = await fetch(
        `${API_BASE_URL}/api/productos/${productoId}/actualizar-stock/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!respuesta.ok) {
        setErrorApi(await obtenerMensajeError(respuesta));
        return;
      }

      setMensajeExito(
        `Listo: se ${accion === "sumar" ? "sumaron" : "restaron"} ${cantidadNumerica} ${
          cantidadNumerica === 1 ? "unidad" : "unidades"
        }.`
      );
      setCantidad("");
      // Vuelve a renderizar el Server Component para mostrar el stock actualizado
      router.refresh();
    } catch {
      setErrorApi("No se pudo conectar con el servidor. Verificá tu conexión e intentá de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section
      aria-labelledby="stock-manager-titulo"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <header className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white">
        <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center">
          <Warehouse className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h2 id="stock-manager-titulo" className="text-sm font-black uppercase tracking-wider">
            Gestión de stock
          </h2>
          <p className="text-xs text-slate-400">Uso interno · Depósito</p>
        </div>
      </header>

      <div className="p-6">
        <div className="flex items-baseline justify-between pb-4 mb-5 border-b border-dashed border-slate-200">
          <span className="text-sm font-semibold text-slate-500">Stock actual</span>
          <span className="text-3xl font-black text-slate-900">
            {stockActual}
            <span className="ml-1 text-sm font-semibold text-slate-500">u.</span>
          </span>
        </div>

        {authLoading ? (
          <div className="space-y-3 animate-pulse" aria-hidden="true">
            <div className="h-10 rounded-lg bg-slate-200" />
            <div className="h-10 rounded-lg bg-slate-200" />
            <div className="h-10 rounded-lg bg-slate-300" />
          </div>
        ) : !isAuthenticated ? (
          <div className="text-center">
            <p className="text-sm text-slate-600">
              Para modificar el stock tenés que iniciar sesión con un usuario del sistema.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors"
            >
              <LogIn className="w-4 h-4" aria-hidden="true" />
              Iniciar sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-slate-700">Acción</legend>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100">
                {ACCIONES.map(({ valor, etiqueta, Icono }) => {
                  const seleccionada = accion === valor;
                  return (
                    <button
                      key={valor}
                      type="button"
                      onClick={() => handleAccionChange(valor)}
                      aria-pressed={seleccionada}
                      disabled={enviando}
                      className={`inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-bold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed ${
                        seleccionada
                          ? valor === "sumar"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-red-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-white"
                      }`}
                    >
                      <Icono className="w-4 h-4" aria-hidden="true" />
                      {etiqueta}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <InputField
              id="stock-cantidad"
              name="cantidad"
              label="Cantidad"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              placeholder="Ej. 5"
              value={cantidad}
              onChange={handleCantidadChange}
              disabled={enviando}
              error={errorCantidad ?? undefined}
              helperText={
                stockResultante !== null
                  ? `Stock resultante: ${stockResultante} unidades`
                  : undefined
              }
            />

            <Button type="submit" fullWidth isLoading={enviando}>
              {accion === "sumar" ? "Sumar al stock" : "Restar del stock"}
            </Button>

            {errorApi && (
              <div
                role="alert"
                className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700"
              >
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{errorApi}</span>
              </div>
            )}

            {mensajeExito && (
              <div
                role="status"
                className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700"
              >
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{mensajeExito}</span>
              </div>
            )}
          </form>
        )}
      </div>
    </section>
  );
}

export default StockManager;
