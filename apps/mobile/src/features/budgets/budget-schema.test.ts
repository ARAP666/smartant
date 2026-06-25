import { describe, expect, it } from "vitest";
import { budgetSchema } from "./budget-schema";

describe("mobile budgetSchema", () => {
  it("accepts a category budget", () => {
    expect(
      budgetSchema.parse({
        amountMinor: "50000",
        period: "MONTHLY",
        category: "Comida",
        active: true,
      }),
    ).toEqual({
      amountMinor: "50000",
      period: "MONTHLY",
      category: "Comida",
      active: true,
    });
  });

  it("rejects invalid amount", () => {
    expect(
      budgetSchema.safeParse({ amountMinor: "0", period: "MONTHLY" }).success,
    ).toBe(false);
  });
});
