import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../app.js";

const user = { id: "user-id", email: "ana@example.com" };
const history = {
  movements: [
    {
      id: "expense-id",
      type: "EXPENSE" as const,
      amountMinor: "12000",
      date: "2026-06-25",
      description: "Cena",
      category: "Comida",
    },
  ],
  page: { offset: 0, limit: 20, total: 1, nextOffset: null },
};

describe("history routes", () => {
  it("returns filtered movement history", async () => {
    const response = await request(app())
      .get("/api/v1/history?type=EXPENSE&category=Comida")
      .set("Authorization", "Bearer valid");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(history);
  });

  it("requires a session", async () => {
    const response = await request(app()).get("/api/v1/history");

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
    {},
    { listMovementHistory: async () => history },
  );
}
