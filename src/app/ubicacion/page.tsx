import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Navigation,
  Truck,
  Warehouse,
  Clock,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Scale,
  Car,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Ubicación & Base Logística | Tuerca y Perno RC - Ferretería Industrial & Corralón",
  description:
    "Conocé nuestra base operativa en Av. Marcelo T. de Alvear 1500, Río Cuarto. Playa de maniobras para camiones, báscula homologada y zona de retiro rápido pick-up.",
};

export default function UbicacionPage() {
  return (
    <div className="min-h-full bg-neutral-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb Industrial */}
        <nav className="text-xs font-mono uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-primary transition-colors font-bold">
            INICIO
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">BASE OPERATIVA & UBICACIÓN</span>
        </nav>

        {/* ── HEADER IMPONENTE ──────────────────────────────────────────────── */}
        <section className="relative bg-slate-950 text-white border-2 border-slate-900 shadow-hard overflow-hidden">
          {/* Franja de advertencia industrial (Hazard stripes) */}
          <div
            className="h-2.5 bg-[repeating-linear-gradient(-45deg,#f59e0b_0_12px,#0f172a_12px_24px)] border-b-2 border-slate-900"
            aria-hidden="true"
          />

          <div className="p-8 sm:p-12 lg:p-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-secondary border border-slate-900 text-xs font-mono font-black uppercase tracking-widest mb-6 shadow-[2px_2px_0px_0px_#000]">
              <span className="w-2 h-2 bg-slate-950"></span>
              CENTRO LOGÍSTICO Y PATIO DE ACOPIO · SUR CORDOBÉS
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white uppercase tracking-tight leading-none mb-6">
              NUESTRA BASE <br />
              <span className="text-primary underline decoration-primary decoration-4 underline-offset-8">
                DE OPERACIONES
              </span>
            </h1>

            <p className="max-w-3xl text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
              Infraestructura pesada de 12.000 m² diseñada para acopio masivo de áridos, perfilería de acero,
              báscula fiscal de pesaje por ejes y despacho express para abastecer la construcción y la industria.
            </p>
          </div>
        </section>

        {/* ── DATOS DE LOCALIZACIÓN DIRECTA ─────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tarjeta Dirección */}
          <div className="bg-white border-2 border-slate-900 p-6 sm:p-8 shadow-hard flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary text-secondary border-2 border-slate-900 flex items-center justify-center font-black">
                <MapPin className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-black uppercase tracking-widest text-slate-500">
                PUNTO GEOGRÁFICO CENTRAL
              </span>
              <h2 className="text-2xl font-heading font-black uppercase text-slate-950 leading-tight">
                DIRECCIÓN EN RÍO CUARTO
              </h2>
              <p className="text-slate-800 font-mono text-sm font-bold bg-neutral-100 p-3 border-l-4 border-primary">
                Av. Marcelo T. de Alvear 1500 <br />
                X5800 Río Cuarto, Córdoba, Argentina
              </p>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Eje neurálgico con conexión directa hacia el enlace de la Ruta Nacional 8 y Ruta Nacional 36.
                A sólo 5 minutos del Parque Industrial y Tecnológico Río Cuarto.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200 mt-4">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Av.+Marcelo+T.+de+Alvear+1500,+Rio+Cuarto,+Cordoba"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold uppercase text-xs tracking-wider border-2 border-slate-900 border-b-4 active:translate-y-0.5 active:border-b-2 transition-all w-full justify-center"
              >
                <span>VER EN GOOGLE MAPS</span>
                <ExternalLink className="w-4 h-4 text-primary" />
              </a>
            </div>
          </div>

          {/* Tarjeta Horarios Báscula y Patio */}
          <div className="bg-white border-2 border-slate-900 p-6 sm:p-8 shadow-hard flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-slate-950 text-primary border-2 border-slate-900 flex items-center justify-center font-black">
                <Clock className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-black uppercase tracking-widest text-slate-500">
                HORARIOS DEL PREDIO
              </span>
              <h2 className="text-2xl font-heading font-black uppercase text-slate-950 leading-tight">
                PATIO DE CARGAS & BÁSCULA
              </h2>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="font-bold text-slate-700">LUNES A VIERNES (CORRIDO):</span>
                  <span className="font-black text-slate-950">08:00 A 17:00 HS</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="font-bold text-slate-700">SÁBADOS (MAÑANA):</span>
                  <span className="font-black text-slate-950">08:00 A 12:30 HS</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="font-bold text-slate-700">BÁSCULA FISCAL:</span>
                  <span className="font-black text-amber-700">HASTA 16:30 HS</span>
                </div>
                <div className="flex justify-between py-1 text-slate-500">
                  <span>DOMINGOS Y FERIADOS:</span>
                  <span>CERRADO</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Recepción de bitrenes y tolvas pesadas con previo aviso de despacho para asignación de dársena.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200 mt-4">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-secondary hover:bg-amber-400 font-heading font-black uppercase text-xs tracking-wider border-2 border-slate-900 border-b-4 active:translate-y-0.5 active:border-b-2 transition-all w-full justify-center"
              >
                <span>COORDINAR INGRESO DE FLOTA</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Tarjeta Conectividad Logística */}
          <div className="bg-slate-950 text-white border-2 border-slate-900 p-6 sm:p-8 shadow-hard flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/20 text-primary border-2 border-primary/40 flex items-center justify-center font-black">
                <Navigation className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-black uppercase tracking-widest text-primary">
                ACCESIBILIDAD VIAL
              </span>
              <h2 className="text-2xl font-heading font-black uppercase text-white leading-tight">
                CONEXIONES ESTRATÉGICAS
              </h2>
              <ul className="space-y-2 text-xs font-mono text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">▶</span>
                  <span><strong>Ruta Nacional 8:</strong> Acceso inmediato hacia La Carlota, Canals y Buenos Aires.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">▶</span>
                  <span><strong>Ruta Nacional 36:</strong> Autovía directa hacia Córdoba Capital y Almafuerte.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">▶</span>
                  <span><strong>Ruta Nacional 158:</strong> Conexión al polo agroindustrial de Villa María.</span>
                </li>
              </ul>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Pavimento reforzado para circulación de carga pesada sin restricciones de gálibo ni puentes bajos.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-4">
              <div className="text-[11px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 bg-amber-400 rounded-none inline-block"></span>
                <span>RADIO DE ENTREGA LOCAL: &lt; 24 HS</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECCIÓN DE LOGÍSTICA: INFRAESTRUCTURA OPERATIVA ───────────────── */}
        <section className="bg-white border-2 border-slate-900 shadow-hard p-8 sm:p-12 space-y-8">
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-black uppercase tracking-widest text-amber-600 block">
                INFRAESTRUCTURA DE ALTO TONELAJE
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-wide text-slate-950 mt-1">
                SECCIÓN DE LOGÍSTICA & DESPACHO
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 text-primary border border-slate-900 text-xs font-mono font-bold uppercase">
              <Warehouse className="w-4 h-4" />
              <span>CAPACIDAD: 12.000 M²</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logística 1: Playa de maniobras */}
            <div className="bg-neutral-50 border-2 border-slate-900 p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-slate-900 text-primary border border-slate-900 flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-black text-xl text-slate-950 uppercase leading-snug">
                  PLAYA DE MANIOBRAS PARA CAMIONES
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  Superficie de 3.200 m² de hormigón reforzado H30 con radio de giro optimizado para camiones
                  con acoplado, semirremolques batea y tolvas cementeras de hasta 22 metros de longitud.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <div className="text-[11px] font-mono text-slate-600 space-y-1">
                  <p>✔ Carga simultánea de hasta 6 unidades pesadas</p>
                  <p>✔ Iluminación LED para maniobras crepusculares</p>
                </div>
              </div>
            </div>

            {/* Logística 2: Estacionamiento carga pesada */}
            <div className="bg-neutral-50 border-2 border-slate-900 p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary text-secondary border border-slate-900 flex items-center justify-center">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-black text-xl text-slate-950 uppercase leading-snug">
                  ESTACIONAMIENTO EXCLUSIVO DE CARGA
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  Dársenas independientes para pick-ups, furgones de reparto y vehículos de instaladores.
                  Diseñado para cargar perfiles de hasta 12 metros sin obstaculizar la vía pública ni la salida de camiones.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <div className="text-[11px] font-mono text-slate-600 space-y-1">
                  <p>✔ Sector techado para carga protegida</p>
                  <p>✔ Vigilancia con circuito cerrado 24/7</p>
                </div>
              </div>
            </div>

            {/* Logística 3: Retiro rápido Pick-up */}
            <div className="bg-neutral-50 border-2 border-slate-900 p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-amber-500 text-slate-950 border border-slate-900 flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-black text-xl text-slate-950 uppercase leading-snug">
                  ZONA EXPRESS DE RETIRO (PICK-UP)
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  Mostrador exclusivo para pedidos prearmados vía web o WhatsApp. Retirá tu orden en menos de
                  10 minutos cronometrados con asistencia mecánica de autoelevadores Clark de 3.5 tn.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <div className="text-[11px] font-mono text-slate-600 space-y-1">
                  <p>✔ Cero demoras de caja en mostrador</p>
                  <p>✔ Embalaje y sujeción reforzada para transporte</p>
                </div>
              </div>
            </div>
          </div>

          {/* Placa técnica de Báscula Homologada */}
          <div className="bg-slate-950 text-white p-6 border-2 border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 text-primary border border-primary/40 flex items-center justify-center shrink-0">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-black uppercase text-base text-white tracking-wide">
                  BÁSCULA ELECTRÓNICA FISCAL DE 80 TONELADAS
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xl font-sans">
                  Pesaje por ejes certificado por INTI para remitos de áridos sueltos (arena fina, gruesa, piedra partida, estabilizado) y despacho de hierro en barra.
                </p>
              </div>
            </div>
            <div className="font-mono text-xs text-primary font-bold border border-primary/30 px-3 py-2 bg-slate-900 uppercase shrink-0">
              PRECISIÓN FISCAL ± 5 KG
            </div>
          </div>
        </section>

        {/* ── CONTENEDOR DE MAPA INTERACTIVO INDUSTRIAL ──────────────────────── */}
        <section className="bg-white border-2 border-slate-900 shadow-hard overflow-hidden">
          {/* Barra superior de telemetría GPS */}
          <div className="bg-slate-950 text-white px-4 sm:px-6 py-3 border-b-2 border-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs font-mono uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 border border-black animate-pulse"></span>
              <span className="font-bold text-white">SISTEMA DE NAVEGACIÓN GPS // BASE RÍO CUARTO</span>
            </div>
            <div className="text-slate-400 text-[11px] hidden sm:block">
              COORDENADAS: <span className="text-primary font-bold">-33.1235° S, -64.3491° W</span>
            </div>
            <div className="text-slate-400 text-[11px]">
              ELEV: <span className="text-white font-bold">442 M.S.N.M.</span>
            </div>
          </div>

          {/* Contenedor del Iframe con estética de borde duro */}
          <div className="relative w-full h-[450px] sm:h-[520px] bg-neutral-200">
            <iframe
              title="Plano Satelital Tuerca y Perno RC"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13418.156637375628!2d-64.359146!3d-33.123548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95d200155b1e95c7%3A0x8f2d5966a33716d1!2sAv.%20Marcelo%20T.%20de%20Alvear%201500%2C%20R%C3%ADo%20Cuarto%2C%20C%C3%B3rdoba!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar"
              className="w-full h-full border-0 filter contrast-105"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Overlay Industrial: Tarjeta flotante en esquina */}
            <div className="absolute top-4 left-4 max-w-sm bg-slate-950/95 text-white border-2 border-slate-900 p-4 shadow-hard hidden sm:block backdrop-blur-sm">
              <div className="flex items-center gap-2 text-primary font-mono text-xs font-black uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>PUNTO DE LLEGADA</span>
              </div>
              <h5 className="font-heading font-black uppercase text-base text-white">
                TUERCA Y PERNO RC
              </h5>
              <p className="text-xs text-slate-300 font-mono mt-1">
                Av. Marcelo T. de Alvear 1500, Río Cuarto.
              </p>
              <p className="text-[11px] text-slate-400 mt-2 font-sans">
                Entrada para camiones de áridos y bateas sobre portón 2 lateral (calle perpendicular).
              </p>
            </div>
          </div>

          {/* Barra inferior de acciones de navegación */}
          <div className="p-4 sm:p-6 bg-neutral-50 border-t-2 border-slate-900 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
              <Navigation className="w-4 h-4 text-primary" />
              <span>Indicaciones precisas para transporte de carga pesada y particulares.</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Av.+Marcelo+T.+de+Alvear+1500,+Rio+Cuarto,+Cordoba"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-slate-900 text-white font-heading font-bold uppercase text-xs tracking-wider border-2 border-slate-900 border-b-4 hover:bg-slate-800 active:translate-y-0.5 active:border-b-2 transition-all flex items-center gap-2"
              >
                <span>ABRIR EN GOOGLE MAPS</span>
                <ExternalLink className="w-4 h-4 text-primary" />
              </a>

              <a
                href="https://waze.com/ul?q=Av.+Marcelo+T.+de+Alvear+1500,+Rio+Cuarto,+Cordoba"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-primary text-secondary font-heading font-black uppercase text-xs tracking-wider border-2 border-slate-900 border-b-4 hover:bg-amber-400 active:translate-y-0.5 active:border-b-2 transition-all flex items-center gap-2"
              >
                <span>NAVEGAR CON WAZE</span>
                <Navigation className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ── PROTOCOLO DE SEGURIDAD INDUSTRIAL EN PREDIO ─────────────────────── */}
        <section className="bg-amber-500/10 border-2 border-slate-900 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500 text-slate-950 border-2 border-slate-900 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-black uppercase text-lg text-slate-950">
                PROTOCOLO OBLIGATORIO DE INGRESO A PLAYA DE CARGA
              </h3>
              <p className="text-xs text-slate-700 font-sans max-w-3xl leading-relaxed">
                Por normativa de seguridad laboral, todo chofer u operario que ingrese a la playa de maniobras
                debe descender con <strong>calzado de seguridad y chaleco reflectivo</strong>. Velocidad máxima
                en predio: <strong>15 km/h</strong>. Respetar las indicaciones de los señaleros de autoelevador.
              </p>
            </div>
          </div>

          <Link
            href="/contacto"
            className="px-6 py-3 bg-secondary text-white font-heading font-bold uppercase tracking-wider text-xs border-2 border-slate-900 border-b-4 hover:bg-slate-800 active:translate-y-0.5 active:border-b-2 transition-all shrink-0 text-center"
          >
            CONSULTAR DESPACHO
          </Link>
        </section>
      </div>
    </div>
  );
}
