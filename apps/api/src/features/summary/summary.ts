import { calculateSpendableBalance } from "@smart-ant/finance";
import type { PrismaClient } from "../../generated/prisma/client.js";

export async function getFinancialSummary(
  database: PrismaClient,
  userId: string,
  referenceDate = new Date(),
) {
  const { start, end } = monthBounds(referenceDate);
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
        where: { userId, period: "MONTHLY", active: true },
        select: { id: true, amountMinor: true, category: true },
      }),
      database.savingsGoal.findMany({
        where: { userId, period: "MONTHLY", active: true },
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
        kind: "MONTHLY",
        start: start.toISOString().slice(0, 10),
        end: new Date(end.getTime() - 1).toISOString().slice(0, 10),
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
