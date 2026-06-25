import {
  calculateSpendableBalance,
  createFinancialAlerts,
} from "@smart-ant/finance";
import { z } from "zod";
import type { PrismaClient } from "../../generated/prisma/client.js";

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .transform((value) => new Date(`${value}T00:00:00.000Z`));

const importRowSchema = z.object({
  rowId: z.string().trim().min(1).max(80),
  amountMinor: z
    .string()
    .regex(/^[1-9]\d*$/)
    .transform((value) => BigInt(value)),
  date: dateSchema,
  description: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(80),
});

export const importConfirmationSchema = z.object({
  idempotencyKey: z.string().trim().min(8).max(120),
  rows: z.array(importRowSchema).min(1).max(100),
});

export type ImportConfirmationInput = z.infer<typeof importConfirmationSchema>;

type ImportRowResult = {
  rowId: string;
  status: "CREATED" | "SKIPPED";
  expenseId?: string;
  alertSeverity?: string;
  reason?: string;
};

export async function confirmImport(
  database: PrismaClient,
  userId: string,
  input: ImportConfirmationInput,
) {
  return database.$transaction(async (transaction) => {
    const [incomes, existingExpenses, budgets, savingsGoals] =
      await Promise.all([
        transaction.income.findMany({
          where: { userId },
          select: { amountMinor: true },
        }),
        transaction.expense.findMany({
          where: { userId },
          select: { amountMinor: true, category: true },
        }),
        transaction.budget.findMany({
          where: { userId, active: true },
          select: { id: true, amountMinor: true, category: true },
        }),
        transaction.savingsGoal.findMany({
          where: { userId, active: true },
          select: { id: true, amountMinor: true },
        }),
      ]);
    const expenses = [...existingExpenses];
    const rows: ImportRowResult[] = [];

    for (const row of input.rows) {
      const idempotencyKey = `${input.idempotencyKey}:${row.rowId}`;
      const existing = await transaction.expense.findUnique({
        where: { idempotencyKey },
        select: { id: true, userId: true },
      });

      if (existing) {
        rows.push({
          rowId: row.rowId,
          status: "SKIPPED",
          expenseId: existing.userId === userId ? existing.id : undefined,
          reason: "Duplicate idempotency key",
        });
        continue;
      }

      const evaluation = calculateSpendableBalance({
        incomes,
        expenses: [
          ...expenses,
          { amountMinor: row.amountMinor, category: row.category },
        ],
        budgets,
        savingsGoals,
        category: row.category,
      });
      const alerts = createFinancialAlerts({
        spendableBalance: evaluation.spendableBalance,
        expenseAmountMinor: row.amountMinor,
        margins: evaluation.margins,
      });
      const pendingMovement = await transaction.pendingMovement.create({
        data: {
          userId,
          amountMinor: row.amountMinor,
          date: row.date,
          description: row.description,
          category: row.category,
          status: "CONFIRMED",
        },
        select: { id: true },
      });
      const expense = await transaction.expense.create({
        data: {
          userId,
          pendingMovementId: pendingMovement.id,
          idempotencyKey,
          amountMinor: row.amountMinor,
          date: row.date,
          description: row.description,
          category: row.category,
        },
        select: { id: true },
      });

      expenses.push({ amountMinor: row.amountMinor, category: row.category });
      rows.push({
        rowId: row.rowId,
        status: "CREATED",
        expenseId: expense.id,
        alertSeverity: alerts[0]?.severity,
      });
    }

    return {
      created: rows.filter((row) => row.status === "CREATED").length,
      skipped: rows.filter((row) => row.status === "SKIPPED").length,
      failed: 0,
      rows,
    };
  });
}
