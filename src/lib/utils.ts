/**
 * Utilidades generales compartidas por toda la aplicación.
 * Funciones puras: sin React, sin red y sin estado.
 */

const formateadorARS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formatea un importe en pesos argentinos.
 *
 *   formatCurrency(1250)        -> "$ 1.250,00"
 *   formatCurrency("85000.00")  -> "$ 85.000,00"   (decimales de la API de Django)
 *   formatCurrency("abc")       -> "—"            (o el `fallback` indicado)
 *
 * Intl separa "$" del número con un espacio no separable (U+00A0);
 * se reemplaza por un espacio común para obtener un texto predecible.
 */
export function formatCurrency(valor: number | string, fallback = "—"): string {
  const numero = typeof valor === "number" ? valor : Number.parseFloat(valor);

  if (!Number.isFinite(numero)) {
    return fallback;
  }

  return formateadorARS.format(numero).replace(/ /g, " ");
}
