import { z } from "zod";

export const loginSchema = z.object({
  email: z.preprocess(
    (value) => (typeof value === "string" ? value.trim().toLowerCase() : value),
    z.email("Introduce un correo válido"),
  ),
  password: z.string().min(1, "Introduce tu contraseña").max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;
