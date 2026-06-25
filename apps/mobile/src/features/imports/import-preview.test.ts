import { describe, expect, it } from "vitest";
import {
  buildImportPreviewRows,
  classifyImportRows,
  parseCsvImport,
} from "./import-preview";

describe("classifyImportRows", () => {
  it("reads CSV headers and rows", () => {
    const csv =
      'Fecha,Monto,Descripcion,Categoria\n2026-06-25,120.50,"Cafe, pan",Comida';

    expect(parseCsvImport(csv).headers).toEqual([
      "Fecha",
      "Monto",
      "Descripcion",
      "Categoria",
    ]);
    expect(
      buildImportPreviewRows(csv, {
        date: "Fecha",
        amount: "Monto",
        description: "Descripcion",
        category: "Categoria",
      }),
    ).toEqual([
      {
        id: "row-1",
        date: "2026-06-25",
        amountMinor: "12050",
        description: "Cafe, pan",
        category: "Comida",
      },
    ]);
  });

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
