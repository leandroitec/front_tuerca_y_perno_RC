import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white py-20 lg:py-28 overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
              Ferretería Industrial & Corralón de Materiales
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
              Todo en Fijaciones, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-300">
                Herramientas y Obra
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
              En <strong className="text-white">Tuerca y Perno RC</strong> abastecemos a industrias, talleres, constructoras y particulares con la más amplia variedad de bulonería, ferretería pesada y materiales para la construcción con entregas directas a obra.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/catalogo"
                className="px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-lg shadow-brand-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Explorar Catálogo
              </Link>
              <Link
                href="/login"
                className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-base border border-slate-700 transition-all duration-200"
              >
                Acceder al Sistema
              </Link>
              <a
                href="#servicios"
                className="px-5 py-3.5 rounded-xl text-slate-300 hover:text-white font-semibold text-base transition-colors"
              >
                Rubros y Servicios ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios y Rubros Destacados */}
      <section id="servicios" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">
              Nuestras Especialidades
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Soluciones integrales para tu proyecto
            </h3>
            <p className="mt-4 text-base text-slate-600">
              Calidad certificada, stock permanente y el mejor asesoramiento técnico para garantizar la seguridad de tus estructuras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1: Bulonería */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-brand-500/40 transition-all duration-300 flex flex-col group">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                🔩
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                Bulonería & Fijaciones
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tornillos autoperforantes, varillas roscadas, tuercas de alta resistencia, arandelas y anclajes químicos para exigencias industriales.
              </p>
            </div>

            {/* Card 2: Ferretería */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-brand-500/40 transition-all duration-300 flex flex-col group">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                ⚙️
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                Ferretería Industrial
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Máquinas eléctricas, herramientas manuales, discos de corte, soldadoras e indumentaria de seguridad certificada.
              </p>
            </div>

            {/* Card 3: Corralón */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-brand-500/40 transition-all duration-300 flex flex-col group">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                🧱
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                Corralón de Materiales
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Cemento, cal, hierros de construcción, mallas electrosoldadas, áridos por bolsón y ladrillos de primera calidad.
              </p>
            </div>

            {/* Card 4: Logística */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-brand-500/40 transition-all duration-300 flex flex-col group">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                🚚
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                Entregas en Obra
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Flota propia con camiones grúa (hidrogrúas) para descargas seguras y puntuales en el lugar exacto de tu obra o fábrica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner de Contacto / Sistema */}
      <section className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-bold text-white">¿Sos parte del equipo de Tuerca y Perno RC?</h4>
            <p className="text-sm text-slate-400 mt-1">
              Ingresá al panel administrativo para gestionar ventas, stock de depósito y presupuestos.
            </p>
          </div>
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-colors shrink-0"
          >
            Iniciar Sesión
          </Link>
        </div>
      </section>
    </div>
  );
}
