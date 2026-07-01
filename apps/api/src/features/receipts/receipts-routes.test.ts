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

  it("stores, reads, and deletes an optional expense receipt", async () => {
    const attachment = {
      attachment: {
        id: "attachment-id",
        originalName: "receipt.jpg",
        mimeType: "image/jpeg",
      },
    };
    const testApp = app({
      saveAttachment: async () => attachment,
      getAttachment: async () => attachment,
      deleteAttachment: async () => undefined,
    });

    const saved = await request(testApp)
      .post("/api/v1/expenses/expense-id/receipt")
      .set("Authorization", "Bearer valid")
      .attach("receipt", Buffer.from("fake"), {
        filename: "receipt.jpg",
        contentType: "image/jpeg",
      });
    expect(saved.status).toBe(201);
    expect(saved.body.data).toEqual(attachment);

    const read = await request(testApp)
      .get("/api/v1/expenses/expense-id/receipt")
      .set("Authorization", "Bearer valid");
    expect(read.status).toBe(200);
    expect(read.body.data).toEqual(attachment);

    const deleted = await request(testApp)
      .delete("/api/v1/expenses/expense-id/receipt")
      .set("Authorization", "Bearer valid");
    expect(deleted.status).toBe(204);
  });
});

function app(receiptOverrides = {}) {
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
      ...receiptOverrides,
    },
  );
}
