import { describe, expect, it } from "vitest";
import { salarySchema } from "./salary.js";

describe("salarySchema", () => {
  it("parses valid salary input", () => {
    expect(
      salarySchema.parse({
        amountMinor: "150000",
        frequency: "MONTHLY",
        nextDate: "2026-06-30",
      }),
    ).toEqual({
      amountMinor: 150000n,
      frequency: "MONTHLY",
      nextDate: new Date("2026-06-30T00:00:00.000Z"),
    });
  });

  it("rejects invalid salary input", () => {
    expect(
      salarySchema.safeParse({
        amountMinor: "0",
        frequency: "DAILY",
        nextDate: "bad",
      }).success,
    ).toBe(false);
  });
});
