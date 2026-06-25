import { z } from "zod";

export const pendingMovementSchema = z.object({
  amountMinor: z.string().regex(/^[1-9]\d*$/, "Introduce un monto positivo"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Usa formato AAAA-MM-DD"),
  description: z.string().trim().min(1, "Describe el gasto").max(120),
  category: z.string().trim().min(1, "Indica la categoria").max(80),
});

export type PendingMovementInput = z.infer<typeof pendingMovementSchema>;

export type PendingMovementEvaluation = {
  pendingMovement: PendingMovementInput & { id: string; status: string };
  evaluation: {
    baseBalance: string;
    spendableBalance: string;
    margins: Array<{ kind: string; amountMinor: string }>;
    alerts?: Array<{
      severity: string;
      rule: string;
      amountMinor: string;
      spendableBalance: string;
    }>;
  };
};

export type ConfirmedExpense = PendingMovementInput & {
  id: string;
  pendingMovementId: string;
};
