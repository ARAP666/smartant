import request from "supertest";
import { describe, expect, it } from "vitest";
import { type AuthHandlers, createApp } from "../../app.js";

const user = { id: "user-id", email: "ana@example.com" };
const pendingMovement = {
  id: "pending-id",
  amountMinor: "12000",
  date: "2026-06-25",
  description: "Cena",
  category: "Comida",
  status: "PENDING",
};
const evaluation = {
  baseBalance: "88000",
  spendableBalance: "38000",
  margins: [{ kind: "BUDGET", amountMinor: "38000", id: "budget-id" }],
  alerts: [
    {
      severity: "INFO",
      rule: "Budget:General",
      amountMinor: "12000",
      spendableBalance: "38000",
    },
  ],
};

describe("pending movement routes", () => {
  it("creates and evaluates a pending movement", async () => {
    const response = await request(app())
      .post("/api/v1/pending-movements/evaluate")
      .set("Authorization", "Bearer valid")
      .send({
        amountMinor: "12000",
        date: "2026-06-25",
        description: "Cena",
        category: "Comida",
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual({ pendingMovement, evaluation });
  });

  it("validates input and requires a session", async () => {
    const invalid = await request(app())
      .post("/api/v1/pending-movements/evaluate")
      .set("Authorization", "Bearer valid")
      .send({ amountMinor: "0", date: "bad", description: "", category: "" });
    expect(invalid.status).toBe(422);

    const unauthorized = await request(app())
      .post("/api/v1/pending-movements/evaluate")
      .send({
        amountMinor: "12000",
        date: "2026-06-25",
        description: "Cena",
        category: "Comida",
      });
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
    {},
    {},
    {},
    {},
    {},
    {
      evaluatePendingMovement: async () => ({ pendingMovement, evaluation }),
    },
  );
}
