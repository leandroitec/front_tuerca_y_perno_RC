"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { ProductoDetalle } from "@/types/producto";
import { fetchProductoById, updateProducto, USE_PRODUCT_MOCKS } from "@/lib/services/producto-service";
import { ProductForm } from "@/components/forms/ProductForm";
import { ProductoFormValues } from "@/lib/validations/producto";

export default function EditarProductoPage() {
  const { token, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const [producto, setProducto] = useState<ProductoDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Redirigir si no autenticado
  useEffect(() => {
    if (
      !USE_PRODUCT_MOCKS &&
      !isAuthLoading &&
      !isAuthenticated
    ) {
      router.replace("/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  // Cargar datos actuales del producto
  useEffect(() => {
    if ((!token && !USE_PRODUCT_MOCKS) || !id) return;

    const load = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const data = await fetchProductoById(id, token ?? "");
        setProducto(data);
      } catch (err) {
        setFetchError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar el producto."
        );
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id, token]);

  /** Adaptador del service para el ProductForm */
  const handleSubmit = async (values: ProductoFormValues): Promise<Response> => {
    if (!token && !USE_PRODUCT_MOCKS) {
      return new Response(
        JSON.stringify({
          non_field_errors: [
            "No estás autenticado. Por favor, iniciá sesión.",
          ],
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    return updateProducto(id, values, token ?? "");
  };

  /**
   * Mapea el ProductoDetalle (con campos numéricos del backend) a los valores
   * del formulario (todos string, ya que los inputs HTML trabajan con string).
   */
  const toFormValues = (p: ProductoDetalle): Partial<ProductoFormValues> => ({
    nombre: p.nombre,
    precio: String(parseFloat(p.precio)),
    stock: String(p.stock),
    categoria_id: p.categoria_id
      ? String(p.categoria_id)
      : "",
    marca_id: p.marca_id
      ? String(p.marca_id)
      : "",
    descripcion: p.descripcion ?? "",
  });

  // ── Estado: cargando autenticación ───────────────────────────────────────
  if (isAuthLoading || isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-10 w-10 text-brand-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-500 text-sm font-medium">Cargando producto...</p>
        </div>
      </div>
    );
  }

  // ── Estado: error al cargar ──────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Error al cargar el producto</h2>
          <p className="text-sm text-slate-600 mb-6">{fetchError}</p>
          <Link
            href="/admin/productos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            ← Volver al listado
          </Link>
        </div>
      </div>
    );
  }

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
          <span className="text-slate-600 font-medium truncate max-w-[180px]">
            Editar: {producto?.nombre ?? `#${id}`}
          </span>
        </nav>

        <div className="flex items-center gap-3 mb-1">
          {/* Icono de lápiz */}
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Editar Producto
            </h1>
            <p className="text-slate-500 text-sm">
              Modificá los datos del producto{" "}
              <strong className="text-slate-700">
                {producto?.nombre ?? `#${id}`}
              </strong>
              .
            </p>
          </div>
        </div>
      </div>

      {/* ── Tarjeta contenedora del formulario ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {producto && (
          <ProductForm
            mode="edit"
            productoId={id}
            defaultValues={toFormValues(producto)}
            onSubmitService={handleSubmit}
            successRedirectPath="/admin/productos"
          />
        )}
      </div>
    </div>
  );
}
