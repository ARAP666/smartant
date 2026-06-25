import { z } from "zod";

export const registerSchema = z.object({
  email: z.preprocess(
    (value) => (typeof value === "string" ? value.trim().toLowerCase() : value),
    z.email("Introduce un correo válido"),
  ),
  password: z
    .string()
    .min(12, "Usa al menos 12 caracteres")
    .max(128, "Usa como máximo 128 caracteres"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
