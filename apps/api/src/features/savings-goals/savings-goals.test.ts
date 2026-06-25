import { describe, expect, it } from "vitest";
import { savingsGoalSchema } from "./savings-goals.js";

describe("savingsGoalSchema", () => {
  it("parses valid savings goal input", () => {
    expect(
      savingsGoalSchema.parse({
        amountMinor: "75000",
        period: "MONTHLY",
        active: true,
      }),
    ).toEqual({
      amountMinor: 75000n,
      period: "MONTHLY",
      active: true,
    });
  });

  it("rejects invalid savings goal input", () => {
    expect(
      savingsGoalSchema.safeParse({ amountMinor: "0", period: "YEARLY" })
        .success,
    ).toBe(false);
  });
});
