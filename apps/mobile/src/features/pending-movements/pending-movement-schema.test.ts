import { describe, expect, it } from "vitest";
import { pendingMovementSchema } from "./pending-movement-schema";

describe("mobile pendingMovementSchema", () => {
  it("accepts a manual expense evaluation", () => {
    expect(
      pendingMovementSchema.parse({
        amountMinor: "12000",
        date: "2026-06-25",
        description: "Cena",
        category: "Comida",
      }),
    ).toEqual({
      amountMinor: "12000",
      date: "2026-06-25",
      description: "Cena",
      category: "Comida",
    });
  });

  it("rejects missing category", () => {
    expect(
      pendingMovementSchema.safeParse({
        amountMinor: "12000",
        date: "2026-06-25",
        description: "Cena",
        category: "",
      }).success,
    ).toBe(false);
  });
});
