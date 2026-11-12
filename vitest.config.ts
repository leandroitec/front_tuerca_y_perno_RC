import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

/**
 * Configuración de Vitest para tests unitarios.
 * - jsdom: navegador simulado para renderizar componentes de React.
 * - alias "@": mismo atajo que tsconfig.json ("@/..." -> "src/...").
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/__tests__/**/*.test.{ts,tsx}"],
    css: false,
  },
});
