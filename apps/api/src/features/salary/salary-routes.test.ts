import request from "supertest";
import { describe, expect, it } from "vitest";
import { type AuthHandlers, createApp } from "../../app.js";

const user = { id: "user-id", email: "ana@example.com" };
const salary = {
  id: "salary-id",
  amountMinor: "150000",
  frequency: "MONTHLY",
  nextDate: "2026-06-30",
  pausedAt: null,
  paused: false,
};
const income = {
  id: "income-id",
  amountMinor: "150000",
  date: "2026-06-30",
  description: "Salario",
};

describe("salary routes", () => {
  it("reads and saves salary for the authenticated user", async () => {
    const read = await request(app())
      .get("/api/v1/salary")
      .set("Authorization", "Bearer valid");
    expect(read.status).toBe(200);
    expect(read.body.data.salary).toEqual(salary);

    const saved = await request(app())
      .put("/api/v1/salary")
      .set("Authorization", "Bearer valid")
      .send({
        amountMinor: "150000",
        frequency: "MONTHLY",
        nextDate: "2026-06-30",
      });
    expect(saved.status).toBe(200);
    expect(saved.body.data.salary).toEqual(salary);
  });

  it("validates input and requires a session", async () => {
    const invalid = await request(app())
      .put("/api/v1/salary")
      .set("Authorization", "Bearer valid")
      .send({ amountMinor: "0", frequency: "DAILY", nextDate: "bad" });
    expect(invalid.status).toBe(422);

    const unauthorized = await request(app()).get("/api/v1/salary");
    expect(unauthorized.status).toBe(401);
  });

  it("pauses, deletes, and generates idempotent salary income", async () => {
    const paused = await request(app())
      .patch("/api/v1/salary/pause")
      .set("Authorization", "Bearer valid")
      .send({ paused: true });
    expect(paused.status).toBe(200);

    const generated = await request(app())
      .post("/api/v1/salary/generate")
      .set("Authorization", "Bearer valid")
      .send({ date: "2026-06-30" });
    expect(generated.status).toBe(201);
    expect(generated.body.data).toEqual({ income, generated: true });

    const deleted = await request(app())
      .delete("/api/v1/salary")
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
    {
      getSalary: async () => ({ salary }),
      upsertSalary: async () => ({ salary }),
      pauseSalary: async () => ({ salary: { ...salary, paused: true } }),
      deleteSalary: async () => undefined,
      generateSalaryIncome: async () => ({ income, generated: true }),
    },
  );
}
