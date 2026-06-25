import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../app.js";

const user = { id: "user-id", email: "ana@example.com" };
const summary = {
  period: {
    kind: "MONTHLY",
    start: "2026-06-01",
    end: "2026-06-30",
    timeZone: "America/Costa_Rica",
  },
  incomeTotal: "100000",
  expenseTotal: "25000",
  savingsGoalTotal: "10000",
  budgetTotal: "50000",
  spendableBalance: "25000",
  empty: false,
};

describe("summary routes", () => {
  it("returns the authenticated user's financial summary", async () => {
    const response = await request(app())
      .get("/api/v1/summary")
      .set("Authorization", "Bearer valid");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({ summary });
  });

  it("accepts weekly summaries", async () => {
    const response = await request(app())
      .get("/api/v1/summary?period=WEEKLY")
      .set("Authorization", "Bearer valid");

    expect(response.status).toBe(200);
  });

  it("requires a session", async () => {
    const response = await request(app()).get("/api/v1/summary");

    expect(response.status).toBe(401);
  });
});

function app() {
  return createApp(
    async () => undefined,
    {
      register: async () => ({ user, sessionToken: "registered" }),
      login: async () => ({ user, sessionToken: "valid" }),
      authenticate: async (token) => (token === "valid" ? user : null),
      logout: async () => undefined,
    },
    {},
    {},
    {},
    {},
    {},
    {},
    {
      getFinancialSummary: async () => ({ summary }),
    },
  );
}
