import { describe, expect, it } from "vitest";
import { incomeSchema } from "./incomes.js";

describe("incomeSchema", () => {
  it("parses valid income input", () => {
    expect(
      incomeSchema.parse({
        amountMinor: "150000",
        date: "2026-06-25",
        description: "Salario",
      }),
    ).toEqual({
      amountMinor: 150000n,
      date: new Date("2026-06-25T00:00:00.000Z"),
      description: "Salario",
    });
  });

  it("rejects invalid amount and date", () => {
    expect(
      incomeSchema.safeParse({
        amountMinor: "0",
        date: "25/06/2026",
        description: "",
      }).success,
    ).toBe(false);
  });
});
