import { UserRole } from "@/types/auth";

/**
 * Configuración de navegación y control de acceso del panel administrativo.
 * Es lógica pura (sin React) para poder reutilizarla en el Sidebar, en el
 * layout y en los tests unitarios.
 */

export type AdminNavIcon = "dashboard" | "catalogo" | "productos" | "ventas";

export interface AdminNavItem {
  label: string;
  href: string;
  description: string;
  icon: AdminNavIcon;
  /** Roles habilitados para ingresar a la sección. */
  roles: readonly UserRole[];
  /** true: sólo se marca activo con coincidencia exacta de la ruta. */
  exact?: boolean;
}

const TODOS_LOS_ROLES: readonly UserRole[] = ["ADMIN", "VENDEDOR", "DEPOSITO"];

export const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  {
    label: "Panel de Control",
    href: "/admin",
    description: "Resumen general",
    icon: "dashboard",
    roles: TODOS_LOS_ROLES,
    exact: true,
  },
  {
    label: "Catálogo Público",
    href: "/catalogo",
    description: "Vista de clientes",
    icon: "catalogo",
    roles: TODOS_LOS_ROLES,
  },
  {
    label: "Gestión de Productos",
    href: "/admin/productos",
    description: "Alta, edición y stock",
    icon: "productos",
    roles: ["ADMIN", "DEPOSITO"],
  },
  {
    label: "Gestión de Ventas",
    href: "/admin/ventas",
    description: "Registro y historial",
    icon: "ventas",
    roles: ["ADMIN", "VENDEDOR"],
  },
];

/** Normaliza la ruta quitando la barra final (excepto en la raíz). */
function normalizePath(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

/** Indica si un ítem de navegación corresponde a la ruta actual. */
export function isNavItemActive(pathname: string, item: AdminNavItem): boolean {
  const current = normalizePath(pathname);
  const target = normalizePath(item.href);

  if (item.exact) {
    return current === target;
  }

  return current === target || current.startsWith(`${target}/`);
}

/** Indica si el rol puede ingresar al ítem de navegación. */
export function canAccessNavItem(
  role: UserRole | null | undefined,
  item: AdminNavItem
): boolean {
  return !!role && item.roles.includes(role);
}

/**
 * Indica si el rol puede ingresar a una ruta del panel.
 * Se evalúa la sección más específica que contiene la ruta; las rutas que no
 * pertenecen a ninguna sección configurada quedan habilitadas.
 */
export function canAccessRoute(
  role: UserRole | null | undefined,
  pathname: string
): boolean {
  if (!role) return false;

  const section = ADMIN_NAV_ITEMS.filter((item) =>
    isNavItemActive(pathname, { ...item, exact: false })
  ).sort((a, b) => b.href.length - a.href.length)[0];

  return section ? canAccessNavItem(role, section) : true;
}
