"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Building2,
  User,
  HelpCircle,
} from "lucide-react";

interface FormData {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  rubro: string;
  mensaje: string;
}

const INITIAL_FORM: FormData = {
  nombre: "",
  empresa: "",
  email: "",
  telefono: "",
  rubro: "Cotización de Materiales y Áridos",
  mensaje: "",
};

export default function ContactoPage() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre o contacto es obligatorio.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresá un correo electrónico válido.";
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono o WhatsApp de contacto es obligatorio.";
    }
    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "Por favor detalla tu consulta o lista de materiales.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const ticketId = `TK-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicket(ticketId);
      setIsSubmitting(false);
    }, 700);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setSubmittedTicket(null);
    setErrors({});
  };

  return (
    <div className="min-h-full bg-neutral-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb Industrial */}
        <nav className="text-xs font-mono uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-primary transition-colors font-bold">
            INICIO
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">CONTACTO & COTIZACIONES</span>
        </nav>

        {/* ── BANNER HEADER INDUSTRIAL ─────────────────────────────────────────── */}
        <section className="relative bg-slate-950 text-white border-2 border-slate-900 shadow-hard overflow-hidden">
          {/* Franja de advertencia industrial (Hazard stripes) */}
          <div
            className="h-2.5 bg-[repeating-linear-gradient(-45deg,#f59e0b_0_12px,#0f172a_12px_24px)] border-b-2 border-slate-900"
            aria-hidden="true"
          />

          <div className="p-8 sm:p-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-secondary border border-slate-900 text-xs font-mono font-black uppercase tracking-widest mb-4 shadow-[2px_2px_0px_0px_#000]">
              <span className="w-2 h-2 bg-slate-950"></span>
              CENTRAL OPERATIVA RÍO CUARTO
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white uppercase tracking-tight leading-none">
              CANAL DE COMUNICACIÓN & MESA DE ENTRADAS
            </h1>
            <p className="mt-4 max-w-2xl text-slate-300 font-sans text-sm sm:text-base leading-relaxed">
              Atención directa para licitaciones públicas y privadas, constructoras, talleres metalmecánicos
              y profesionales de oficio. Respuestas técnicas y cotizaciones en el día.
            </p>
          </div>
        </section>

        {/* ── GRID PRINCIPAL A 2 COLUMNAS ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUMNA 1: INFORMACIÓN DIRECTA (5 Cols en lg) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border-2 border-slate-900 shadow-hard p-6 sm:p-8 space-y-6">
              <div className="border-b-2 border-slate-900 pb-4">
                <span className="text-xs font-mono font-black uppercase tracking-widest text-amber-600 block">
                  ATENCIÓN INMEDIATA
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-wide text-slate-950 mt-1">
                  COMUNÍCATE CON EL CORRALÓN
                </h2>
              </div>

              {/* Teléfono / Conmutador */}
              <div className="p-4 bg-neutral-50 border-2 border-slate-900 space-y-1">
                <div className="flex items-center gap-2 text-slate-950 font-heading font-bold text-sm uppercase">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>LÍNEAS TELEFÓNICAS ROTATIVAS</span>
                </div>
                <p className="text-xl font-mono font-black text-slate-900 tracking-wider">
                  (0358) 465-8900
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  Auxiliar: (0358) 465-8901 · Conmutador directo con ventas
                </p>
              </div>

              {/* WhatsApp Corporativo */}
              <div className="p-4 bg-emerald-50 border-2 border-emerald-900 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-950 font-heading font-bold text-sm uppercase">
                    <MessageSquare className="w-4 h-4 text-emerald-700" />
                    <span>WHATSAPP VENTAS Y OBRA</span>
                  </div>
                  <span className="text-[10px] font-mono font-black bg-emerald-700 text-white px-2 py-0.5 border border-emerald-900 uppercase">
                    EN LÍNEA
                  </span>
                </div>
                <p className="text-xl font-mono font-black text-emerald-950 tracking-wider">
                  +54 9 358 412-3456
                </p>
                <p className="text-xs text-emerald-800 leading-relaxed font-sans">
                  Envío rápido de listas de materiales, planos y comprobantes de acopio.
                </p>
                <a
                  href="https://wa.me/5493584123456?text=Hola%20Tuerca%20y%20Perno%20RC,%20quiero%20solicitar%20una%20cotizaci%C3%B3n"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center justify-center w-full px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-bold uppercase text-xs tracking-wider border-2 border-emerald-950 border-b-4 active:translate-y-0.5 active:border-b-2 transition-all shadow-[2px_2px_0px_0px_#064e3b]"
                >
                  ABRIR CHAT DE WHATSAPP
                </a>
              </div>

              {/* Correo Electrónico */}
              <div className="p-4 bg-neutral-50 border-2 border-slate-900 space-y-1">
                <div className="flex items-center gap-2 text-slate-950 font-heading font-bold text-sm uppercase">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>CORREO ELECTRÓNICO OFICIAL</span>
                </div>
                <p className="text-sm font-mono font-bold text-slate-900">
                  <a
                    href="mailto:ventas@tuercaypernorc.com.ar"
                    className="hover:text-primary transition-colors underline decoration-2 underline-offset-2"
                  >
                    ventas@tuercaypernorc.com.ar
                  </a>
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  Licitaciones: licitaciones@tuercaypernorc.com.ar
                </p>
              </div>

              {/* Horarios de Atención */}
              <div className="p-4 bg-neutral-50 border-2 border-slate-900 space-y-2">
                <div className="flex items-center gap-2 text-slate-950 font-heading font-bold text-sm uppercase">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>HORARIOS DE ATENCIÓN DE CORRIDO</span>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="font-bold text-slate-700">LUNES A VIERNES:</span>
                    <span className="font-black text-slate-950">08:00 A 17:00 HS</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="font-bold text-slate-700">SÁBADOS:</span>
                    <span className="font-black text-slate-950">08:00 A 12:30 HS</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-bold text-slate-500">DOMINGOS Y FERIADOS:</span>
                    <span className="text-slate-400">CERRADO</span>
                  </div>
                </div>
              </div>

              {/* Base de operaciones y logística */}
              <div className="p-4 bg-slate-950 text-white border-2 border-slate-900 space-y-2">
                <div className="flex items-center gap-2 font-heading font-bold text-xs uppercase text-primary">
                  <MapPin className="w-4 h-4" />
                  <span>DESPACHO CENTRAL & MOSTRADOR</span>
                </div>
                <p className="text-xs font-mono text-slate-300">
                  Av. Marcelo T. de Alvear 1500, Río Cuarto, Córdoba.
                </p>
                <Link
                  href="/ubicacion"
                  className="inline-block text-xs font-mono font-bold text-primary hover:underline uppercase"
                >
                  VER PLANO Y ACCESO DE CAMIONES →
                </Link>
              </div>
            </div>

            {/* Garantía de Servicio Industrial */}
            <div className="bg-primary/10 border-2 border-primary p-4 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div className="text-xs text-slate-800 leading-relaxed">
                <strong className="font-heading uppercase tracking-wide block text-slate-950">
                  Respaldo Técnico en Cotizaciones
                </strong>
                Emitimos facturación A y B, certificados de ensayo para fijaciones estructurales y
                presupuestos congelados por 72 horas para proyectos en ejecución.
              </div>
            </div>
          </div>

          {/* COLUMNA 2: FORMULARIO TÉCNICO DE CONTACTO (7 Cols en lg) */}
          <div className="lg:col-span-7">
            <div className="bg-white border-2 border-slate-900 shadow-hard p-6 sm:p-10 space-y-6">
              <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-black uppercase tracking-widest text-slate-500 block">
                    PLANILLA TÉCNICA DE CONSULTA
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-wide text-slate-950 mt-1">
                    SOLICITAR COTIZACIÓN O ASESORÍA
                  </h2>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-slate-900 text-[10px] font-mono uppercase font-bold text-slate-700">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>RESPUESTA &lt; 2 HS</span>
                </div>
              </div>

              {submittedTicket ? (
                /* Comprobante de éxito industrial */
                <div className="p-8 bg-neutral-50 border-2 border-slate-900 space-y-6">
                  <div className="flex items-center gap-3 text-emerald-800">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-xs font-mono font-black uppercase tracking-widest text-emerald-700 block">
                        SOLICITUD PROCESADA CON ÉXITO
                      </span>
                      <h3 className="text-xl sm:text-2xl font-heading font-black uppercase text-slate-950">
                        ¡MENSAJE DESPACHADO A MESA DE ENTRADAS!
                      </h3>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-dashed border-slate-300 p-4 font-mono text-xs space-y-2 text-slate-700">
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">NÚMERO DE TICKET:</span>
                      <span className="font-black text-slate-950">{submittedTicket}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">SOLICITANTE:</span>
                      <span className="font-bold text-slate-900">{formData.nombre}</span>
                    </div>
                    {formData.empresa && (
                      <div className="flex justify-between border-b border-slate-200 pb-1.5">
                        <span className="text-slate-500">EMPRESA:</span>
                        <span className="font-bold text-slate-900">{formData.empresa}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">RUBRO:</span>
                      <span className="font-bold text-slate-900">{formData.rubro}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">CANAL DE CONTACTO:</span>
                      <span className="font-bold text-slate-900">{formData.email}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    Un asesor técnico de ventas revisará los requerimientos y preparará la cotización con
                    disponibilidad de stock inmediato y modalidades de entrega en obra.
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-3 bg-secondary text-white font-heading font-bold uppercase tracking-wider text-xs border-2 border-slate-900 border-b-4 hover:bg-slate-800 active:translate-y-0.5 active:border-b-2 transition-all text-center"
                    >
                      ENVIAR NUEVA CONSULTA
                    </button>
                    <Link
                      href="/catalogo"
                      className="px-6 py-3 bg-primary text-secondary font-heading font-black uppercase tracking-wider text-xs border-2 border-slate-900 border-b-4 hover:bg-amber-400 active:translate-y-0.5 active:border-b-2 transition-all text-center"
                    >
                      EXPLORAR CATÁLOGO
                    </Link>
                  </div>
                </div>
              ) : (
                /* Formulario de Entrada */
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Fila 1: Nombre y Empresa */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label
                        htmlFor="nombre"
                        className="block text-xs font-heading font-black uppercase tracking-wider text-slate-900"
                      >
                        NOMBRE COMPLETO / RESPONSABLE <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="nombre"
                          type="text"
                          required
                          value={formData.nombre}
                          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                          placeholder="Ej: Ing. Carlos Domínguez"
                          className={`w-full px-3.5 py-2.5 text-sm font-sans bg-white border-2 rounded-none text-slate-900 placeholder:text-slate-400 outline-none transition-colors ${
                            errors.nombre
                              ? "border-red-600 bg-red-50/20"
                              : "border-slate-900 focus:border-primary"
                          }`}
                        />
                        <User className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                      {errors.nombre && (
                        <p className="text-[11px] font-mono text-red-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.nombre}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="empresa"
                        className="block text-xs font-heading font-black uppercase tracking-wider text-slate-900"
                      >
                        EMPRESA / RAZÓN SOCIAL <span className="text-slate-400">(OPCIONAL)</span>
                      </label>
                      <div className="relative">
                        <input
                          id="empresa"
                          type="text"
                          value={formData.empresa}
                          onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                          placeholder="Ej: Constructora del Centro S.R.L."
                          className="w-full px-3.5 py-2.5 text-sm font-sans bg-white border-2 border-slate-900 focus:border-primary rounded-none text-slate-900 placeholder:text-slate-400 outline-none transition-colors"
                        />
                        <Building2 className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Fila 2: Email y Teléfono */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label
                        htmlFor="email"
                        className="block text-xs font-heading font-black uppercase tracking-wider text-slate-900"
                      >
                        CORREO ELECTRÓNICO <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="compras@tuempresa.com"
                          className={`w-full px-3.5 py-2.5 text-sm font-sans bg-white border-2 rounded-none text-slate-900 placeholder:text-slate-400 outline-none transition-colors ${
                            errors.email
                              ? "border-red-600 bg-red-50/20"
                              : "border-slate-900 focus:border-primary"
                          }`}
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                      {errors.email && (
                        <p className="text-[11px] font-mono text-red-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="telefono"
                        className="block text-xs font-heading font-black uppercase tracking-wider text-slate-900"
                      >
                        TELÉFONO / WHATSAPP <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="telefono"
                          type="tel"
                          required
                          value={formData.telefono}
                          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                          placeholder="Ej: (0358) 154-123456"
                          className={`w-full px-3.5 py-2.5 text-sm font-sans bg-white border-2 rounded-none text-slate-900 placeholder:text-slate-400 outline-none transition-colors ${
                            errors.telefono
                              ? "border-red-600 bg-red-50/20"
                              : "border-slate-900 focus:border-primary"
                          }`}
                        />
                        <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                      {errors.telefono && (
                        <p className="text-[11px] font-mono text-red-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.telefono}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Fila 3: Rubro / Tipo de Requerimiento */}
                  <div className="space-y-1">
                    <label
                      htmlFor="rubro"
                      className="block text-xs font-heading font-black uppercase tracking-wider text-slate-900"
                    >
                      RUBRO / SECTOR DE LA CONSULTA
                    </label>
                    <div className="relative">
                      <select
                        id="rubro"
                        value={formData.rubro}
                        onChange={(e) => setFormData({ ...formData, rubro: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm font-sans bg-white border-2 border-slate-900 focus:border-primary rounded-none text-slate-900 outline-none transition-colors cursor-pointer appearance-none"
                      >
                        <option value="Cotización de Materiales y Áridos">
                          Cotización de Materiales Gruesos y Áridos de Corralón
                        </option>
                        <option value="Bulonería y Fijaciones Especiales">
                          Bulonería Pesada, Varillas Roscadas y Anclajes Químicos
                        </option>
                        <option value="Herramientas y Maquinaria Pesada">
                          Herramientas Eléctricas, Hormigoneras y Generadores
                        </option>
                        <option value="Hierros Estructurales y Mallas">
                          Hierro Conformado, Perfiles Normalizados y Mallas Cimba
                        </option>
                        <option value="Apertura de Cuenta Corriente">
                          Solicitud de Apertura de Cuenta Corriente Comercial
                        </option>
                        <option value="Logística y Flete en Obra">
                          Consulta de Flete Pesado e Hidrogrúas
                        </option>
                        <option value="Otra Consulta">Otra Consulta Técnica</option>
                      </select>
                      <HelpCircle className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Fila 4: Mensaje */}
                  <div className="space-y-1">
                    <label
                      htmlFor="mensaje"
                      className="block text-xs font-heading font-black uppercase tracking-wider text-slate-900"
                    >
                      DETALLE DE LA SOLICITUD / LISTA DE MATERIALES <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      id="mensaje"
                      rows={5}
                      required
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      placeholder="Especificá medidas, calibres, cantidades estimadas, ubicación de la obra y si requerís descarga con pluma mecánica..."
                      className={`w-full px-3.5 py-2.5 text-sm font-sans bg-white border-2 rounded-none text-slate-900 placeholder:text-slate-400 outline-none transition-colors resize-y ${
                        errors.mensaje
                          ? "border-red-600 bg-red-50/20"
                          : "border-slate-900 focus:border-primary"
                      }`}
                    />
                    {errors.mensaje && (
                      <p className="text-[11px] font-mono text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.mensaje}
                      </p>
                    )}
                  </div>

                  {/* Botón mecánico de envío */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-slate-900 border-2 border-slate-900 border-b-4 border-r-2 uppercase font-heading font-black text-sm tracking-widest shadow-[2px_2px_0px_0px_#000] hover:bg-amber-400 active:translate-y-1 active:border-b-2 active:border-r-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent animate-spin inline-block"></span>
                          <span>REGISTRANDO EN PLANILLA...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>ENVIAR SOLICITUD DE COTIZACIÓN</span>
                        </>
                      )}
                    </button>
                    <span className="block mt-2 text-[11px] font-mono text-slate-500 uppercase">
                      🔒 Transmisión directa a nuestro equipo de ventas sin intermediarios
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
