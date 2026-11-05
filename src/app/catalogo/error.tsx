"use client";

import React, { useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, RotateCcw } from "lucide-react";
import Button from "@/components/ui/Button";

interface CatalogoErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CatalogoError({ error, reset }: CatalogoErrorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    console.error("[Catálogo] Error al cargar la sección:", error);
  }, [error]);

  // router.refresh() vuelve a pedir los datos al servidor y reset() re-renderiza el segmento
  const reintentar = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-slate-100">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div
          className="h-2 bg-[repeating-linear-gradient(-45deg,#facc15_0_10px,#1e293b_10px_20px)]"
          aria-hidden="true"
        />

        <div className="p-8 text-center" role="alert">
          <div className="mx-auto w-14 h-14 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7" aria-hidden="true" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            No pudimos cargar el catálogo
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Hubo un problema al comunicarnos con el servidor de productos. Revisá tu
            conexión e intentá nuevamente en unos segundos.
          </p>

          {process.env.NODE_ENV === "development" && error.message && (
            <p className="mt-4 px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 break-words">
              {error.message}
            </p>
          )}
          {error.digest && (
            <p className="mt-2 text-[11px] font-mono text-slate-400">
              Código de error: {error.digest}
            </p>
          )}

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={reintentar} isLoading={isPending} size="md">
              <RotateCcw className="inline-block w-4 h-4 mr-2 align-text-bottom" aria-hidden="true" />
              Intentar de nuevo
            </Button>
            <Link
              href="/"
              className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
