import { describe, expect, it } from "vitest";
import { salarySchema } from "./salary-schema";

describe("mobile salarySchema", () => {
  it("accepts monthly salary input", () => {
    expect(
      salarySchema.parse({
        amountMinor: "150000",
        frequency: "MONTHLY",
        nextDate: "2026-06-30",
      }),
    ).toEqual({
      amountMinor: "150000",
      frequency: "MONTHLY",
      nextDate: "2026-06-30",
    });
  });

  it("rejects invalid frequency", () => {
    expect(
      salarySchema.safeParse({
        amountMinor: "150000",
        frequency: "DAILY",
        nextDate: "2026-06-30",
      }).success,
    ).toBe(false);
  });
});
