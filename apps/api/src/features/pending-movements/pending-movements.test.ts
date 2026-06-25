import { describe, expect, it } from "vitest";
import { pendingMovementSchema } from "./pending-movements.js";

describe("pendingMovementSchema", () => {
  it("parses valid pending movement input", () => {
    expect(
      pendingMovementSchema.parse({
        amountMinor: "12000",
        date: "2026-06-25",
        description: "Cena",
        category: "Comida",
      }),
    ).toEqual({
      amountMinor: 12000n,
      date: new Date("2026-06-25T00:00:00.000Z"),
      description: "Cena",
      category: "Comida",
    });
  });

  it("rejects invalid pending movement input", () => {
    expect(
      pendingMovementSchema.safeParse({
        amountMinor: "0",
        date: "bad",
        description: "",
        category: "",
      }).success,
    ).toBe(false);
  });
});
