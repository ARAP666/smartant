import { describe, expect, it } from "vitest";
import {
  getExpenseCategoryDistribution,
  getFinancialSummary,
} from "./summary.js";

describe("getFinancialSummary", () => {
  it("calculates a monthly summary for one user", async () => {
    const database = {
      $transaction: async (queries: unknown[]) => Promise.all(queries),
      user: {
        findUnique: async () => ({ timeZone: "America/Costa_Rica" }),
      },
      income: {
        findMany: async () => [{ amountMinor: 100000n }],
      },
      expense: {
        findMany: async () => [{ amountMinor: 25000n, category: "Comida" }],
      },
      budget: {
        findMany: async () => [
          { id: "budget-id", amountMinor: 50000n, category: null },
        ],
      },
      savingsGoal: {
        findMany: async () => [{ id: "goal-id", amountMinor: 10000n }],
      },
    };

    await expect(
      getFinancialSummary(
        database as never,
        "user-id",
        "MONTHLY",
        new Date("2026-06-25T12:00:00.000Z"),
      ),
    ).resolves.toEqual({
      summary: {
        period: {
          kind: "MONTHLY",
          start: "2026-06-01",
          end: "2026-06-30",
          timeZone: "America/Costa_Rica",
        },
        incomeTotal: "100000",
        expenseTotal: "25000",
        savingsGoalTotal: "10000",
        budgetTotal: "50000",
        spendableBalance: "25000",
        empty: false,
      },
    });
  });

  it("calculates weekly bounds", async () => {
    const database = {
      $transaction: async (queries: unknown[]) => Promise.all(queries),
      user: { findUnique: async () => ({ timeZone: "UTC" }) },
      income: { findMany: async () => [] },
      expense: { findMany: async () => [] },
      budget: { findMany: async () => [] },
      savingsGoal: { findMany: async () => [] },
    };

    await expect(
      getFinancialSummary(
        database as never,
        "user-id",
        "WEEKLY",
        new Date("2026-06-25T12:00:00.000Z"),
      ),
    ).resolves.toMatchObject({
      summary: {
        period: { kind: "WEEKLY", start: "2026-06-22", end: "2026-06-28" },
        empty: true,
      },
    });
  });

  it("groups expenses by category", async () => {
    const database = {
      expense: {
        findMany: async () => [
          { amountMinor: 7500n, category: "Comida" },
          { amountMinor: 2500n, category: "Transporte" },
        ],
      },
    };

    await expect(
      getExpenseCategoryDistribution(
        database as never,
        "user-id",
        "MONTHLY",
        new Date("2026-06-25T12:00:00.000Z"),
      ),
    ).resolves.toEqual({
      categories: [
        { category: "Comida", amountMinor: "7500", percentage: 75 },
        { category: "Transporte", amountMinor: "2500", percentage: 25 },
      ],
      totalExpenseMinor: "10000",
    });
  });
});
