import { describe, expect, it } from "vitest";
import { budgetSchema } from "./budgets.js";

describe("budgetSchema", () => {
  it("parses valid budget input", () => {
    expect(
      budgetSchema.parse({
        amountMinor: "50000",
        period: "MONTHLY",
        category: "Comida",
        active: true,
      }),
    ).toEqual({
      amountMinor: 50000n,
      period: "MONTHLY",
      category: "Comida",
      active: true,
    });
  });

  it("rejects invalid budget input", () => {
    expect(
      budgetSchema.safeParse({
        amountMinor: "0",
        period: "YEARLY",
      }).success,
    ).toBe(false);
  });
});
