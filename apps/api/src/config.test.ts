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

  it("uses the local sentDB URL outside production", () => {
    expect(parseConfig({})).toEqual({
      databaseUrl: "postgresql://postgres:postgres@localhost:5432/sentDB",
      port: 3000,
    });
  });

  it("requires a database URL in production", () => {
    expect(() => parseConfig({ NODE_ENV: "production" })).toThrow(
      "DATABASE_URL is required in production",
    );
  });
});
