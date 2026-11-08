"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

export interface Column<T> {
  /** Texto de la cabecera */
  header: string;
  /** Clave del objeto o función render personalizada */
  accessor: keyof T | ((row: T) => React.ReactNode);
  /** Clases Tailwind extra para la celda */
  className?: string;
}

export interface DataTableProps<T extends { id: number | string }> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

/**
 * DataTable — Componente genérico reutilizable para mostrar tablas de datos.
 *
 * Uso: pasar `columns` con definición de cabeceras y `data` con los registros.
 * Los botones de Editar/Eliminar se muestran si se pasan `onEdit`/`onDelete`.
 */
export function DataTable<T extends { id: number | string }>({
  columns,
  data,
  onEdit,
  onDelete,
  isLoading = false,
  emptyMessage = "No hay datos para mostrar.",
}: DataTableProps<T>) {
  const hasActions = !!onEdit || !!onDelete;

  const renderCell = (row: T, col: Column<T>): React.ReactNode => {
    if (typeof col.accessor === "function") {
      return col.accessor(row);
    }
    const value = row[col.accessor];
    return value as React.ReactNode;
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
      <table className="w-full text-sm text-left text-slate-700">
        {/* ── Cabecera ── */}
        <thead className="bg-slate-800 text-slate-100 uppercase text-xs tracking-wider">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                scope="col"
                className={`px-5 py-3.5 font-semibold whitespace-nowrap ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
            {hasActions && (
              <th
                scope="col"
                className="px-5 py-3.5 font-semibold text-right whitespace-nowrap"
              >
                Acciones
              </th>
            )}
          </tr>
        </thead>

        {/* ── Cuerpo ── */}
        <tbody className="divide-y divide-slate-100">
          {/* Estado de carga */}
          {isLoading && (
            <tr>
              <td
                colSpan={columns.length + (hasActions ? 1 : 0)}
                className="px-5 py-12 text-center"
              >
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <svg
                    className="animate-spin h-8 w-8 text-brand-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Cargando datos...</span>
                </div>
              </td>
            </tr>
          )}

          {/* Sin datos */}
          {!isLoading && data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (hasActions ? 1 : 0)}
                className="px-5 py-12 text-center text-slate-400"
              >
                <div className="flex flex-col items-center gap-2">
                  <svg
                    className="h-10 w-10 text-slate-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <span className="text-sm font-medium">{emptyMessage}</span>
                </div>
              </td>
            </tr>
          )}

          {/* Filas de datos */}
          {!isLoading &&
            data.map((row, rowIndex) => (
              <tr
                key={row.id}
                className={`transition-colors hover:bg-brand-50/50 ${
                  rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                }`}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-5 py-3.5 whitespace-nowrap ${col.className ?? ""}`}
                  >
                    {renderCell(row, col)}
                  </td>
                ))}

                {hasActions && (
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(row)}
                          aria-label={`Editar registro ${row.id}`}
                          className="text-slate-700 border-slate-300 hover:border-brand-500 hover:text-brand-600"
                        >
                          {/* Icono lápiz */}
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Editar
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onDelete(row)}
                          aria-label={`Eliminar registro ${row.id}`}
                        >
                          {/* Icono basura */}
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
