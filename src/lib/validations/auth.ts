import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    // trim antes de min: un usuario de sólo espacios queda vacío y se rechaza
    .trim()
    .min(1, "El nombre de usuario es obligatorio"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
