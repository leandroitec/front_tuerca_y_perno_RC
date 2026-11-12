import { UserRole } from "@/types/auth";

export interface RoleBadge {
  text: string;
  className: string;
}

/**
 * Devuelve la etiqueta legible y los estilos Tailwind del badge de cada rol.
 * Compartido entre el Navbar público y el Sidebar del panel administrativo.
 */
export function getRoleBadge(role: UserRole): RoleBadge {
  switch (role) {
    case "ADMIN":
      return {
        text: "Administrador",
        className: "bg-purple-100 text-purple-800 border-purple-200",
      };
    case "VENDEDOR":
      return {
        text: "Ventas",
        className: "bg-emerald-100 text-emerald-800 border-emerald-200",
      };
    case "DEPOSITO":
      return {
        text: "Depósito / Corralón",
        className: "bg-amber-100 text-amber-800 border-amber-200",
      };
    default:
      return {
        text: role,
        className: "bg-slate-100 text-slate-800 border-slate-200",
      };
  }
}
