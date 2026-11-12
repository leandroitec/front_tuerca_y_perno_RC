import React from "react";
import Link from "next/link";
import { PackageX, ArrowLeft } from "lucide-react";

export default function CatalogoNotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 shadow-sm">
          <PackageX className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Producto no encontrado
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          El artículo que estás buscando no existe, fue dado de baja del catálogo o el código ingresado es incorrecto.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
