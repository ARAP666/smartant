import { describe, expect, it } from "vitest";
import { classifyImportRows } from "./import-preview";

describe("classifyImportRows", () => {
  it("classifies valid, invalid and duplicate rows", () => {
    expect(
      classifyImportRows([
        { id: "1", date: "2026-06-25", amountMinor: "12000" },
        { id: "2", amountMinor: "12000" },
        {
          id: "3",
          date: "2026-06-25",
          amountMinor: "12000",
          duplicateOf: "expense-id",
        },
      ]),
    ).toEqual([
      {
        id: "1",
        date: "2026-06-25",
        amountMinor: "12000",
        status: "VALID",
        reason: "",
      },
      {
        id: "2",
        amountMinor: "12000",
        status: "INVALID",
        reason: "Falta fecha",
      },
      {
        id: "3",
        date: "2026-06-25",
        amountMinor: "12000",
        duplicateOf: "expense-id",
        status: "DUPLICATE",
        reason: "Coincide con expense-id",
      },
    ]);
  });
});
