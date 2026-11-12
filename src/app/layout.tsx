import type { Metadata } from "next";
import Link from "next/link";
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
          <footer className="bg-slate-950 text-slate-400 border-t-4 border-primary py-10 text-xs font-mono uppercase tracking-wider">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-900">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 bg-primary border border-black inline-block"></span>
                  <span className="font-bold text-white tracking-widest font-heading text-base">
                    TUERCA Y PERNO RC
                  </span>
                  <span className="text-slate-700">|</span>
                  <span className="text-[11px] text-slate-400">DIVISIÓN INDUSTRIAL & CORRALÓN</span>
                </div>

                {/* Enlaces rápidos del footer */}
                <nav className="flex flex-wrap gap-4 text-xs font-heading uppercase text-slate-300">
                  <Link href="/" className="hover:text-primary transition-colors">
                    Inicio
                  </Link>
                  <Link href="/catalogo" className="hover:text-primary transition-colors">
                    Catálogo
                  </Link>
                  <Link href="/quienes-somos" className="hover:text-primary transition-colors">
                    Quiénes Somos
                  </Link>
                  <Link href="/ubicacion" className="hover:text-primary transition-colors">
                    Ubicación & Logística
                  </Link>
                  <Link href="/contacto" className="hover:text-primary transition-colors">
                    Contacto & Cotizaciones
                  </Link>
                </nav>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
                <p>
                  Av. Marcelo T. de Alvear 1500, Río Cuarto, Cba · Tel: (0358) 465-8900 · ventas@tuercaypernorc.com.ar
                </p>
                <p>
                  © {new Date().getFullYear()} Tuerca y Perno RC. Materiales, Fijaciones & Corralón.
                </p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
