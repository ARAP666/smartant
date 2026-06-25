import { calculateSpendableBalance } from "@smart-ant/finance";
import { z } from "zod";
import type { PrismaClient } from "../../generated/prisma/client.js";

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .transform((value) => new Date(`${value}T00:00:00.000Z`));

export const pendingMovementSchema = z.object({
  amountMinor: z
    .string()
    .regex(/^[1-9]\d*$/)
    .transform((value) => BigInt(value)),
  date: dateSchema,
  description: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(80),
});

export type PendingMovementInput = z.infer<typeof pendingMovementSchema>;

export async function evaluatePendingMovement(
  database: PrismaClient,
  userId: string,
  input: PendingMovementInput,
) {
  const [pendingMovement, incomes, budgets, savingsGoals] =
    await database.$transaction([
      database.pendingMovement.create({
        data: { ...input, userId },
        select: pendingFields,
      }),
      database.income.findMany({
        where: { userId },
        select: { amountMinor: true },
      }),
      database.budget.findMany({
        where: { userId, active: true },
        select: { id: true, amountMinor: true, category: true },
      }),
      database.savingsGoal.findMany({
        where: { userId, active: true },
        select: { id: true, amountMinor: true },
      }),
    ]);
  const evaluation = calculateSpendableBalance({
    incomes,
    expenses: [{ amountMinor: input.amountMinor, category: input.category }],
    budgets,
    savingsGoals,
    category: input.category,
  });

  return {
    pendingMovement: toPendingDto(pendingMovement),
    evaluation: {
      baseBalance: evaluation.baseBalance.toString(),
      spendableBalance: evaluation.spendableBalance.toString(),
      margins: evaluation.margins.map((margin) => ({
        ...margin,
        amountMinor: margin.amountMinor.toString(),
      })),
    },
  };
}

const pendingFields = {
  id: true,
  amountMinor: true,
  date: true,
  description: true,
  category: true,
  status: true,
} as const;

function toPendingDto(pendingMovement: {
  id: string;
  amountMinor: bigint;
  date: Date;
  description: string;
  category: string;
  status: string;
}) {
  return {
    ...pendingMovement,
    amountMinor: pendingMovement.amountMinor.toString(),
    date: pendingMovement.date.toISOString().slice(0, 10),
  };
}
