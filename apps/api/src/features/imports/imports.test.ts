import { describe, expect, it } from "vitest";
import { importConfirmationSchema } from "./imports.js";

describe("importConfirmationSchema", () => {
  it("parses selected import rows", () => {
    expect(
      importConfirmationSchema.parse({
        idempotencyKey: "import-file-1",
        rows: [
          {
            rowId: "row-1",
            amountMinor: "12000",
            date: "2026-06-25",
            description: "Supermercado",
            category: "Comida",
          },
        ],
      }),
    ).toEqual({
      idempotencyKey: "import-file-1",
      rows: [
        {
          rowId: "row-1",
          amountMinor: 12000n,
          date: new Date("2026-06-25T00:00:00.000Z"),
          description: "Supermercado",
          category: "Comida",
        },
      ],
    });
  });

  it("rejects empty imports and invalid rows", () => {
    expect(
      importConfirmationSchema.safeParse({
        idempotencyKey: "short",
        rows: [],
      }).success,
    ).toBe(false);
    expect(
      importConfirmationSchema.safeParse({
        idempotencyKey: "import-file-1",
        rows: [
          {
            rowId: "",
            amountMinor: "0",
            date: "bad",
            description: "",
            category: "",
          },
        ],
      }).success,
    ).toBe(false);
  });
});
