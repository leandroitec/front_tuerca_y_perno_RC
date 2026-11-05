import { z } from "zod";

/**
 * Schema Zod para el formulario de creación/edición de Producto.
 * Refleja el contrato del endpoint POST/PUT /api/productos/.
 */
export const productoSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(150, "El nombre no puede superar los 150 caracteres.")
    .trim(),

  precio: z
    .string({ required_error: "El precio es obligatorio." })
    .min(1, "El precio es obligatorio.")
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "El precio debe ser un número válido.",
    })
    .refine((val) => parseFloat(val) > 0, {
      message: "El precio debe ser mayor a 0.",
    }),

  stock: z
    .string({ required_error: "El stock es obligatorio." })
    .min(1, "El stock es obligatorio.")
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: "El stock debe ser un número entero.",
    })
    .refine((val) => parseInt(val, 10) >= 0, {
      message: "El stock no puede ser negativo.",
    })
    .refine((val) => Number.isInteger(parseFloat(val)), {
      message: "El stock debe ser un número entero (sin decimales).",
    }),

  categoria_id: z
    .string({ required_error: "La categoría es obligatoria." })
    .min(1, "La categoría es obligatoria.")
    .refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0, {
      message: "Seleccioná una categoría válida.",
    }),

  marca_id: z
    .string({ required_error: "La marca es obligatoria." })
    .min(1, "La marca es obligatoria.")
    .refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0, {
      message: "Seleccioná una marca válida.",
    }),

  descripcion: z
    .string()
    .max(500, "La descripción no puede superar los 500 caracteres.")
    .optional()
    .or(z.literal("")),
});

export type ProductoFormValues = z.infer<typeof productoSchema>;

/**
 * Errores devueltos por Django REST Framework en un HTTP 400.
 * Cada clave es un campo, con un array de mensajes de error.
 */
export type DjangoFieldErrors = Partial<
  Record<keyof ProductoFormValues | "non_field_errors" | "detail", string[]>
>;
