"use client";

import React, { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";

export interface ConfirmModalProps {
  /** Controla si el modal está visible */
  isOpen: boolean;
  /** Título del modal (ej. "Eliminar producto") */
  title: string;
  /** Descripción o cuerpo del modal */
  message: string;
  /** Texto del botón de confirmación (default: "Confirmar") */
  confirmLabel?: string;
  /** Texto del botón de cancelar (default: "Cancelar") */
  cancelLabel?: string;
  /** Estado de carga del botón confirmar (ej. mientras llama a la API) */
  isConfirming?: boolean;
  /** Callback al confirmar la acción destructiva */
  onConfirm: () => void;
  /** Callback al cancelar o cerrar el modal */
  onCancel: () => void;
}

/**
 * ConfirmModal — Modal reutilizable para acciones destructivas.
 *
 * Incluye: overlay oscuro, foco atrapado (Escape para cerrar), botón
 * cancelar y botón destructivo rojo. Accesible con role="dialog" y aria-modal.
 */
export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  // Cerrar con Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isConfirming) {
        onCancel();
      }
    },
    [isConfirming, onCancel]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Bloquear scroll del body
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    /* Overlay con fade */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
    >
      {/* Fondo oscuro semitransparente */}
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
        onClick={!isConfirming ? onCancel : undefined}
        aria-hidden="true"
      />

      {/* Contenedor del modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Franja de color de advertencia en la parte superior */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 to-red-600" />

        <div className="p-6">
          {/* Icono de advertencia + título */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-11 h-11 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h2
                id="confirm-modal-title"
                className="text-lg font-bold text-slate-900 leading-tight"
              >
                {title}
              </h2>
              <p
                id="confirm-modal-desc"
                className="mt-1.5 text-sm text-slate-600 leading-relaxed"
              >
                {message}
              </p>
            </div>
          </div>

          {/* Nota de acción irreversible */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 mb-6">
            <svg
              className="w-4 h-4 text-red-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-medium text-red-700">
              Esta acción es irreversible y no se puede deshacer.
            </span>
          </div>

          {/* Botones */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={onCancel}
              disabled={isConfirming}
              className="sm:w-auto w-full"
            >
              {cancelLabel}
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={onConfirm}
              isLoading={isConfirming}
              className="sm:w-auto w-full"
            >
              {isConfirming ? "Eliminando..." : confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
