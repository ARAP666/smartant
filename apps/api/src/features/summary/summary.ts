import { calculateSpendableBalance } from "@smart-ant/finance";
import { z } from "zod";
import type { PrismaClient } from "../../generated/prisma/client.js";

export const summaryPeriodSchema = z
  .enum(["WEEKLY", "MONTHLY"])
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
  const { start, end } =
    period === "WEEKLY"
      ? weekBounds(referenceDate)
      : monthBounds(referenceDate);
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
