import { describe, expect, it } from "vitest";
import {
  expenseUpdateSchema,
  pendingMovementConfirmationSchema,
  pendingMovementSchema,
} from "./pending-movements.js";

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

  it("parses confirmation input with an optional accepted warning", () => {
    expect(
      pendingMovementConfirmationSchema.parse({
        idempotencyKey: "confirm-pending-id",
      }),
    ).toEqual({
      idempotencyKey: "confirm-pending-id",
      acceptedWarning: false,
    });
  });

  it("parses expense update input", () => {
    expect(
      expenseUpdateSchema.parse({
        amountMinor: "15000",
        date: "2026-06-26",
        description: "Cena editada",
        category: "Comida",
        acceptedWarning: true,
      }),
    ).toEqual({
      amountMinor: 15000n,
      date: new Date("2026-06-26T00:00:00.000Z"),
      description: "Cena editada",
      category: "Comida",
      acceptedWarning: true,
    });
  });
});
