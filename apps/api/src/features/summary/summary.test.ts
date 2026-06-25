import { describe, expect, it } from "vitest";
import { getFinancialSummary } from "./summary.js";

describe("getFinancialSummary", () => {
  it("calculates a monthly summary for one user", async () => {
    const database = {
      $transaction: async (queries: unknown[]) => Promise.all(queries),
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
        new Date("2026-06-25T12:00:00.000Z"),
      ),
    ).resolves.toEqual({
      summary: {
        period: { kind: "MONTHLY", start: "2026-06-01", end: "2026-06-30" },
        incomeTotal: "100000",
        expenseTotal: "25000",
        savingsGoalTotal: "10000",
        budgetTotal: "50000",
        spendableBalance: "25000",
        empty: false,
      },
    });
  });
});
