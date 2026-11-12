/**
 * Se ejecuta antes de cada archivo de test.
 * - Suma los matchers de jest-dom (toBeInTheDocument, toHaveClass, ...).
 * - Desmonta los componentes renderizados al terminar cada test.
 */
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
