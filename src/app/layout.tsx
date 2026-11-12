import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "@/app/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";

// Tipografía condensada de impacto para títulos (estilo maquinaria pesada / viga)
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Tipografía técnica legible para datos, tablas y párrafos
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tuerca y Perno RC | Ferretería Industrial y Corralón",
  description:
    "Soluciones pesadas en tornillería, herramientas, bulonería y materiales de construcción para particulares, talleres y obras.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`h-full ${inter.variable} ${oswald.variable}`}>
      <body className="flex flex-col min-h-screen bg-neutral-100 text-slate-900 font-sans antialiased selection:bg-primary selection:text-secondary">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-slate-950 text-slate-400 border-t-4 border-primary py-8 text-xs font-mono uppercase tracking-wider">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-primary border border-black inline-block"></span>
                <span className="font-bold text-white tracking-widest font-heading text-sm">
                  TUERCA Y PERNO RC
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-[11px] text-slate-400">DIVISIÓN INDUSTRIAL & CORRALÓN</span>
              </div>
              <p className="text-slate-500">
                © {new Date().getFullYear()} Tuerca y Perno RC. Materiales & Fijaciones Pesadas.
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
