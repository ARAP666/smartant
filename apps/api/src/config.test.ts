import { describe, expect, it } from "vitest";
import { parseConfig } from "./config.js";

describe("parseConfig", () => {
  it("accepts the sentDB PostgreSQL URL", () => {
    expect(
      parseConfig({
        DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/sentDB",
        PORT: "3000",
      }),
    ).toEqual({
      databaseUrl: "postgresql://postgres:postgres@localhost:5432/sentDB",
      port: 3000,
    });
  });

  it("rejects a missing database URL", () => {
    expect(() => parseConfig({})).toThrow();
  });
});
