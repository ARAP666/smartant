import { z } from "zod";
import type { PrismaClient } from "../../generated/prisma/client.js";

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .optional()
  .transform((value) => (value ? new Date(`${value}T00:00:00.000Z`) : value));

export const historyQuerySchema = z.object({
  from: dateSchema,
  to: dateSchema,
  category: z.string().trim().min(1).max(80).optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type HistoryQuery = z.infer<typeof historyQuerySchema>;

export async function listMovementHistory(
  database: PrismaClient,
  userId: string,
  query: HistoryQuery,
) {
  const date = {
    ...(query.from ? { gte: query.from } : {}),
    ...(query.to ? { lte: query.to } : {}),
  };
  const includeIncomes =
    (!query.type || query.type === "INCOME") && !query.category;
  const includeExpenses = !query.type || query.type === "EXPENSE";
  const [incomes, expenses] = await Promise.all([
    includeIncomes
      ? database.income.findMany({
          where: { userId, date },
          select: incomeFields,
        })
      : Promise.resolve([]),
    includeExpenses
      ? database.expense.findMany({
          where: {
            userId,
            date,
            ...(query.category ? { category: query.category } : {}),
          },
          select: expenseFields,
        })
      : Promise.resolve([]),
  ]);
  const movements = [
    ...incomes.map((income) => ({
      ...toMovement(income),
      type: "INCOME" as const,
      category: null,
    })),
    ...expenses.map((expense) => ({
      ...toMovement(expense),
      type: "EXPENSE" as const,
      category: expense.category,
    })),
  ].sort((left, right) =>
    right.date === left.date
      ? right.id.localeCompare(left.id)
      : right.date.localeCompare(left.date),
  );

  return {
    movements: movements.slice(query.offset, query.offset + query.limit),
    page: {
      offset: query.offset,
      limit: query.limit,
      total: movements.length,
      nextOffset:
        query.offset + query.limit < movements.length
          ? query.offset + query.limit
          : null,
    },
  };
}

const incomeFields = {
  id: true,
  amountMinor: true,
  date: true,
  description: true,
} as const;

const expenseFields = {
  id: true,
  amountMinor: true,
  date: true,
  description: true,
  category: true,
} as const;

function toMovement(movement: {
  id: string;
  amountMinor: bigint;
  date: Date;
  description: string;
}) {
  return {
    id: movement.id,
    amountMinor: movement.amountMinor.toString(),
    date: movement.date.toISOString().slice(0, 10),
    description: movement.description,
  };
}
