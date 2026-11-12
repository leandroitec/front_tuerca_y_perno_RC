import type { Metadata } from "next";
import AdminShell from "@/components/layout/AdminShell";

export const metadata: Metadata = {
  title: "Panel de Administración | Tuerca y Perno RC",
  description: "Gestión interna de productos, ventas y catálogo de Tuerca y Perno RC.",
};

/**
 * Layout anidado de /admin/*.
 * Se renderiza dentro del RootLayout (Navbar + footer) y envuelve todas las
 * páginas del panel con el Sidebar de navegación y la validación de acceso.
 */
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminShell>{children}</AdminShell>;
}
