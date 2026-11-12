import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4 shadow-sm">
          <AlertCircle className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Página no encontrada (404)
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          La ruta que intentás visitar no existe o fue movida en Tuerca y Perno RC.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </Link>
          <Link
            href="/catalogo"
            className="inline-flex items-center px-5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
          >
            Ver Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
