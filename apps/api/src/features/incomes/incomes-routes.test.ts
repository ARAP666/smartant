import request from "supertest";
import { describe, expect, it } from "vitest";
import { type AuthHandlers, createApp } from "../../app.js";

const user = { id: "user-id", email: "ana@example.com" };
const income = {
  id: "income-id",
  amountMinor: "150000",
  date: "2026-06-25",
  description: "Salario",
};

describe("income routes", () => {
  it("lists authenticated user incomes", async () => {
    const response = await request(app())
      .get("/api/v1/incomes")
      .set("Authorization", "Bearer valid");

    expect(response.status).toBe(200);
    expect(response.body.data.incomes).toEqual([income]);
  });

  it("creates and validates income input", async () => {
    const created = await request(app())
      .post("/api/v1/incomes")
      .set("Authorization", "Bearer valid")
      .send({
        amountMinor: "150000",
        date: "2026-06-25",
        description: "Salario",
      });

    expect(created.status).toBe(201);
    expect(created.body.data.income).toEqual(income);

    const invalid = await request(app())
      .patch("/api/v1/incomes/income-id")
      .set("Authorization", "Bearer valid")
      .send({ amountMinor: "0", date: "bad", description: "" });
    expect(invalid.status).toBe(422);
  });

  it("deletes only with a session", async () => {
    const unauthorized = await request(app()).delete(
      "/api/v1/incomes/income-id",
    );
    expect(unauthorized.status).toBe(401);

    const deleted = await request(app())
      .delete("/api/v1/incomes/income-id")
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
    {
      listIncomes: async () => ({ incomes: [income] }),
      createIncome: async () => ({ income }),
      updateIncome: async () => ({ income }),
      deleteIncome: async () => undefined,
    },
  );
}
