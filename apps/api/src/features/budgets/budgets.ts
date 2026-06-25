import { z } from "zod";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors.js";

export const budgetSchema = z.object({
  amountMinor: z
    .string()
    .regex(/^[1-9]\d*$/)
    .transform((value) => BigInt(value)),
  period: z.enum(["WEEKLY", "MONTHLY"]),
  category: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .optional()
    .transform((value) => value || null),
  active: z.boolean().default(true),
});

export type BudgetInput = z.infer<typeof budgetSchema>;

export async function listBudgets(database: PrismaClient, userId: string) {
  const budgets = await database.budget.findMany({
    where: { userId },
    orderBy: [{ active: "desc" }, { period: "asc" }, { category: "asc" }],
    select: fields,
  });

  return { budgets: budgets.map(toDto) };
}

export async function createBudget(
  database: PrismaClient,
  userId: string,
  input: BudgetInput,
) {
  await assertNoDuplicate(database, userId, input);
  const budget = await database.budget.create({
    data: { ...input, userId },
    select: fields,
  });

  return { budget: toDto(budget) };
}

export async function updateBudget(
  database: PrismaClient,
  userId: string,
  id: string,
  input: BudgetInput,
) {
  await assertNoDuplicate(database, userId, input, id);
  const result = await database.budget.updateMany({
    where: { id, userId },
    data: input,
  });
  if (result.count === 0) throw notFound();

  const budget = await database.budget.findFirstOrThrow({
    where: { id, userId },
    select: fields,
  });
  return { budget: toDto(budget) };
}

export async function deleteBudget(
  database: PrismaClient,
  userId: string,
  id: string,
) {
  const result = await database.budget.deleteMany({ where: { id, userId } });
  if (result.count === 0) throw notFound();
}

const fields = {
  id: true,
  amountMinor: true,
  period: true,
  category: true,
  active: true,
} as const;

async function assertNoDuplicate(
  database: PrismaClient,
  userId: string,
  input: BudgetInput,
  exceptId?: string,
) {
  if (!input.active) return;
  const duplicate = await database.budget.findFirst({
    where: {
      userId,
      active: true,
      period: input.period,
      category: input.category,
      id: exceptId ? { not: exceptId } : undefined,
    },
    select: { id: true },
  });
  if (duplicate) {
    throw new AppError(409, "BUDGET_CONFLICT", "Budget already exists");
  }
}

function toDto(budget: {
  id: string;
  amountMinor: bigint;
  period: string;
  category: string | null;
  active: boolean;
}) {
  return {
    ...budget,
    amountMinor: budget.amountMinor.toString(),
  };
}

function notFound() {
  return new AppError(404, "BUDGET_NOT_FOUND", "Budget not found");
}
