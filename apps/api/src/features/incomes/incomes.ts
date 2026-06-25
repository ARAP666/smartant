import { z } from "zod";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors.js";

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .transform((value) => new Date(`${value}T00:00:00.000Z`));

export const incomeSchema = z.object({
  amountMinor: z
    .string()
    .regex(/^[1-9]\d*$/)
    .transform((value) => BigInt(value)),
  date: dateSchema,
  description: z.string().trim().min(1).max(120),
});

export type IncomeInput = z.infer<typeof incomeSchema>;

export async function listIncomes(database: PrismaClient, userId: string) {
  const incomes = await database.income.findMany({
    where: { userId },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    select: fields,
  });

  return { incomes: incomes.map(toDto) };
}

export async function createIncome(
  database: PrismaClient,
  userId: string,
  input: IncomeInput,
) {
  const income = await database.income.create({
    data: { ...input, userId },
    select: fields,
  });

  return { income: toDto(income) };
}

export async function updateIncome(
  database: PrismaClient,
  userId: string,
  id: string,
  input: IncomeInput,
) {
  const result = await database.income.updateMany({
    where: { id, userId },
    data: input,
  });
  if (result.count === 0) throw notFound();

  const income = await database.income.findFirstOrThrow({
    where: { id, userId },
    select: fields,
  });
  return { income: toDto(income) };
}

export async function deleteIncome(
  database: PrismaClient,
  userId: string,
  id: string,
) {
  const result = await database.income.deleteMany({ where: { id, userId } });
  if (result.count === 0) throw notFound();
}

const fields = {
  id: true,
  amountMinor: true,
  date: true,
  description: true,
} as const;

function toDto(income: {
  id: string;
  amountMinor: bigint;
  date: Date;
  description: string;
}) {
  return {
    ...income,
    amountMinor: income.amountMinor.toString(),
    date: income.date.toISOString().slice(0, 10),
  };
}

function notFound() {
  return new AppError(404, "INCOME_NOT_FOUND", "Income not found");
}
