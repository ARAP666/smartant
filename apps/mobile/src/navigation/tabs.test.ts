import { describe, expect, it } from "vitest";
import { tabs } from "./tabs";

describe("tabs", () => {
  it("defines exactly the five primary destinations", () => {
    expect(tabs.map(({ label }) => label)).toEqual([
      "Inicio",
      "Movimientos",
      "Añadir",
      "Plan",
      "Perfil",
    ]);
  });

  it("assigns a Lucide icon name to every destination", () => {
    expect(tabs).toHaveLength(5);
    expect(tabs.map(({ icon }) => icon)).toEqual([
      "House",
      "List",
      "Plus",
      "Chart",
      "User",
    ]);
  });
});
