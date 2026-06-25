import { z } from "zod";

export const salarySchema = z.object({
  amountMinor: z.string().regex(/^[1-9]\d*$/, "Introduce un monto positivo"),
  frequency: z.enum(["WEEKLY", "MONTHLY"]),
  nextDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Usa formato AAAA-MM-DD"),
});

export type SalaryInput = z.infer<typeof salarySchema>;
export type Salary = SalaryInput & {
  id: string;
  paused: boolean;
  pausedAt: string | null;
};
