import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../app.js";

const user = { id: "user-id", email: "ana@example.com" };
const importResult = {
  created: 1,
  skipped: 0,
  failed: 0,
  rows: [
    {
      rowId: "row-1",
      status: "CREATED" as const,
      expenseId: "expense-id",
      alertSeverity: "INFO",
    },
  ],
};

describe("import routes", () => {
  it("confirms selected import rows", async () => {
    const response = await request(app())
      .post("/api/v1/imports/confirm")
      .set("Authorization", "Bearer valid")
      .send({
        idempotencyKey: "import-file-1",
        rows: [
          {
            rowId: "row-1",
            amountMinor: "12000",
            date: "2026-06-25",
            description: "Supermercado",
            category: "Comida",
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual(importResult);
  });

  it("validates input and requires a session", async () => {
    const invalid = await request(app())
      .post("/api/v1/imports/confirm")
      .set("Authorization", "Bearer valid")
      .send({ idempotencyKey: "short", rows: [] });
    expect(invalid.status).toBe(422);

    const unauthorized = await request(app())
      .post("/api/v1/imports/confirm")
      .send({
        idempotencyKey: "import-file-1",
        rows: [
          {
            rowId: "row-1",
            amountMinor: "12000",
            date: "2026-06-25",
            description: "Supermercado",
            category: "Comida",
          },
        ],
      });
    expect(unauthorized.status).toBe(401);
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
    {},
    {},
    {
      confirmImport: async () => importResult,
    },
  );
}
