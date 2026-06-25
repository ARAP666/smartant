import { z } from "zod";

export const profileSchema = z.object({
  currency: z
    .string()
    .trim()
    .regex(/^[A-Z]{3}$/, "Usa una moneda ISO de 3 letras"),
  timeZone: z.string().trim().min(1, "Introduce una zona horaria IANA"),
});

export type ProfileInput = z.infer<typeof profileSchema>;
