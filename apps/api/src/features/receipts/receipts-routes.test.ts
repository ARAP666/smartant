import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../app.js";

const user = { id: "user-id", email: "ana@example.com" };
const receiptResult = {
  pendingMovement: {
    id: "pending-id",
    amountMinor: "12345",
    date: "2026-06-25",
    description: "Tienda",
    category: "Recibo",
    status: "PENDING",
  },
  detected: {
    amountMinor: "12345",
    date: "2026-06-25",
    description: "Tienda",
    category: "Recibo",
    confidence: { amount: true, date: true, description: true },
  },
};

describe("receipt routes", () => {
  it("detects receipt data from a multipart upload", async () => {
    const response = await request(app())
      .post("/api/v1/receipts/detect")
      .set("Authorization", "Bearer valid")
      .field("text", "Tienda\n2026-06-25\n123.45")
      .attach("receipt", Buffer.from("fake"), {
        filename: "receipt.jpg",
        contentType: "image/jpeg",
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual(receiptResult);
  });

  it("requires a valid session and file", async () => {
    const unauthorized = await request(app()).post("/api/v1/receipts/detect");
    expect(unauthorized.status).toBe(401);

    const invalid = await request(app())
      .post("/api/v1/receipts/detect")
      .set("Authorization", "Bearer valid");
    expect(invalid.status).toBe(422);
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
    {
      detectReceiptPendingMovement: async () => receiptResult,
    },
  );
}
