import "dotenv/config";
import argon2 from "argon2";
import { parseConfig } from "../src/config.js";
import { createDatabase } from "../src/shared/db.js";

const email = "demo@smartant.local";
const password = "SmartAntDemo2026!";
const database = createDatabase(parseConfig(process.env));
const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

const user = await database.user.upsert({
  where: { email },
  create: {
    email,
    passwordHash,
    currency: "CRC",
    timeZone: "America/Costa_Rica",
  },
  update: {
    passwordHash,
    currency: "CRC",
    timeZone: "America/Costa_Rica",
  },
  select: { id: true },
});

const date = (value: string) => new Date(`${value}T00:00:00.000Z`);

await database.$transaction([
  database.salary.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      amountMinor: 62000000n,
      frequency: "MONTHLY",
      nextDate: date("2026-07-15"),
    },
    update: {
      amountMinor: 62000000n,
      frequency: "MONTHLY",
      nextDate: date("2026-07-15"),
      pausedAt: null,
    },
  }),
  database.income.upsert({
    where: { id: "10000000-0000-4000-8000-000000000001" },
    create: {
      id: "10000000-0000-4000-8000-000000000001",
      userId: user.id,
      amountMinor: 62000000n,
      date: date("2026-06-15"),
      description: "Salario mensual",
    },
    update: {},
  }),
  database.income.upsert({
    where: { id: "10000000-0000-4000-8000-000000000002" },
    create: {
      id: "10000000-0000-4000-8000-000000000002",
      userId: user.id,
      amountMinor: 8500000n,
      date: date("2026-06-22"),
      description: "Trabajo independiente",
    },
    update: {},
  }),
  ...[
    ["20000000-0000-4000-8000-000000000001", 10000000n, "Comida"],
    ["20000000-0000-4000-8000-000000000002", 2000000n, "Ocio"],
    ["20000000-0000-4000-8000-000000000003", 3500000n, "Transporte"],
    ["20000000-0000-4000-8000-000000000004", 4500000n, "Servicios"],
    ["20000000-0000-4000-8000-000000000005", 6000000n, "Hogar"],
    ["20000000-0000-4000-8000-000000000006", 2500000n, "Salud"],
    ["20000000-0000-4000-8000-000000000007", 1800000n, "Educación"],
  ].map(([id, amountMinor, category]) =>
    database.budget.upsert({
      where: { id: id as string },
      create: {
        id: id as string,
        userId: user.id,
        amountMinor: amountMinor as bigint,
        category: category as string,
        period: "MONTHLY",
      },
      update: { amountMinor: amountMinor as bigint, active: true },
    }),
  ),
  database.savingsGoal.upsert({
    where: { id: "30000000-0000-4000-8000-000000000001" },
    create: {
      id: "30000000-0000-4000-8000-000000000001",
      userId: user.id,
      amountMinor: 30000000n,
      period: "MONTHLY",
    },
    update: { amountMinor: 30000000n, active: true },
  }),
  ...[
    [
      "40000000-0000-4000-8000-000000000001",
      420000n,
      "2026-06-29",
      "Soda La Esquina",
      "Comida",
    ],
    [
      "40000000-0000-4000-8000-000000000002",
      110000n,
      "2026-06-28",
      "Bus San Ramón - Alajuela",
      "Transporte",
    ],
    [
      "40000000-0000-4000-8000-000000000003",
      650000n,
      "2026-06-27",
      "Cine con amigos",
      "Ocio",
    ],
    [
      "40000000-0000-4000-8000-000000000004",
      1840000n,
      "2026-06-25",
      "Supermercado",
      "Comida",
    ],
    [
      "40000000-0000-4000-8000-000000000005",
      890000n,
      "2026-07-01",
      "Compras de la semana",
      "Comida",
    ],
    [
      "40000000-0000-4000-8000-000000000006",
      320000n,
      "2026-07-01",
      "Café con amistades",
      "Ocio",
    ],
    [
      "40000000-0000-4000-8000-000000000007",
      4650000n,
      "2026-06-20",
      "Electricidad e internet",
      "Servicios",
    ],
    [
      "40000000-0000-4000-8000-000000000008",
      2400000n,
      "2026-06-18",
      "Farmacia",
      "Salud",
    ],
    [
      "40000000-0000-4000-8000-000000000009",
      1650000n,
      "2026-06-14",
      "Curso en línea",
      "Educación",
    ],
    [
      "40000000-0000-4000-8000-000000000010",
      5100000n,
      "2026-06-10",
      "Reparación del hogar",
      "Hogar",
    ],
    [
      "40000000-0000-4000-8000-000000000011",
      1750000n,
      "2026-06-07",
      "Feria del agricultor",
      "Comida",
    ],
    [
      "40000000-0000-4000-8000-000000000012",
      480000n,
      "2026-06-03",
      "Taxi",
      "Transporte",
    ],
  ].map(([id, amountMinor, expenseDate, description, category]) =>
    database.pendingMovement.upsert({
      where: { id: id as string },
      create: {
        id: id as string,
        userId: user.id,
        amountMinor: amountMinor as bigint,
        date: date(expenseDate as string),
        description: description as string,
        category: category as string,
        status: "CONFIRMED",
      },
      update: {},
    }),
  ),
]);

await database.$transaction(
  [
    [
      "50000000-0000-4000-8000-000000000001",
      "40000000-0000-4000-8000-000000000001",
      420000n,
      "2026-06-29",
      "Soda La Esquina",
      "Comida",
    ],
    [
      "50000000-0000-4000-8000-000000000002",
      "40000000-0000-4000-8000-000000000002",
      110000n,
      "2026-06-28",
      "Bus San Ramón - Alajuela",
      "Transporte",
    ],
    [
      "50000000-0000-4000-8000-000000000003",
      "40000000-0000-4000-8000-000000000003",
      650000n,
      "2026-06-27",
      "Cine con amigos",
      "Ocio",
    ],
    [
      "50000000-0000-4000-8000-000000000004",
      "40000000-0000-4000-8000-000000000004",
      1840000n,
      "2026-06-25",
      "Supermercado",
      "Comida",
    ],
    [
      "50000000-0000-4000-8000-000000000005",
      "40000000-0000-4000-8000-000000000005",
      890000n,
      "2026-07-01",
      "Compras de la semana",
      "Comida",
    ],
    [
      "50000000-0000-4000-8000-000000000006",
      "40000000-0000-4000-8000-000000000006",
      320000n,
      "2026-07-01",
      "Café con amistades",
      "Ocio",
    ],
    [
      "50000000-0000-4000-8000-000000000007",
      "40000000-0000-4000-8000-000000000007",
      4650000n,
      "2026-06-20",
      "Electricidad e internet",
      "Servicios",
    ],
    [
      "50000000-0000-4000-8000-000000000008",
      "40000000-0000-4000-8000-000000000008",
      2400000n,
      "2026-06-18",
      "Farmacia",
      "Salud",
    ],
    [
      "50000000-0000-4000-8000-000000000009",
      "40000000-0000-4000-8000-000000000009",
      1650000n,
      "2026-06-14",
      "Curso en línea",
      "Educación",
    ],
    [
      "50000000-0000-4000-8000-000000000010",
      "40000000-0000-4000-8000-000000000010",
      5100000n,
      "2026-06-10",
      "Reparación del hogar",
      "Hogar",
    ],
    [
      "50000000-0000-4000-8000-000000000011",
      "40000000-0000-4000-8000-000000000011",
      1750000n,
      "2026-06-07",
      "Feria del agricultor",
      "Comida",
    ],
    [
      "50000000-0000-4000-8000-000000000012",
      "40000000-0000-4000-8000-000000000012",
      480000n,
      "2026-06-03",
      "Taxi",
      "Transporte",
    ],
  ].map(
    ([
      id,
      pendingMovementId,
      amountMinor,
      expenseDate,
      description,
      category,
    ]) =>
      database.expense.upsert({
        where: { id: id as string },
        create: {
          id: id as string,
          userId: user.id,
          pendingMovementId: pendingMovementId as string,
          idempotencyKey: `demo-${id}`,
          amountMinor: amountMinor as bigint,
          date: date(expenseDate as string),
          description: description as string,
          category: category as string,
        },
        update: {},
      }),
  ),
);
console.log(`Demo account ready: ${email} / ${password}`);
await database.$disconnect();
