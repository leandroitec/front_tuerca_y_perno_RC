import { describe, it, expect } from "vitest";
import { productoSchema } from "@/lib/validations/producto";

/** Producto válido de referencia (el formulario trabaja con strings). */
const productoValido = {
  nombre: "Taladro Percutor 750W",
  precio: "85000.00",
  stock: "15",
  categoria_id: "3",
  marca_id: "2",
  descripcion: "Taladro percutor eléctrico de 750W.",
};

/** Agrupa los mensajes de error por campo. */
function erroresPorCampo(data: unknown): Record<string, string[]> {
  const resultado = productoSchema.safeParse(data);
  if (resultado.success) return {};
  return resultado.error.issues.reduce<Record<string, string[]>>((acc, issue) => {
    const campo = String(issue.path[0]);
    (acc[campo] ??= []).push(issue.message);
    return acc;
  }, {});
}

describe("Test 2 · productoSchema (Zod)", () => {
  it("acepta un producto válido (caso de control)", () => {
    expect(productoSchema.safeParse(productoValido).success).toBe(true);
  });

  describe("precio negativo", () => {
    it("falla con un precio negativo", () => {
      const resultado = productoSchema.safeParse({ ...productoValido, precio: "-500" });

      expect(resultado.success).toBe(false);
      expect(erroresPorCampo({ ...productoValido, precio: "-500" }).precio).toContain(
        "El precio debe ser mayor a 0."
      );
    });

    it("falla también con precio cero", () => {
      expect(erroresPorCampo({ ...productoValido, precio: "0" }).precio).toContain(
        "El precio debe ser mayor a 0."
      );
    });

    it("el error queda sólo en el campo precio", () => {
      expect(Object.keys(erroresPorCampo({ ...productoValido, precio: "-1" }))).toEqual(["precio"]);
    });
  });

  describe("campos vacíos", () => {
    const vacio = {
      nombre: "",
      precio: "",
      stock: "",
      categoria_id: "",
      marca_id: "",
      descripcion: "",
    };

    it("falla con todos los campos vacíos", () => {
      expect(productoSchema.safeParse(vacio).success).toBe(false);
    });

    it("reporta error en cada campo obligatorio y no en la descripción (opcional)", () => {
      const errores = erroresPorCampo(vacio);

      expect(Object.keys(errores).sort()).toEqual(
        ["categoria_id", "marca_id", "nombre", "precio", "stock"].sort()
      );
      expect(errores.descripcion).toBeUndefined();
    });

    it("muestra el mensaje de obligatorio de cada campo", () => {
      const errores = erroresPorCampo(vacio);

      expect(errores.nombre).toContain("El nombre debe tener al menos 2 caracteres.");
      expect(errores.precio).toContain("El precio es obligatorio.");
      expect(errores.stock).toContain("El stock es obligatorio.");
      expect(errores.categoria_id).toContain("La categoría es obligatoria.");
      expect(errores.marca_id).toContain("La marca es obligatoria.");
    });

    it("falla si los campos directamente no se envían", () => {
      const errores = erroresPorCampo({});

      expect(errores.precio).toContain("El precio es obligatorio.");
      expect(errores.nombre).toContain("El nombre es obligatorio.");
    });
  });
});
