import { describe, it, expect } from "vitest";
import { formatCurrency } from "@/lib/utils";

describe("Test 4 · formatCurrency", () => {
  it("formatea 1250 como $ 1.250,00 (formato argentino)", () => {
    expect(formatCurrency(1250)).toBe("$ 1.250,00");
  });

  it.each([
    [0, "$ 0,00"],
    [9.5, "$ 9,50"],
    [1234.56, "$ 1.234,56"],
    [85000, "$ 85.000,00"],
    [1000000, "$ 1.000.000,00"],
  ])("formatCurrency(%s) -> %s", (valor, esperado) => {
    expect(formatCurrency(valor)).toBe(esperado);
  });

  it("redondea a dos decimales", () => {
    expect(formatCurrency(1250.999)).toBe("$ 1.251,00");
  });

  it("acepta los decimales como texto que envía Django", () => {
    expect(formatCurrency("85000.00")).toBe("$ 85.000,00");
  });

  it("formatea importes negativos", () => {
    expect(formatCurrency(-1250)).toBe("-$ 1.250,00");
  });

  it("usa un espacio común, no el espacio no separable de Intl", () => {
    expect(formatCurrency(1250)).not.toContain("\u00a0");
  });

  it("devuelve el fallback si el valor no es un número", () => {
    expect(formatCurrency("abc")).toBe("—");
    expect(formatCurrency(Number.NaN)).toBe("—");
    expect(formatCurrency("abc", "Precio a consultar")).toBe("Precio a consultar");
  });
});
