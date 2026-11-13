"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { Producto } from "@/types/producto";
import { getTodosLosProductos, deleteProducto } from "@/lib/services/producto-service";
import { DataTable, Column } from "@/components/ui/DataTable";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

export default function ProductosAdminPage() {
  const { token, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Estado del modal de confirmación
  const [modalOpen, setModalOpen] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState<Producto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  /** Carga la lista de productos desde la API real de Django */
  const loadProductos = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setFetchError(null);
    try {
      // Trae todas las páginas de la API (DRF pagina de a 10)
      setProductos(await getTodosLosProductos(token));
    } catch (err) {
      setFetchError(
        err instanceof Error
          ? err.message
          : "Error desconocido al cargar productos."
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Redirigir si no autenticado
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProductos();
    }
  }, [isAuthenticated, loadProductos]);

  /** Handler: abrir modal de confirmación */
  const handleDeleteClick = (producto: Producto) => {
    setProductoToDelete(producto);
    setDeleteError(null);
    setModalOpen(true);
  };

  /** Handler: confirmar la eliminación */
  const handleConfirmDelete = async () => {
    if (!productoToDelete || !token) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await deleteProducto(
        productoToDelete.id,
        token ?? ""
      );
      if (res.ok || res.status === 204) {
        setModalOpen(false);
        setProductoToDelete(null);
        // Recargar la lista
        await loadProductos();
      } else {
        setDeleteError(`No se pudo eliminar el producto (error ${res.status}).`);
      }
    } catch {
      setDeleteError("Error de red al intentar eliminar. Intentá de nuevo.");
    } finally {
      setIsDeleting(false);
    }
  };

  /** Handler: ir a editar */
  const handleEditClick = (producto: Producto) => {
    router.push(`/admin/productos/editar/${producto.id}`);
  };

  // Formato de precio ARS (compartido en src/lib/utils.ts)
  const formatPrecio = (precio: string | number) => formatCurrency(precio);

  // ── Columnas de la tabla ─────────────────────────────────────────────────
  const columns: Column<Producto>[] = [
    {
      header: "ID",
      accessor: "id",
      className: "text-slate-500 font-mono text-xs w-14",
    },
    {
      header: "Nombre",
      accessor: (row) => (
        <span className="font-semibold text-slate-900">{row.nombre}</span>
      ),
    },
    {
      header: "Categoría",
      accessor: (row) =>
        typeof row.categoria === "string"
          ? row.categoria
          : row.categoria.nombre,
      className: "text-slate-600",
    },
    {
      header: "Marca",
      accessor: (row) =>
        typeof row.marca === "string"
          ? row.marca
          : row.marca.nombre,
      className: "text-slate-600",
    },
    {
      header: "Precio",
      accessor: (row) => (
        <span className="font-bold text-brand-600">{formatPrecio(row.precio)}</span>
      ),
      className: "text-right",
    },
    {
      header: "Stock",
      accessor: (row) => {
        const qty = row.stock;
        const color =
          qty === 0
            ? "bg-red-100 text-red-700"
            : qty <= 10
            ? "bg-amber-100 text-amber-700"
            : "bg-emerald-100 text-emerald-700";
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${color}`}
          >
            {qty === 0 ? "Sin stock" : `${qty} u.`}
          </span>
        );
      },
      className: "text-center",
    },
  ];

  // ── Render de carga de autenticación ────────────────────────────────────
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-slate-500 text-sm animate-pulse">Verificando sesión...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Encabezado de sección ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          {/* Breadcrumb */}
          <nav className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
            <Link href="/admin" className="hover:text-brand-500 transition-colors">
              Panel Admin
            </Link>
            <span>/</span>
            <span className="text-slate-600 font-medium">Productos</span>
          </nav>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Gestión de Productos
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Administrá el catálogo completo de productos de Tuerca y Perno RC.
          </p>
        </div>

        <Link href="/admin/productos/nuevo">
          <Button variant="primary" size="md">
            {/* Icono + */}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Producto
          </Button>
        </Link>
      </div>

      {/* ── Alerta de error de red/servidor ─────────────────────────────── */}
      {fetchError && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800"
        >
          <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <p className="font-semibold text-sm">Error al cargar productos</p>
            <p className="text-xs text-red-600 mt-0.5">{fetchError}</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadProductos}>
            Reintentar
          </Button>
        </div>
      )}

      {/* ── Error de eliminación (dentro del modal se muestra arriba de los botones) */}
      {deleteError && !modalOpen && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {deleteError}
        </div>
      )}

      {/* ── Contador de resultados ───────────────────────────────────────── */}
      {!isLoading && !fetchError && (
        <p className="text-sm text-slate-500 mb-4">
          {productos.length === 0
            ? "No hay productos cargados."
            : `Mostrando ${productos.length} producto${productos.length !== 1 ? "s" : ""}.`}
        </p>
      )}

      {/* ── Tabla de datos ───────────────────────────────────────────────── */}
      <DataTable<Producto>
        columns={columns}
        data={productos}
        isLoading={isLoading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        emptyMessage="No hay productos registrados. ¡Creá el primero!"
      />

      {/* ── Modal de confirmación de eliminación ─────────────────────────── */}
      <ConfirmModal
        isOpen={modalOpen}
        title="Eliminar Producto"
        message={
          productoToDelete
            ? `¿Estás seguro de que querés eliminar "${productoToDelete.nombre}"? Se perderán todos sus datos.`
            : "¿Estás seguro de que querés eliminar este producto?"
        }
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isDeleting) {
            setModalOpen(false);
            setProductoToDelete(null);
          }
        }}
      />
    </div>
  );
}