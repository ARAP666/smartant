import { z } from "zod";

export const savingsGoalSchema = z.object({
  amountMinor: z.string().regex(/^[1-9]\d*$/, "Introduce un monto positivo"),
  period: z.enum(["WEEKLY", "MONTHLY"]),
  active: z.boolean().default(true),
});

export type SavingsGoalInput = z.infer<typeof savingsGoalSchema>;
export type SavingsGoal = SavingsGoalInput & { id: string };
