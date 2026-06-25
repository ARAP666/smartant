import { describe, expect, it } from "vitest";
import { detectReceiptPendingMovement } from "./receipts.js";

describe("detectReceiptPendingMovement", () => {
  it("creates a pending movement from detected receipt text", async () => {
    const pendingMovement = {
      id: "pending-id",
      amountMinor: 12345n,
      date: new Date("2026-06-25T00:00:00.000Z"),
      description: "Tienda",
      category: "Recibo",
      status: "PENDING",
    };
    const database = {
      pendingMovement: {
        create: async () => pendingMovement,
      },
    };

    await expect(
      detectReceiptPendingMovement(database as never, "user-id", {
        originalName: "receipt.jpg",
        mimeType: "image/jpeg",
        size: 1024,
        text: "Tienda\n2026-06-25\n123.45",
      }),
    ).resolves.toEqual({
      pendingMovement: {
        ...pendingMovement,
        amountMinor: "12345",
        date: "2026-06-25",
      },
      detected: {
        amountMinor: "12345",
        date: "2026-06-25",
        description: "Tienda",
        category: "Recibo",
        confidence: { amount: true, date: true, description: true },
      },
    });
  });
});
