"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingCart,
  Lock,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getRoleBadge } from "@/lib/roles";
import {
  ADMIN_NAV_ITEMS,
  AdminNavIcon,
  AdminNavItem,
  canAccessNavItem,
  isNavItemActive,
} from "@/lib/admin-navigation";

const ICONS: Record<AdminNavIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  catalogo: Store,
  productos: Package,
  ventas: ShoppingCart,
};

interface NavLinkProps {
  item: AdminNavItem;
  isActive: boolean;
  isAllowed: boolean;
  compact?: boolean;
}

/** Enlace del Sidebar con estados activo / bloqueado por rol. */
function SidebarLink({ item, isActive, isAllowed, compact = false }: NavLinkProps) {
  const Icon = ICONS[item.icon];

  if (!isAllowed) {
    return (
      <span
        aria-disabled="true"
        title="Tu rol no tiene acceso a esta sección"
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-500 cursor-not-allowed select-none ${
          compact ? "shrink-0 border border-slate-800" : ""
        }`}
      >
        <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-semibold truncate">{item.label}</span>
          {!compact && (
            <span className="block text-[11px] font-medium">Sin acceso</span>
          )}
        </span>
        <Lock className="w-4 h-4 shrink-0" aria-label="Acceso restringido" />
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
        compact ? "shrink-0 border" : ""
      } ${
        isActive
          ? "bg-brand-500 text-white shadow-sm border-brand-500"
          : "text-slate-300 hover:bg-slate-800 hover:text-white border-slate-800"
      }`}
    >
      <Icon
        className={`w-5 h-5 shrink-0 ${
          isActive ? "text-white" : "text-slate-400 group-hover:text-brand-400"
        }`}
        aria-hidden="true"
      />
      <span className="min-w-0">
        <span className="block text-sm font-semibold truncate">{item.label}</span>
        {!compact && (
          <span
            className={`block text-[11px] font-medium ${
              isActive ? "text-brand-100" : "text-slate-500"
            }`}
          >
            {item.description}
          </span>
        )}
      </span>
    </Link>
  );
}

/**
 * Barra lateral de navegación del panel administrativo.
 * Muestra el usuario autenticado, su rol y los módulos habilitados para él.
 * En pantallas chicas se transforma en una barra horizontal desplazable.
 */
export default function AdminSidebar() {
  const pathname = usePathname() ?? "";
  const { user, logout } = useAuth();

  if (!user) return null;

  const badge = getRoleBadge(user.role);
  const items = ADMIN_NAV_ITEMS.map((item) => ({
    item,
    isActive: isNavItemActive(pathname, item),
    isAllowed: canAccessNavItem(user.role, item),
  }));

  return (
    <>
      {/* Navegación compacta para mobile / tablet */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800">
        <div className="flex items-center justify-between gap-3 px-4 pt-3">
          <p className="text-xs text-slate-400 truncate">
            Sesión: <strong className="text-white">{user.username}</strong>
          </p>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badge.className}`}
          >
            {badge.text}
          </span>
        </div>
        <nav
          aria-label="Navegación del panel"
          className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map(({ item, isActive, isAllowed }) => (
            <SidebarLink
              key={item.href}
              item={item}
              isActive={isActive}
              isAllowed={isAllowed}
              compact
            />
          ))}
        </nav>
      </div>

      {/* Sidebar para escritorio */}
      <aside className="hidden lg:flex lg:flex-col w-72 shrink-0 bg-slate-900 border-r border-slate-800 sticky top-16 h-[calc(100vh-4rem)]">
        {/* Tarjeta de usuario autenticado */}
        <div className="p-5 border-b border-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Sesión activa
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full bg-brand-500 flex items-center justify-center text-lg font-black text-white uppercase"
              aria-hidden="true"
            >
              {user.username.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{user.username}</p>
              <span
                className={`inline-block mt-1 text-[11px] text-white font-bold px-2 py-0.5 rounded-full border ${badge.className}`}
              >
                {badge.text}
              </span>
            </div>
          </div>
        </div>

        {/* Enlaces de navegación */}
        <nav aria-label="Navegación del panel" className="flex-1 overflow-y-auto p-3">
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Módulos
          </p>
          <ul className="space-y-1">
            {items.map(({ item, isActive, isAllowed }) => (
              <li key={item.href}>
                <SidebarLink item={item} isActive={isActive} isAllowed={isAllowed} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Cierre de sesión */}
        <div className="p-3 border-t border-slate-800">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-red-600/90 transition-colors"
          >
            <LogOut className="w-5 h-5" aria-hidden="true" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
