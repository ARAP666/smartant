import { describe, expect, it } from "vitest";
import { incomeSchema } from "./income-schema";

describe("mobile incomeSchema", () => {
  it("accepts valid income input", () => {
    expect(
      incomeSchema.parse({
        amountMinor: "150000",
        date: "2026-06-25",
        description: "Salario",
      }),
    ).toEqual({
      amountMinor: "150000",
      date: "2026-06-25",
      description: "Salario",
    });
  });

  it("rejects invalid amount", () => {
    expect(
      incomeSchema.safeParse({
        amountMinor: "-1",
        date: "2026-06-25",
        description: "Salario",
      }).success,
    ).toBe(false);
  });
});
