import request from "supertest";
import { describe, expect, it } from "vitest";
import { type AuthHandlers, createApp } from "../../app.js";
import { AppError } from "../../shared/errors.js";

const user = { id: "user-id", email: "ana@example.com" };
const budget = {
  id: "budget-id",
  amountMinor: "50000",
  period: "MONTHLY",
  category: "Comida",
  active: true,
};

describe("budget routes", () => {
  it("lists and creates authenticated user budgets", async () => {
    const list = await request(app())
      .get("/api/v1/budgets")
      .set("Authorization", "Bearer valid");
    expect(list.status).toBe(200);
    expect(list.body.data.budgets).toEqual([budget]);

    const created = await request(app())
      .post("/api/v1/budgets")
      .set("Authorization", "Bearer valid")
      .send({
        amountMinor: "50000",
        period: "MONTHLY",
        category: "Comida",
        active: true,
      });
    expect(created.status).toBe(201);
    expect(created.body.data.budget).toEqual(budget);
  });

  it("validates input, conflict, and session", async () => {
    const invalid = await request(app())
      .post("/api/v1/budgets")
      .set("Authorization", "Bearer valid")
      .send({ amountMinor: "0", period: "YEARLY" });
    expect(invalid.status).toBe(422);

    const conflict = await request(app({ conflict: true }))
      .post("/api/v1/budgets")
      .set("Authorization", "Bearer valid")
      .send({ amountMinor: "50000", period: "MONTHLY" });
    expect(conflict.status).toBe(409);

    const unauthorized = await request(app()).get("/api/v1/budgets");
    expect(unauthorized.status).toBe(401);
  });

  it("updates and deletes budgets", async () => {
    const updated = await request(app())
      .patch("/api/v1/budgets/budget-id")
      .set("Authorization", "Bearer valid")
      .send({ amountMinor: "60000", period: "MONTHLY", active: false });
    expect(updated.status).toBe(200);

    const deleted = await request(app())
      .delete("/api/v1/budgets/budget-id")
      .set("Authorization", "Bearer valid");
    expect(deleted.status).toBe(204);
  });
});

function app(
  options: { conflict?: boolean } = {},
  overrides: Partial<AuthHandlers> = {},
) {
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
    {
      listBudgets: async () => ({ budgets: [budget] }),
      createBudget: async () => {
        if (options.conflict) {
          throw new AppError(409, "BUDGET_CONFLICT", "Budget already exists");
        }
        return { budget };
      },
      updateBudget: async () => ({
        budget: { ...budget, amountMinor: "60000" },
      }),
      deleteBudget: async () => undefined,
    },
  );
}
