import { describe, expect, it } from "vitest";
import { listMovementHistory } from "./history.js";

describe("listMovementHistory", () => {
  it("returns confirmed income and expense movements ordered by date", async () => {
    const database = {
      $transaction: async (queries: unknown[]) => Promise.all(queries),
      income: {
        findMany: async () => [
          {
            id: "income-id",
            amountMinor: 100000n,
            date: new Date("2026-06-20T00:00:00.000Z"),
            description: "Salario",
          },
        ],
      },
      expense: {
        findMany: async () => [
          {
            id: "expense-id",
            amountMinor: 12000n,
            date: new Date("2026-06-25T00:00:00.000Z"),
            description: "Cena",
            category: "Comida",
          },
        ],
      },
    };

    await expect(
      listMovementHistory(database as never, "user-id", {
        from: undefined,
        to: undefined,
        category: "Comida",
        offset: 0,
        limit: 20,
      }),
    ).resolves.toEqual({
      movements: [
        {
          id: "expense-id",
          amountMinor: "12000",
          date: "2026-06-25",
          description: "Cena",
          type: "EXPENSE",
          category: "Comida",
        },
      ],
      page: { offset: 0, limit: 20, total: 1, nextOffset: null },
    });
  });
});
