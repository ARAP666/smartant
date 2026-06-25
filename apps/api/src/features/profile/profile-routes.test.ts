import request from "supertest";
import { describe, expect, it } from "vitest";
import { type AuthHandlers, createApp } from "../../app.js";

const user = { id: "user-id", email: "ana@example.com" };
const profile = {
  email: user.email,
  currency: "CRC",
  timeZone: "America/Costa_Rica",
};

describe("profile routes", () => {
  it("returns the authenticated user's profile", async () => {
    const response = await request(app())
      .get("/api/v1/profile")
      .set("Authorization", "Bearer valid");

    expect(response.status).toBe(200);
    expect(response.body.data.profile).toEqual(profile);
  });

  it("updates valid profile fields", async () => {
    const response = await request(app())
      .patch("/api/v1/profile")
      .set("Authorization", "Bearer valid")
      .send({ currency: "USD", timeZone: "America/New_York" });

    expect(response.status).toBe(200);
    expect(response.body.data.profile).toEqual({
      ...profile,
      currency: "USD",
      timeZone: "America/New_York",
    });
  });

  it("rejects invalid input and missing sessions", async () => {
    const invalid = await request(app())
      .patch("/api/v1/profile")
      .set("Authorization", "Bearer valid")
      .send({ currency: "CRC", timeZone: "bad-zone" });
    expect(invalid.status).toBe(422);
    expect(invalid.body.error.code).toBe("VALIDATION_ERROR");

    const unauthorized = await request(app()).get("/api/v1/profile");
    expect(unauthorized.status).toBe(401);
  });
});

function app(overrides: Partial<AuthHandlers> = {}) {
  return createApp(
    async () => undefined,
    {
      register: async () => ({ user, sessionToken: "registered" }),
      login: async () => ({ user, sessionToken: "valid" }),
      authenticate: async (token) => (token === "valid" ? user : null),
      logout: async () => undefined,
      ...overrides,
    },
    {
      getProfile: async () => ({ profile }),
      updateProfile: async (_userId, input) => ({
        profile: { ...profile, ...input },
      }),
    },
  );
}
