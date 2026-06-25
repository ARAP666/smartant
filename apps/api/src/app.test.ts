import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

describe("GET /api/v1/health", () => {
  it("reports API and database health", async () => {
    const response = await request(createApp(async () => undefined)).get(
      "/api/v1/health",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        status: "ok",
        database: "ok",
      },
    });
  });

  it("returns a safe 503 response when the database is unavailable", async () => {
    const response = await request(
      createApp(async () => {
        throw new Error("password=secret");
      }),
    ).get("/api/v1/health");

    expect(response.status).toBe(503);
    expect(response.body.error).toMatchObject({
      code: "DATABASE_UNAVAILABLE",
      message: "Database unavailable",
      details: {},
    });
    expect(response.body.error.requestId).toEqual(expect.any(String));
    expect(JSON.stringify(response.body)).not.toContain("secret");
  });
});
