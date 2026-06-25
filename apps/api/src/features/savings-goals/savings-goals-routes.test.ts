import request from "supertest";
import { describe, expect, it } from "vitest";
import { type AuthHandlers, createApp } from "../../app.js";

const user = { id: "user-id", email: "ana@example.com" };
const savingsGoal = {
  id: "goal-id",
  amountMinor: "75000",
  period: "MONTHLY",
  active: true,
};

describe("savings goal routes", () => {
  it("lists and creates authenticated user savings goals", async () => {
    const list = await request(app())
      .get("/api/v1/savings-goals")
      .set("Authorization", "Bearer valid");
    expect(list.status).toBe(200);
    expect(list.body.data.savingsGoals).toEqual([savingsGoal]);

    const created = await request(app())
      .post("/api/v1/savings-goals")
      .set("Authorization", "Bearer valid")
      .send({ amountMinor: "75000", period: "MONTHLY", active: true });
    expect(created.status).toBe(201);
    expect(created.body.data.savingsGoal).toEqual(savingsGoal);
  });

  it("validates input and requires a session", async () => {
    const invalid = await request(app())
      .post("/api/v1/savings-goals")
      .set("Authorization", "Bearer valid")
      .send({ amountMinor: "0", period: "YEARLY" });
    expect(invalid.status).toBe(422);

    const unauthorized = await request(app()).get("/api/v1/savings-goals");
    expect(unauthorized.status).toBe(401);
  });

  it("updates and deletes savings goals", async () => {
    const updated = await request(app())
      .patch("/api/v1/savings-goals/goal-id")
      .set("Authorization", "Bearer valid")
      .send({ amountMinor: "80000", period: "MONTHLY", active: false });
    expect(updated.status).toBe(200);

    const deleted = await request(app())
      .delete("/api/v1/savings-goals/goal-id")
      .set("Authorization", "Bearer valid");
    expect(deleted.status).toBe(204);
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
    {
      listSavingsGoals: async () => ({ savingsGoals: [savingsGoal] }),
      createSavingsGoal: async () => ({ savingsGoal }),
      updateSavingsGoal: async () => ({
        savingsGoal: { ...savingsGoal, amountMinor: "80000", active: false },
      }),
      deleteSavingsGoal: async () => undefined,
    },
  );
}
