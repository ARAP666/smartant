import { z } from "zod";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors.js";

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .transform((value) => new Date(`${value}T00:00:00.000Z`));

export const salarySchema = z.object({
  amountMinor: z
    .string()
    .regex(/^[1-9]\d*$/)
    .transform((value) => BigInt(value)),
  frequency: z.enum(["WEEKLY", "MONTHLY"]),
  nextDate: dateSchema,
});

export const salaryGenerationSchema = z.object({
  date: dateSchema.optional(),
});

export type SalaryInput = z.infer<typeof salarySchema>;
export type SalaryGenerationInput = z.infer<typeof salaryGenerationSchema>;

export async function getSalary(database: PrismaClient, userId: string) {
  const salary = await database.salary.findUnique({
    where: { userId },
    select: fields,
  });

  return { salary: salary ? toDto(salary) : null };
}

export async function upsertSalary(
  database: PrismaClient,
  userId: string,
  input: SalaryInput,
) {
  const salary = await database.salary.upsert({
    where: { userId },
    create: { ...input, userId },
    update: { ...input, pausedAt: null },
    select: fields,
  });

  return { salary: toDto(salary) };
}

export async function pauseSalary(
  database: PrismaClient,
  userId: string,
  paused: boolean,
) {
  const salary = await database.salary.update({
    where: { userId },
    data: { pausedAt: paused ? new Date() : null },
    select: fields,
  });

  return { salary: toDto(salary) };
}

export async function deleteSalary(database: PrismaClient, userId: string) {
  const result = await database.salary.deleteMany({ where: { userId } });
  if (result.count === 0) throw notFound();
}

export async function generateSalaryIncome(
  database: PrismaClient,
  userId: string,
  input: SalaryGenerationInput,
) {
  return database.$transaction(async (transaction) => {
    const salary = await transaction.salary.findUnique({
      where: { userId },
      select: fields,
    });
    if (!salary) throw notFound();
    if (salary.pausedAt) {
      throw new AppError(409, "SALARY_PAUSED", "Salary is paused");
    }

    const date = input.date ?? salary.nextDate;
    const periodKey = `${salary.frequency}:${date.toISOString().slice(0, 10)}`;
    const existingRun = await transaction.salaryRun.findUnique({
      where: { salaryId_periodKey: { salaryId: salary.id, periodKey } },
      select: { income: { select: incomeFields } },
    });
    if (existingRun) {
      return { income: toIncomeDto(existingRun.income), generated: false };
    }

    const income = await transaction.income.create({
      data: {
        userId,
        amountMinor: salary.amountMinor,
        date,
        description: "Salario",
      },
      select: incomeFields,
    });
    await transaction.salaryRun.create({
      data: { salaryId: salary.id, incomeId: income.id, periodKey },
    });
    if (date >= salary.nextDate) {
      await transaction.salary.update({
        where: { id: salary.id },
        data: { nextDate: nextDate(date, salary.frequency) },
      });
    }

    return { income: toIncomeDto(income), generated: true };
  });
}

const fields = {
  id: true,
  amountMinor: true,
  frequency: true,
  nextDate: true,
  pausedAt: true,
} as const;

const incomeFields = {
  id: true,
  amountMinor: true,
  date: true,
  description: true,
} as const;

function toDto(salary: {
  id: string;
  amountMinor: bigint;
  frequency: string;
  nextDate: Date;
  pausedAt: Date | null;
}) {
  return {
    ...salary,
    amountMinor: salary.amountMinor.toString(),
    nextDate: salary.nextDate.toISOString().slice(0, 10),
    paused: Boolean(salary.pausedAt),
  };
}

function toIncomeDto(income: {
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

function nextDate(date: Date, frequency: string) {
  const next = new Date(date);
  if (frequency === "WEEKLY") next.setUTCDate(next.getUTCDate() + 7);
  else next.setUTCMonth(next.getUTCMonth() + 1);
  return next;
}

function notFound() {
  return new AppError(404, "SALARY_NOT_FOUND", "Salary not found");
}
