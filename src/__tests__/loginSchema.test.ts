import { describe, it, expect } from "vitest";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations/auth";

/** Devuelve los mensajes de error de un campo, o [] si el campo es válido. */
function erroresDe(data: unknown, campo: string): string[] {
  const resultado = loginSchema.safeParse(data);
  if (resultado.success) return [];
  return resultado.error.issues
    .filter((issue) => issue.path[0] === campo)
    .map((issue) => issue.message);
}

describe("Test 1 · loginSchema (Zod)", () => {
  describe("credenciales válidas", () => {
    it("acepta usuario y contraseña completos", () => {
      const resultado = loginSchema.safeParse({ username: "admin", password: "admin123" });

      expect(resultado.success).toBe(true);
      expect(resultado.data).toEqual({ username: "admin", password: "admin123" });
    });

    it("recorta los espacios alrededor del usuario", () => {
      const resultado = loginSchema.safeParse({ username: "  vendedor  ", password: "vendedor123" });

      expect(resultado.success).toBe(true);
      expect(resultado.data?.username).toBe("vendedor");
    });
  });

  describe("formato incorrecto", () => {
    it("rechaza el usuario vacío con su mensaje", () => {
      expect(erroresDe({ username: "", password: "admin123" }, "username")).toContain(
        "El nombre de usuario es obligatorio"
      );
    });

    it("rechaza un usuario compuesto sólo por espacios", () => {
      const resultado = loginSchema.safeParse({ username: "   ", password: "admin123" });

      expect(resultado.success).toBe(false);
      expect(erroresDe({ username: "   ", password: "admin123" }, "username")).toContain(
        "El nombre de usuario es obligatorio"
      );
    });

    it("rechaza la contraseña vacía con su mensaje", () => {
      expect(erroresDe({ username: "admin", password: "" }, "password")).toContain(
        "La contraseña es obligatoria"
      );
    });

    it("rechaza un objeto sin campos y reporta ambos", () => {
      const resultado = loginSchema.safeParse({});

      expect(resultado.success).toBe(false);
      const campos = resultado.error?.issues.map((issue) => issue.path[0]);
      expect(campos).toEqual(expect.arrayContaining(["username", "password"]));
    });

    it("rechaza tipos que no son texto", () => {
      const resultado = loginSchema.safeParse({ username: 12345, password: true });

      expect(resultado.success).toBe(false);
      expect(resultado.error?.issues).toHaveLength(2);
    });

    it("rechaza un valor que no es un objeto", () => {
      expect(loginSchema.safeParse(null).success).toBe(false);
      expect(loginSchema.safeParse("admin:admin123").success).toBe(false);
    });
  });

  describe("integración con react-hook-form (zodResolver)", () => {
    const opciones = { fields: {}, shouldUseNativeValidation: false } as const;

    it("convierte los errores de Zod en mensajes del formulario (no lanza)", async () => {
      const resolver = zodResolver(loginSchema);
      const resultado = await resolver({ username: "", password: "" }, undefined, opciones);

      expect(resultado.values).toEqual({});
      expect(resultado.errors.username?.message).toBe("El nombre de usuario es obligatorio");
      expect(resultado.errors.password?.message).toBe("La contraseña es obligatoria");
    });

    it("devuelve los valores procesados cuando son válidos", async () => {
      const resolver = zodResolver(loginSchema);
      const resultado = await resolver({ username: "  admin ", password: "admin123" }, undefined, opciones);

      expect(resultado.errors).toEqual({});
      expect(resultado.values).toEqual({ username: "admin", password: "admin123" });
    });
  });
});
