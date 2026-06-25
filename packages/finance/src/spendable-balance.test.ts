import { describe, expect, it } from "vitest";
import { calculateSpendableBalance } from "./index";

describe("calculateSpendableBalance", () => {
  it("uses the most conservative margin without going below zero", () => {
    const result = calculateSpendableBalance({
      incomes: [{ amountMinor: 200_000n }],
      expenses: [{ amountMinor: 50_000n, category: "Comida" }],
      budgets: [
        { id: "general", amountMinor: 120_000n },
        { id: "food", amountMinor: 40_000n, category: "Comida" },
      ],
      savingsGoals: [{ id: "goal", amountMinor: 75_000n }],
      category: "Comida",
    });

    expect(result.baseBalance).toBe(150_000n);
    expect(result.spendableBalance).toBe(0n);
  });

  it("applies only general and matching category budgets", () => {
    const result = calculateSpendableBalance({
      incomes: [{ amountMinor: 200_000n }],
      expenses: [
        { amountMinor: 20_000n, category: "Comida" },
        { amountMinor: 30_000n, category: "Transporte" },
      ],
      budgets: [
        { id: "general", amountMinor: 180_000n },
        { id: "food", amountMinor: 90_000n, category: "Comida" },
        { id: "transport", amountMinor: 10_000n, category: "Transporte" },
      ],
      savingsGoals: [],
      category: "Comida",
    });

    expect(result.margins.map((margin) => margin.id).filter(Boolean)).toEqual([
      "general",
      "food",
    ]);
    expect(result.spendableBalance).toBe(70_000n);
  });
});
