import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { createApp } from "./app.js";

describe("GET /api/v1/health", () => {
  it("adds operational headers", async () => {
    const response = await request(createApp(async () => undefined))
      .get("/api/v1/health")
      .set("x-request-id", "request-id-1");

    expect(response.headers["x-request-id"]).toBe("request-id-1");
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-powered-by"]).toBeUndefined();
  });

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

  it("logs requests without leaking bodies", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);

    await request(createApp(async () => undefined)).get("/api/v1/health");

    expect(log).toHaveBeenCalledWith(
      expect.stringContaining('"event":"http_request"'),
    );
    expect(log.mock.calls[0]?.[0]).not.toContain("password");
    log.mockRestore();
  });
});

describe("auth rate limit", () => {
  it("limits repeated auth attempts", async () => {
    const app = createApp(async () => undefined);

    for (let attempt = 0; attempt < 20; attempt += 1) {
      await request(app).post("/api/v1/auth/login").send({
        email: "ana@example.com",
        password: "bad-password",
      });
    }

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "ana@example.com",
      password: "bad-password",
    });

    expect(response.status).toBe(429);
    expect(response.body.error.code).toBe("RATE_LIMITED");
    expect(response.headers["retry-after"]).toEqual(expect.any(String));
  });
});
