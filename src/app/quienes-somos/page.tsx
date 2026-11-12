import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Warehouse,
  Truck,
  Wrench,
  CheckSquare,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Quiénes Somos | Tuerca y Perno RC - Ferretería Industrial & Corralón",
  description:
    "Conocé la trayectoria de Tuerca y Perno RC. Desde 1998 forjando el desarrollo industrial, metalúrgico y constructivo de Río Cuarto y la región.",
};

export default function QuienesSomosPage() {
  return (
    <div className="min-h-full bg-neutral-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb industrial */}
        <nav className="text-xs font-mono uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-primary transition-colors font-bold">
            INICIO
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">QUIÉNES SOMOS</span>
        </nav>

        {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
        <section className="relative bg-slate-950 text-white border-2 border-slate-900 shadow-hard overflow-hidden">
          {/* Franja de advertencia industrial (Hazard stripes) */}
          <div
            className="h-2.5 bg-[repeating-linear-gradient(-45deg,#f59e0b_0_12px,#0f172a_12px_24px)] border-b-2 border-slate-900"
            aria-hidden="true"
          />

          <div className="relative p-8 sm:p-12 lg:p-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-secondary border border-slate-900 text-xs font-mono font-black uppercase tracking-widest mb-6 shadow-[2px_2px_0px_0px_#000]">
              <span className="w-2 h-2 bg-slate-950"></span>
              DIVISIÓN INDUSTRIAL & CORRALÓN DE MATERIALES
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white uppercase tracking-tight leading-none mb-6">
              FORJANDO LA CIUDAD <br />
              <span className="text-primary underline decoration-primary decoration-4 underline-offset-8">
                DESDE 1998
              </span>
            </h1>

            <p className="max-w-3xl text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
              Más de dos décadas y media abasteciendo a la industria pesada, talleres metalmecánicos,
              empresas constructoras y profesionales de oficio de Río Cuarto y todo el sur cordobés
              con fijaciones de alta resistencia, maquinaria y materiales estructurales normalizados.
            </p>
          </div>
        </section>

        {/* ── HISTORIA OPERATIVA ───────────────────────────────────────────── */}
        <section className="bg-white border-2 border-slate-900 rounded-none shadow-hard p-8 sm:p-12 space-y-8">
          <div className="flex items-center gap-3 border-b-2 border-slate-900 pb-4">
            <div className="w-10 h-10 bg-primary text-secondary border-2 border-slate-900 flex items-center justify-center font-black">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 block">
                TRAYECTORIA Y CRECIMIENTO
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-wide text-slate-950">
                NUESTRA HISTORIA OPERATIVA
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-700 font-sans leading-relaxed text-sm sm:text-base">
            <div className="space-y-3 bg-neutral-50 p-6 border-l-4 border-primary">
              <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest">
                FASE 01 · 1998 - 2005
              </span>
              <h3 className="font-heading font-bold text-lg text-slate-950 uppercase">
                El origen en el taller de tornillería
              </h3>
              <p>
                En 1998, sobre las arterias de acceso a Río Cuarto, nacimos como un modesto taller
                especializado en bulonería de alta resistencia. Con una premisa irrenunciable —
                <em className="font-semibold text-slate-900">ninguna cosechadora o máquina vial debía detenerse por falta de un bulón</em>—,
                comenzamos proveyendo fijaciones métricas y en pulgadas a productores agropecuarios y talleres de rectificación.
              </p>
            </div>

            <div className="space-y-3 bg-neutral-50 p-6 border-l-4 border-slate-900">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
                FASE 02 · 2006 - 2017
              </span>
              <h3 className="font-heading font-bold text-lg text-slate-950 uppercase">
                La expansión hacia la ferretería pesada
              </h3>
              <p>
                El auge de la infraestructura regional exigió dar el salto. Sumamos maquinarias electroportátiles,
                electrodos para soldadura naval y estructural, discos diamantados y anclajes químicos de grado sísmico.
                Ampliamos nuestro centro de distribución a 3.500 m² y forjamos alianzas directas con acerías
                nacionales para garantizar precios mayoristas sin intermediarios.
              </p>
            </div>

            <div className="space-y-3 bg-neutral-50 p-6 border-l-4 border-primary">
              <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest">
                FASE 03 · 2018 - PRESENTE
              </span>
              <h3 className="font-heading font-bold text-lg text-slate-950 uppercase">
                El corralón integral y la logística pesada
              </h3>
              <p>
                Consolidamos la división de corralón: áridos clasificados, cemento, cal, hierros conformados y mallas.
                Equipamos nuestra flota con camiones volcadores e hidrogrúas de 15 toneladas para descargas precisas
                directamente en obra, respaldados hoy por una plataforma digital con stock sincronizado en tiempo real.
              </p>
            </div>
          </div>
        </section>

        {/* ── MISIÓN Y VISIÓN ─────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tarjeta Misión */}
          <div className="bg-white border-2 border-slate-900 rounded-none shadow-hard p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-slate-950 text-primary border-2 border-slate-900 flex items-center justify-center mb-6">
                <CheckSquare className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-black uppercase tracking-widest text-amber-600">
                PROPÓSITO CENTRAL
              </span>
              <h3 className="text-2xl font-heading font-black uppercase tracking-wide text-slate-950 mt-1 mb-4">
                NUESTRA MISIÓN
              </h3>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                Proveer soluciones integrales e inmediatas en fijaciones, herramientas pesadas y materiales
                de construcción, bajo normas IRAM e ISO de máxima exigencia. Asesoramos técnicamente a cada
                cliente con honestidad de oficio para asegurar que cada cimiento, puente, nave industrial o
                vivienda se levante con seguridad estructural absoluta.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-200 text-xs font-mono uppercase text-slate-500 font-bold">
              ESTÁNDARES DE CALIDAD INDUSTRIAL GARANTIZADOS
            </div>
          </div>

          {/* Tarjeta Visión */}
          <div className="bg-white border-2 border-slate-900 rounded-none shadow-hard p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-primary text-secondary border-2 border-slate-900 flex items-center justify-center mb-6">
                <Warehouse className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-black uppercase tracking-widest text-slate-500">
                HORIZONTE ESTRATÉGICO
              </span>
              <h3 className="text-2xl font-heading font-black uppercase tracking-wide text-slate-950 mt-1 mb-4">
                NUESTRA VISIÓN
              </h3>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                Ser el centro logístico y comercial de suministros de obra e industria más confiable y
                eficiente del centro del país. Lideramos la transformación tecnológica del sector mediante
                sistemas de despacho ágiles y plataformas en tiempo real, manteniendo siempre el valor del
                apretón de manos y el compromiso inquebrantable con el trabajador.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-200 text-xs font-mono uppercase text-slate-500 font-bold">
              COBERTURA REGIONAL CON BASE EN RÍO CUARTO
            </div>
          </div>
        </section>

        {/* ── VALORES CORPORATIVOS ───────────────────────────────────────── */}
        <section className="bg-slate-950 text-white border-2 border-slate-900 shadow-hard p-8 sm:p-12">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-mono font-black uppercase tracking-widest text-primary">
              CÓDIGO DE TRABAJO
            </span>
            <h2 className="text-3xl font-heading font-black uppercase tracking-wide text-white mt-1">
              LOS 4 PILARES DE TUERCA Y PERNO RC
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Principios mecánicos y humanos que guían cada despacho, cotización y atención en nuestro mostrador.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Valor 1 */}
            <div className="bg-slate-900 border-2 border-slate-800 p-6 space-y-3 hover:border-primary transition-colors">
              <div className="w-10 h-10 bg-primary/10 text-primary border border-primary/40 flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-base uppercase text-white tracking-wider">
                1. SOLIDEZ TÉCNICA
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Materiales ensayados y homologados. No comercializamos segundas marcas en elementos críticos de fijación y estructura.
              </p>
            </div>

            {/* Valor 2 */}
            <div className="bg-slate-900 border-2 border-slate-800 p-6 space-y-3 hover:border-primary transition-colors">
              <div className="w-10 h-10 bg-primary/10 text-primary border border-primary/40 flex items-center justify-center font-black">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-base uppercase text-white tracking-wider">
                2. PALABRA Y CONFIANZA
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Relaciones comerciales construidas a lo largo de décadas con contratistas, herreros y grandes constructoras del interior.
              </p>
            </div>

            {/* Valor 3 */}
            <div className="bg-slate-900 border-2 border-slate-800 p-6 space-y-3 hover:border-primary transition-colors">
              <div className="w-10 h-10 bg-primary/10 text-primary border border-primary/40 flex items-center justify-center font-black">
                <Warehouse className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-base uppercase text-white tracking-wider">
                3. STOCK PERMANENTE
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Más de 12.000 líneas activas en depósito continuo. Disponibilidad inmediata para que tu obra nunca se detenga.
              </p>
            </div>

            {/* Valor 4 */}
            <div className="bg-slate-900 border-2 border-slate-800 p-6 space-y-3 hover:border-primary transition-colors">
              <div className="w-10 h-10 bg-primary/10 text-primary border border-primary/40 flex items-center justify-center font-black">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-base uppercase text-white tracking-wider">
                4. LOGÍSTICA EN OBRA
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Flota pesada equipada con hidrogrúas telescópicas para entregas puntuales y descarga segura al pie de obra.
              </p>
            </div>
          </div>
        </section>

        {/* ── LLAMADO A LA ACCIÓN ─────────────────────────────────────────── */}
        <section className="bg-primary border-2 border-slate-900 shadow-hard p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-heading font-black uppercase text-secondary tracking-tight">
              ¿TENÉS UN PROYECTO O LICITACIÓN EN MARCHA?
            </h3>
            <p className="text-sm font-bold text-slate-900 mt-1 uppercase tracking-wide font-sans">
              Solicitá presupuesto por volumen o asesoramiento técnico con nuestros especialistas.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/catalogo"
              className="px-6 py-3 bg-secondary text-white font-heading font-bold uppercase tracking-wider text-sm border-2 border-slate-900 border-b-4 hover:bg-slate-800 active:translate-y-0.5 active:border-b-2 transition-all flex items-center gap-2"
            >
              <span>VER CATÁLOGO</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contacto"
              className="px-6 py-3 bg-white text-secondary font-heading font-bold uppercase tracking-wider text-sm border-2 border-slate-900 border-b-4 hover:bg-neutral-100 active:translate-y-0.5 active:border-b-2 transition-all"
            >
              CONTACTAR
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
