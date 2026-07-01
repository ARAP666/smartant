import { calculateSpendableBalance } from "@smart-ant/finance";
import { z } from "zod";
import type { PrismaClient } from "../../generated/prisma/client.js";

export const summaryPeriodSchema = z
  .enum(["DAILY", "WEEKLY", "MONTHLY"])
  .default("MONTHLY");
export type SummaryPeriod = z.infer<typeof summaryPeriodSchema>;

export async function getFinancialSummary(
  database: PrismaClient,
  userId: string,
  period: SummaryPeriod = "MONTHLY",
  referenceDate = new Date(),
) {
  const user = await database.user.findUnique({
    where: { id: userId },
    select: { timeZone: true },
  });
  const { start, end } = periodBounds(period, referenceDate);
  const [incomes, expenses, budgets, savingsGoals] =
    await database.$transaction([
      database.income.findMany({
        where: { userId, date: { gte: start, lt: end } },
        select: { amountMinor: true },
      }),
      database.expense.findMany({
        where: { userId, date: { gte: start, lt: end } },
        select: { amountMinor: true, category: true },
      }),
      database.budget.findMany({
        where: { userId, period, active: true },
        select: { id: true, amountMinor: true, category: true },
      }),
      database.savingsGoal.findMany({
        where: { userId, period, active: true },
        select: { id: true, amountMinor: true },
      }),
    ]);
  const calculation = calculateSpendableBalance({
    incomes,
    expenses,
    budgets,
    savingsGoals,
  });

  return {
    summary: {
      period: {
        kind: period,
        start: start.toISOString().slice(0, 10),
        end: new Date(end.getTime() - 1).toISOString().slice(0, 10),
        timeZone: user?.timeZone ?? "UTC",
      },
      incomeTotal: calculation.incomeTotal.toString(),
      expenseTotal: calculation.expenseTotal.toString(),
      savingsGoalTotal: savingsGoals
        .reduce((total, goal) => total + goal.amountMinor, 0n)
        .toString(),
      budgetTotal: budgets
        .reduce((total, budget) => total + budget.amountMinor, 0n)
        .toString(),
      spendableBalance: calculation.spendableBalance.toString(),
      empty:
        incomes.length === 0 &&
        expenses.length === 0 &&
        budgets.length === 0 &&
        savingsGoals.length === 0,
    },
  };
}

export async function getExpenseCategoryDistribution(
  database: PrismaClient,
  userId: string,
  period: SummaryPeriod = "MONTHLY",
  referenceDate = new Date(),
) {
  const { start, end } = periodBounds(period, referenceDate);
  const expenses = await database.expense.findMany({
    where: { userId, date: { gte: start, lt: end } },
    select: { amountMinor: true, category: true },
  });
  const total = expenses.reduce(
    (sum, expense) => sum + expense.amountMinor,
    0n,
  );
  const byCategory = new Map<string, bigint>();
  for (const expense of expenses) {
    byCategory.set(
      expense.category,
      (byCategory.get(expense.category) ?? 0n) + expense.amountMinor,
    );
  }

  return {
    categories: [...byCategory.entries()]
      .map(([category, amountMinor]) => ({
        category,
        amountMinor: amountMinor.toString(),
        percentage:
          total === 0n ? 0 : Number((amountMinor * 10000n) / total) / 100,
      }))
      .sort(
        (left, right) => Number(right.amountMinor) - Number(left.amountMinor),
      ),
    totalExpenseMinor: total.toString(),
  };
}

function monthBounds(referenceDate: Date) {
  const start = new Date(
    Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), 1),
  );
  const end = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth() + 1,
      1,
    ),
  );
  return { start, end };
}

function dayBounds(referenceDate: Date) {
  const start = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate(),
    ),
  );
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 1);
  return { start, end };
}

function periodBounds(period: SummaryPeriod, referenceDate: Date) {
  if (period === "DAILY") return dayBounds(referenceDate);
  return period === "WEEKLY"
    ? weekBounds(referenceDate)
    : monthBounds(referenceDate);
}

function weekBounds(referenceDate: Date) {
  const day = referenceDate.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const start = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate() + mondayOffset,
    ),
  );
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 7);
  return { start, end };
}
