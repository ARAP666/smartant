import { describe, expect, it } from "vitest";
import { canContinueImport, suggestImportMapping } from "./import-mapping";

describe("import mapping", () => {
  it("suggests common column mappings", () => {
    expect(suggestImportMapping(["Fecha", "Monto", "Descripcion"])).toEqual({
      date: "Fecha",
      amount: "Monto",
      description: "Descripcion",
      category: undefined,
    });
  });

  it("requires date and amount to continue", () => {
    expect(canContinueImport({ date: "Fecha" })).toBe(false);
    expect(canContinueImport({ date: "Fecha", amount: "Monto" })).toBe(true);
  });
});
