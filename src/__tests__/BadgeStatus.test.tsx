import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BadgeStatus, { getBadgeStatusConfig } from "@/components/ui/BadgeStatus";

describe("Test 3 · BadgeStatus", () => {
  describe("texto y color según el estado", () => {
    it.each([
      { status: "completado", texto: "Completado", fondo: "bg-emerald-100", variante: "success" },
      { status: "optimo", texto: "Óptimo", fondo: "bg-emerald-100", variante: "success" },
      { status: "pendiente", texto: "Pendiente", fondo: "bg-amber-100", variante: "warning" },
      { status: "critico", texto: "Crítico", fondo: "bg-red-100", variante: "danger" },
      { status: "cancelada", texto: "Cancelada", fondo: "bg-slate-100", variante: "neutral" },
    ])("'$status' muestra \"$texto\" con $fondo", ({ status, texto, fondo, variante }) => {
      render(<BadgeStatus status={status} />);

      const badge = screen.getByText(texto);
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass(fondo, "rounded-full", "uppercase");
      expect(badge).toHaveAttribute("data-status", status);
      expect(badge).toHaveAttribute("data-variant", variante);
    });

    it("un estado desconocido se muestra en gris con su propio texto", () => {
      render(<BadgeStatus status="en revisión" />);

      const badge = screen.getByText("En revisión");
      expect(badge).toHaveClass("bg-slate-100", "text-slate-700");
      expect(badge).toHaveAttribute("data-variant", "neutral");
    });

    it("normaliza mayúsculas, tildes y espacios", () => {
      render(<BadgeStatus status="  CRÍTICO " />);

      expect(screen.getByText("Crítico")).toHaveClass("bg-red-100");
    });
  });

  describe("propiedades opcionales", () => {
    it("label reemplaza el texto pero conserva el color del estado", () => {
      render(<BadgeStatus status="pendiente" label="Esperando pago" />);

      expect(screen.queryByText("Pendiente")).not.toBeInTheDocument();
      expect(screen.getByText("Esperando pago")).toHaveClass("bg-amber-100");
    });

    it("muestra el punto de color por defecto (decorativo)", () => {
      render(<BadgeStatus status="completado" />);

      const punto = screen.getByText("Completado").querySelector("span");
      expect(punto).toHaveClass("bg-emerald-500", "rounded-full");
      expect(punto).toHaveAttribute("aria-hidden", "true");
    });

    it("showDot={false} oculta el punto", () => {
      render(<BadgeStatus status="completado" showDot={false} />);

      expect(screen.getByText("Completado").querySelector("span")).toBeNull();
    });

    it("size cambia el tamaño (md por defecto, sm más chico)", () => {
      const { rerender } = render(<BadgeStatus status="optimo" />);
      expect(screen.getByText("Óptimo")).toHaveClass("text-[11px]", "px-2.5");

      rerender(<BadgeStatus status="optimo" size="sm" />);
      expect(screen.getByText("Óptimo")).toHaveClass("text-[10px]", "px-2");
    });

    it("agrega las clases extra de className", () => {
      render(<BadgeStatus status="critico" className="ml-4" />);

      expect(screen.getByText("Crítico")).toHaveClass("ml-4", "bg-red-100");
    });
  });

  describe("getBadgeStatusConfig (lógica pura)", () => {
    it("resuelve etiqueta y variante", () => {
      expect(getBadgeStatusConfig("finalizada")).toEqual({ label: "Finalizada", variant: "success" });
      expect(getBadgeStatusConfig("")).toEqual({ label: "Sin estado", variant: "neutral" });
    });
  });
});
