import { z } from "zod";

export const incomeSchema = z.object({
  amountMinor: z.string().regex(/^[1-9]\d*$/, "Introduce un monto positivo"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Usa formato AAAA-MM-DD"),
  description: z.string().trim().min(1, "Describe el ingreso").max(120),
});

export type IncomeInput = z.infer<typeof incomeSchema>;
export type Income = IncomeInput & { id: string };
