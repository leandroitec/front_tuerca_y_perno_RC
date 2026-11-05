"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ProductForm } from "@/components/forms/ProductForm";
import { createProducto } from "@/lib/services/producto-service";
import { ProductoFormValues } from "@/lib/validations/producto";

export default function NuevoProductoPage() {
  const { token } = useAuth();

  const handleSubmit = async (values: ProductoFormValues): Promise<Response> => {
    if (!token) {
      // Devolver una Response sintética de 401 para que el form lo maneje
      return new Response(
        JSON.stringify({ non_field_errors: ["No estás autenticado. Por favor, iniciá sesión."] }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    return createProducto(values, token);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Encabezado ────────────────────────────────────────────────────── */}
      <div className="mb-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
          <Link href="/admin" className="hover:text-brand-500 transition-colors">
            Panel Admin
          </Link>
          <span>/</span>
          <Link href="/admin/productos" className="hover:text-brand-500 transition-colors">
            Productos
          </Link>
          <span>/</span>
          <span className="text-slate-600 font-medium">Nuevo</span>
        </nav>

        <div className="flex items-center gap-3 mb-1">
          {/* Icono de caja */}
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Nuevo Producto
            </h1>
            <p className="text-slate-500 text-sm">
              Completá los campos para agregar un producto al catálogo.
            </p>
          </div>
        </div>
      </div>

      {/* ── Tarjeta contenedora del formulario ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <ProductForm
          mode="create"
          onSubmitService={handleSubmit}
          successRedirectPath="/admin/productos"
        />
      </div>
    </div>
  );
}
