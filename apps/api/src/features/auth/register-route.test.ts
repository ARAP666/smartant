import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../app.js";
import { AppError } from "../../shared/errors.js";

describe("POST /api/v1/auth/register", () => {
  it("returns a user and opaque session token", async () => {
    const response = await request(
      createApp(
        async () => undefined,
        async ({ email }) => ({
          user: { id: "user-id", email },
          sessionToken: "opaque-token",
        }),
      ),
    )
      .post("/api/v1/auth/register")
      .send({
        email: "ANA@EXAMPLE.COM",
        password: "correct horse battery staple",
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      data: {
        user: { id: "user-id", email: "ana@example.com" },
        sessionToken: "opaque-token",
      },
    });
  });

  it("returns field errors for invalid input", async () => {
    const response = await request(
      createApp(
        async () => undefined,
        async () => never(),
      ),
    ).post("/api/v1/auth/register");

    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.details.fieldErrors).toBeDefined();
    expect(response.body.error.requestId).toEqual(expect.any(String));
  });

  it("returns a safe conflict", async () => {
    const response = await request(
      createApp(
        async () => undefined,
        async () => {
          throw new AppError(
            409,
            "EMAIL_ALREADY_REGISTERED",
            "Email already registered",
          );
        },
      ),
    )
      .post("/api/v1/auth/register")
      .send({
        email: "ana@example.com",
        password: "correct horse battery staple",
      });

    expect(response.status).toBe(409);
    expect(response.body.error).toMatchObject({
      code: "EMAIL_ALREADY_REGISTERED",
      message: "Email already registered",
      details: {},
    });
    expect(JSON.stringify(response.body)).not.toContain("stack");
  });
});

function never(): never {
  throw new Error("should not run");
}
