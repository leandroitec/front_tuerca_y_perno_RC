import React from "react";

/**
 * Badge genérico de estado.
 * No usa hooks ni APIs del navegador, por eso funciona tanto como Server
 * Component como dentro de un Client Component.
 */

/** Estados soportados con color semántico propio. */
export type BadgeStatusType =
  | "completado"
  | "finalizada"
  | "pendiente"
  | "critico"
  | "optimo";

/** Variantes de color semánticas (Verde, Amarillo, Rojo, Gris). */
export type BadgeVariant = "success" | "warning" | "danger" | "neutral";

export interface BadgeStatusConfig {
  label: string;
  variant: BadgeVariant;
}

const STATUS_CONFIG: Record<BadgeStatusType, BadgeStatusConfig> = {
  completado: { label: "Completado", variant: "success" },
  finalizada: { label: "Finalizada", variant: "success" },
  optimo: { label: "Óptimo", variant: "success" },
  pendiente: { label: "Pendiente", variant: "warning" },
  critico: { label: "Crítico", variant: "danger" },
};

const VARIANT_STYLES: Record<BadgeVariant, { container: string; dot: string }> = {
  success: {
    container: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
  },
  warning: {
    container: "bg-amber-100 text-amber-800 border-amber-300",
    dot: "bg-amber-500",
  },
  danger: {
    container: "bg-red-100 text-red-800 border-red-200",
    dot: "bg-red-500",
  },
  neutral: {
    container: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  },
};

const SIZE_STYLES = {
  sm: "px-2 py-0.5 text-[10px] gap-1",
  md: "px-2.5 py-1 text-[11px] gap-1.5",
} as const;

/**
 * Resuelve etiqueta y variante de color de un estado.
 * Normaliza mayúsculas, espacios y tildes ("CRÍTICO" -> "critico").
 * Cualquier estado desconocido cae en la variante gris (neutral).
 */
export function getBadgeStatusConfig(status: string): BadgeStatusConfig {
  const key = status
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

  if (key in STATUS_CONFIG) {
    return STATUS_CONFIG[key as BadgeStatusType];
  }

  const fallback = status.trim();
  return {
    label: fallback ? fallback.charAt(0).toUpperCase() + fallback.slice(1) : "Sin estado",
    variant: "neutral",
  };
}

export interface BadgeStatusProps {
  /** Estado a mostrar. Los no reconocidos se muestran en gris. */
  status: BadgeStatusType | (string & {});
  /** Texto alternativo; por defecto se usa la etiqueta del estado. */
  label?: string;
  size?: keyof typeof SIZE_STYLES;
  /** Muestra el punto de color a la izquierda del texto. */
  showDot?: boolean;
  className?: string;
}

export function BadgeStatus({
  status,
  label,
  size = "md",
  showDot = true,
  className = "",
}: BadgeStatusProps) {
  const config = getBadgeStatusConfig(status);
  const styles = VARIANT_STYLES[config.variant];

  return (
    <span
      data-status={status}
      data-variant={config.variant}
      className={`inline-flex items-center rounded-full border font-bold uppercase tracking-wide whitespace-nowrap ${SIZE_STYLES[size]} ${styles.container} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
      )}
      {label ?? config.label}
    </span>
  );
}

export default BadgeStatus;
