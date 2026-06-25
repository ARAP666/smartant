import { describe, expect, it } from "vitest";
import { savingsGoalSchema } from "./savings-goal-schema";

describe("mobile savingsGoalSchema", () => {
  it("accepts a monthly savings goal", () => {
    expect(
      savingsGoalSchema.parse({
        amountMinor: "75000",
        period: "MONTHLY",
        active: true,
      }),
    ).toEqual({ amountMinor: "75000", period: "MONTHLY", active: true });
  });

  it("rejects invalid amount", () => {
    expect(
      savingsGoalSchema.safeParse({ amountMinor: "0", period: "MONTHLY" })
        .success,
    ).toBe(false);
  });
});
