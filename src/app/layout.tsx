import type { Metadata } from "next";
import "@/app/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Tuerca y Perno RC | Ferretería Industrial y Corralón",
  description:
    "Soluciones integrales en tornillería, herramientas, bulonería y materiales de construcción para particulares, talleres y obras.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 text-center text-xs">
            <div className="max-w-7xl mx-auto px-4">
              <p>
                © {new Date().getFullYear()} Tuerca y Perno RC. Ferretería & Corralón. Todos los derechos reservados.
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
