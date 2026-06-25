import { z } from "zod";

export const budgetSchema = z.object({
  amountMinor: z.string().regex(/^[1-9]\d*$/, "Introduce un monto positivo"),
  period: z.enum(["WEEKLY", "MONTHLY"]),
  category: z.string().trim().max(80).optional(),
  active: z.boolean().default(true),
});

export type BudgetInput = z.infer<typeof budgetSchema>;
export type Budget = BudgetInput & { id: string; category: string | null };
