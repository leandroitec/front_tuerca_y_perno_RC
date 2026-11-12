import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto & Cotizaciones | Tuerca y Perno RC - Ferretería Industrial & Corralón",
  description:
    "Comunicate con el corralón y ferretería industrial de Tuerca y Perno RC en Río Cuarto. Teléfonos rotativos, WhatsApp y cotización técnica de materiales.",
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
