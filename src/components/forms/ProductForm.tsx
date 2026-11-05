"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  productoSchema,
  ProductoFormValues,
  DjangoFieldErrors,
} from "@/lib/validations/producto";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";

/**
 * Categorías y marcas dummy — En producción, estos se obtienen via API.
 * Reemplazar con un fetch real cuando los endpoints estén disponibles.
 */
const CATEGORIAS = [
  { id: 1, nombre: "Tornillería y Bulonería" },
  { id: 2, nombre: "Herramientas Manuales" },
  { id: 3, nombre: "Herramientas Eléctricas" },
  { id: 4, nombre: "Materiales de Construcción" },
  { id: 5, nombre: "Plomería" },
  { id: 6, nombre: "Electricidad" },
  { id: 7, nombre: "Adhesivos y Selladores" },
  { id: 8, nombre: "Corralón / Áridos" },
];

const MARCAS = [
  { id: 1, nombre: "Stanley" },
  { id: 2, nombre: "Bosch" },
  { id: 3, nombre: "Makita" },
  { id: 4, nombre: "Bahco" },
  { id: 5, nombre: "Tramontina" },
  { id: 6, nombre: "Sin Marca (Genérico)" },
];

export interface ProductFormProps {
  /** Modo del formulario */
  mode: "create" | "edit";
  /** ID del producto (solo en modo edit) */
  productoId?: string | number;
  /**
   * Valores iniciales del formulario.
   * Los numéricos vienen como string porque los inputs HTML siempre trabajan con string.
   * Se deben convertir antes de enviar al backend mediante el service.
   */
  defaultValues?: Partial<ProductoFormValues>;
  /** Función que llama a la API (create o update) y devuelve la Response nativa */
  onSubmitService: (values: ProductoFormValues) => Promise<Response>;
  /** Ruta a la que redirigir tras el éxito */
  successRedirectPath?: string;
}

/**
 * ProductForm — Formulario de alta/edición de Producto.
 *
 * Usa React Hook Form + Zod (strict mode).
 * Maneja errores del cliente (validación) y del servidor (HTTP 400 Django).
 */
export function ProductForm({
  mode,
  defaultValues,
  onSubmitService,
  successRedirectPath = "/admin/productos",
}: ProductFormProps) {
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState<DjangoFieldErrors | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProductoFormValues>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      nombre: "",
      precio: "",
      stock: "",
      categoria_id: "",
      marca_id: "",
      descripcion: "",
      ...defaultValues,
    },
  });

  const onSubmit = async (values: ProductoFormValues) => {
    setServerErrors(null);
    setGlobalSuccess(null);

    try {
      const response = await onSubmitService(values);

      // ── Éxito ──────────────────────────────────────────────────────────
      if (response.ok) {
        setGlobalSuccess(
          mode === "create"
            ? "¡Producto creado exitosamente!"
            : "¡Producto actualizado exitosamente!"
        );
        // Redirigir al listado tras breve pausa para que el usuario vea el mensaje
        setTimeout(() => router.push(successRedirectPath), 1200);
        return;
      }

      // ── Error HTTP 400 — Errores por campo del backend Django ──────────
      if (response.status === 400) {
        const errorBody: DjangoFieldErrors = await response.json();
        setServerErrors(errorBody);

        // Mapear errores de campo al estado de React Hook Form para mostralos inline
        const knownFields: (keyof ProductoFormValues)[] = [
          "nombre",
          "precio",
          "stock",
          "categoria_id",
          "marca_id",
          "descripcion",
        ];

        knownFields.forEach((field) => {
          if (errorBody[field]?.length) {
            setError(field, {
              type: "server",
              message: errorBody[field]![0],
            });
          }
        });
        return;
      }

      // ── Otros errores (401, 500, etc.) ──────────────────────────────────
      setServerErrors({
        non_field_errors: [
          `Error del servidor (código ${response.status}). Por favor, intentá de nuevo.`,
        ],
      });
    } catch {
      setServerErrors({
        non_field_errors: [
          "No se pudo conectar con el servidor. Verificá tu conexión e intentá de nuevo.",
        ],
      });
    }
  };

  const isCreateMode = mode === "create";
  const submitLabel = isCreateMode ? "Guardar Producto" : "Guardar Cambios";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
      aria-label={isCreateMode ? "Formulario nuevo producto" : "Formulario editar producto"}
    >
      {/* ── Banner de éxito ─────────────────────────────────────────────── */}
      {globalSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800"
        >
          <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm font-semibold">{globalSuccess}</p>
        </div>
      )}

      {/* ── Banner de errores globales del servidor (non_field_errors) ───── */}
      {serverErrors?.non_field_errors?.length && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-50 border border-red-300 text-red-800"
        >
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-sm font-bold mb-1">Error al guardar:</p>
            <ul className="text-sm list-disc list-inside space-y-0.5">
              {serverErrors.non_field_errors.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── Fila 1: Nombre ──────────────────────────────────────────────── */}
      <InputField
        label="Nombre del Producto *"
        id="nombre"
        placeholder="Ej: Tornillo hexagonal 1/2 × 2″ galvanizado"
        error={errors.nombre}
        disabled={isSubmitting}
        {...register("nombre")}
      />

      {/* ── Fila 2: Precio + Stock ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Precio (ARS) *"
          id="precio"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Ej: 1250.50"
          error={errors.precio}
          disabled={isSubmitting}
          helperText="Precio unitario de venta al público."
          {...register("precio")}
        />
        <InputField
          label="Stock *"
          id="stock"
          type="number"
          min="0"
          step="1"
          placeholder="Ej: 500"
          error={errors.stock}
          disabled={isSubmitting}
          helperText="Cantidad disponible en depósito (entero)."
          {...register("stock")}
        />
      </div>

      {/* ── Fila 3: Categoría + Marca ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Select Categoría */}
        <div className="flex flex-col w-full">
          <label
            htmlFor="categoria_id"
            className="mb-1.5 text-sm font-medium text-slate-700 select-none"
          >
            Categoría *
          </label>
          <select
            id="categoria_id"
            disabled={isSubmitting}
            aria-invalid={!!errors.categoria_id}
            aria-describedby={errors.categoria_id ? "categoria_id-error" : undefined}
            className={[
              "w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all duration-150 outline-none bg-white",
              "disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed",
              errors.categoria_id
                ? "border-red-500 bg-red-50/20 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-slate-300 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20",
            ].join(" ")}
            {...register("categoria_id")}
          >
            <option value="">— Seleccioná una categoría —</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.nombre}
              </option>
            ))}
          </select>
          {errors.categoria_id && (
            <p
              id="categoria_id-error"
              role="alert"
              className="mt-1.5 text-xs sm:text-sm font-medium text-red-600 flex items-center gap-1"
            >
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.categoria_id.message}
            </p>
          )}
        </div>

        {/* Select Marca */}
        <div className="flex flex-col w-full">
          <label
            htmlFor="marca_id"
            className="mb-1.5 text-sm font-medium text-slate-700 select-none"
          >
            Marca *
          </label>
          <select
            id="marca_id"
            disabled={isSubmitting}
            aria-invalid={!!errors.marca_id}
            aria-describedby={errors.marca_id ? "marca_id-error" : undefined}
            className={[
              "w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all duration-150 outline-none bg-white",
              "disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed",
              errors.marca_id
                ? "border-red-500 bg-red-50/20 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-slate-300 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20",
            ].join(" ")}
            {...register("marca_id")}
          >
            <option value="">— Seleccioná una marca —</option>
            {MARCAS.map((marca) => (
              <option key={marca.id} value={String(marca.id)}>
                {marca.nombre}
              </option>
            ))}
          </select>
          {errors.marca_id && (
            <p
              id="marca_id-error"
              role="alert"
              className="mt-1.5 text-xs sm:text-sm font-medium text-red-600 flex items-center gap-1"
            >
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.marca_id.message}
            </p>
          )}
        </div>
      </div>

      {/* ── Fila 4: Descripción ──────────────────────────────────────────── */}
      <div className="flex flex-col w-full">
        <label
          htmlFor="descripcion"
          className="mb-1.5 text-sm font-medium text-slate-700 select-none flex items-center justify-between"
        >
          <span>Descripción</span>
          <span className="text-xs text-slate-400 font-normal">Opcional</span>
        </label>
        <textarea
          id="descripcion"
          rows={3}
          placeholder="Descripción detallada del producto: material, dimensiones, aplicaciones..."
          disabled={isSubmitting}
          aria-invalid={!!errors.descripcion}
          aria-describedby={errors.descripcion ? "descripcion-error" : undefined}
          className={[
            "w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all duration-150 outline-none resize-none",
            "disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed",
            errors.descripcion
              ? "border-red-500 bg-red-50/20 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-slate-300 bg-white text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20",
          ].join(" ")}
          {...register("descripcion")}
        />
        {errors.descripcion && (
          <p
            id="descripcion-error"
            role="alert"
            className="mt-1.5 text-xs sm:text-sm font-medium text-red-600 flex items-center gap-1"
          >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.descripcion.message}
          </p>
        )}
        <p className="mt-1 text-xs text-slate-500">Máximo 500 caracteres.</p>
      </div>

      {/* ── Acciones del formulario ──────────────────────────────────────── */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="sm:w-auto w-full"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          className="sm:w-auto w-full"
        >
          {isSubmitting ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;
