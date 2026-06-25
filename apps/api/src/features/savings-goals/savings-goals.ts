import { z } from "zod";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors.js";

export const savingsGoalSchema = z.object({
  amountMinor: z
    .string()
    .regex(/^[1-9]\d*$/)
    .transform((value) => BigInt(value)),
  period: z.enum(["WEEKLY", "MONTHLY"]),
  active: z.boolean().default(true),
});

export type SavingsGoalInput = z.infer<typeof savingsGoalSchema>;

export async function listSavingsGoals(database: PrismaClient, userId: string) {
  const goals = await database.savingsGoal.findMany({
    where: { userId },
    orderBy: [{ active: "desc" }, { period: "asc" }, { createdAt: "desc" }],
    select: fields,
  });

  return { savingsGoals: goals.map(toDto) };
}

export async function createSavingsGoal(
  database: PrismaClient,
  userId: string,
  input: SavingsGoalInput,
) {
  const goal = await database.savingsGoal.create({
    data: { ...input, userId },
    select: fields,
  });

  return { savingsGoal: toDto(goal) };
}

export async function updateSavingsGoal(
  database: PrismaClient,
  userId: string,
  id: string,
  input: SavingsGoalInput,
) {
  const result = await database.savingsGoal.updateMany({
    where: { id, userId },
    data: input,
  });
  if (result.count === 0) throw notFound();

  const goal = await database.savingsGoal.findFirstOrThrow({
    where: { id, userId },
    select: fields,
  });
  return { savingsGoal: toDto(goal) };
}

export async function deleteSavingsGoal(
  database: PrismaClient,
  userId: string,
  id: string,
) {
  const result = await database.savingsGoal.deleteMany({
    where: { id, userId },
  });
  if (result.count === 0) throw notFound();
}

const fields = {
  id: true,
  amountMinor: true,
  period: true,
  active: true,
} as const;

function toDto(goal: {
  id: string;
  amountMinor: bigint;
  period: string;
  active: boolean;
}) {
  return { ...goal, amountMinor: goal.amountMinor.toString() };
}

function notFound() {
  return new AppError(404, "SAVINGS_GOAL_NOT_FOUND", "Savings goal not found");
}
