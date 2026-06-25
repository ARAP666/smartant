import request from "supertest";
import { describe, expect, it } from "vitest";
import { type AuthHandlers, createApp } from "../../app.js";
import { AppError } from "../../shared/errors.js";

const user = { id: "user-id", email: "ana@example.com" };

describe("auth session routes", () => {
  it("logs in with a generic contract", async () => {
    const response = await request(
      app({
        login: async () => ({ user, sessionToken: "opaque-token" }),
      }),
    )
      .post("/api/v1/auth/login")
      .send({ email: "ANA@EXAMPLE.COM", password: "secret" });

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({ user, sessionToken: "opaque-token" });
  });

  it("does not reveal which credential failed", async () => {
    const response = await request(
      app({
        login: async () => {
          throw new AppError(
            401,
            "INVALID_CREDENTIALS",
            "Invalid email or password",
          );
        },
      }),
    )
      .post("/api/v1/auth/login")
      .send({ email: "missing@example.com", password: "wrong" });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("INVALID_CREDENTIALS");
    expect(response.body.error.message).toBe("Invalid email or password");
  });

  it("requires a valid Bearer session", async () => {
    const unauthorized = await request(app()).get("/api/v1/auth/session");
    expect(unauthorized.status).toBe(401);

    const authorized = await request(
      app({ authenticate: async (token) => (token === "valid" ? user : null) }),
    )
      .get("/api/v1/auth/session")
      .set("Authorization", "Bearer valid");
    expect(authorized.status).toBe(200);
    expect(authorized.body.data.user).toEqual(user);
  });

  it("revokes the presented session", async () => {
    let revoked = "";
    const response = await request(
      app({
        authenticate: async () => user,
        logout: async (token) => {
          revoked = token;
        },
      }),
    )
      .post("/api/v1/auth/logout")
      .set("Authorization", "Bearer valid");

    expect(response.status).toBe(204);
    expect(revoked).toBe("valid");
  });
});

function app(overrides: Partial<AuthHandlers> = {}) {
  return createApp(async () => undefined, {
    register: async () => ({ user, sessionToken: "registered" }),
    login: async () => {
      throw new AppError(
        401,
        "INVALID_CREDENTIALS",
        "Invalid email or password",
      );
    },
    authenticate: async () => null,
    logout: async () => undefined,
    ...overrides,
  });
}
