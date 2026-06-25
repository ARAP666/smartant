import { describe, expect, it } from "vitest";
import { validateImportFile } from "./import-file";

describe("validateImportFile", () => {
  it("accepts CSV and XLSX files", () => {
    expect(
      validateImportFile({ name: "movimientos.csv", uri: "file://m.csv" }),
    ).toBe("");
    expect(
      validateImportFile({ name: "movimientos.xlsx", uri: "file://m.xlsx" }),
    ).toBe("");
  });

  it("rejects unsupported and oversized files", () => {
    expect(
      validateImportFile({ name: "movimientos.pdf", uri: "file://m.pdf" }),
    ).toBe("Selecciona un archivo CSV o XLSX");
    expect(
      validateImportFile({
        name: "movimientos.csv",
        uri: "file://m.csv",
        size: 3 * 1024 * 1024,
      }),
    ).toBe("El archivo debe pesar 2 MB o menos");
  });
});
