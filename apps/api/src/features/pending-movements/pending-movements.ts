import {
  calculateSpendableBalance,
  createFinancialAlerts,
} from "@smart-ant/finance";
import { z } from "zod";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors.js";

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .transform((value) => new Date(`${value}T00:00:00.000Z`));

export const pendingMovementSchema = z.object({
  amountMinor: z
    .string()
    .regex(/^[1-9]\d*$/)
    .transform((value) => BigInt(value)),
  date: dateSchema,
  description: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(80),
});

export const pendingMovementConfirmationSchema = z.object({
  idempotencyKey: z.string().trim().min(8).max(120),
  acceptedWarning: z.boolean().default(false),
});

export const expenseUpdateSchema = pendingMovementSchema.extend({
  acceptedWarning: z.boolean().default(false),
});

export type PendingMovementInput = z.infer<typeof pendingMovementSchema>;
export type PendingMovementConfirmationInput = z.infer<
  typeof pendingMovementConfirmationSchema
>;
export type ExpenseUpdateInput = z.infer<typeof expenseUpdateSchema>;

export async function evaluatePendingMovement(
  database: PrismaClient,
  userId: string,
  input: PendingMovementInput,
) {
  const [pendingMovement, incomes, expenses, budgets, savingsGoals] =
    await database.$transaction([
      database.pendingMovement.create({
        data: { ...input, userId },
        select: pendingFields,
      }),
      database.income.findMany({
        where: { userId },
        select: { amountMinor: true },
      }),
      database.expense.findMany({
        where: { userId },
        select: { amountMinor: true, category: true },
      }),
      database.budget.findMany({
        where: { userId, active: true },
        select: { id: true, amountMinor: true, category: true },
      }),
      database.savingsGoal.findMany({
        where: { userId, active: true },
        select: { id: true, amountMinor: true },
      }),
    ]);
  const evaluation = calculateSpendableBalance({
    incomes,
    expenses: [
      ...expenses,
      { amountMinor: input.amountMinor, category: input.category },
    ],
    budgets,
    savingsGoals,
    category: input.category,
  });

  return {
    pendingMovement: toPendingDto(pendingMovement),
    evaluation: {
      baseBalance: evaluation.baseBalance.toString(),
      spendableBalance: evaluation.spendableBalance.toString(),
      margins: evaluation.margins.map((margin) => ({
        ...margin,
        amountMinor: margin.amountMinor.toString(),
      })),
      alerts: createFinancialAlerts({
        spendableBalance: evaluation.spendableBalance,
        expenseAmountMinor: input.amountMinor,
        margins: evaluation.margins,
      }).map((alert) => ({
        ...alert,
        amountMinor: alert.amountMinor.toString(),
        spendableBalance: alert.spendableBalance.toString(),
      })),
    },
  };
}

export async function reviewPendingMovement(
  database: PrismaClient,
  userId: string,
  pendingMovementId: string,
  input: PendingMovementInput,
) {
  const updated = await database.pendingMovement.updateMany({
    where: { id: pendingMovementId, userId, status: "PENDING" },
    data: input,
  });
  if (updated.count === 0) throw notFound();
  const pendingMovement = await database.pendingMovement.findFirstOrThrow({
    where: { id: pendingMovementId, userId },
    select: pendingFields,
  });
  const [incomes, expenses, budgets, savingsGoals] = await Promise.all([
    database.income.findMany({
      where: { userId },
      select: { amountMinor: true },
    }),
    database.expense.findMany({
      where: { userId },
      select: { amountMinor: true, category: true },
    }),
    database.budget.findMany({
      where: { userId, active: true },
      select: { id: true, amountMinor: true, category: true },
    }),
    database.savingsGoal.findMany({
      where: { userId, active: true },
      select: { id: true, amountMinor: true },
    }),
  ]);
  const evaluation = calculateSpendableBalance({
    incomes,
    expenses: [
      ...expenses,
      { amountMinor: input.amountMinor, category: input.category },
    ],
    budgets,
    savingsGoals,
    category: input.category,
  });
  const alerts = createFinancialAlerts({
    spendableBalance: evaluation.spendableBalance,
    expenseAmountMinor: input.amountMinor,
    margins: evaluation.margins,
  });

  return {
    pendingMovement: toPendingDto(pendingMovement),
    evaluation: toEvaluationDto(evaluation, alerts),
  };
}

export async function confirmPendingMovement(
  database: PrismaClient,
  userId: string,
  pendingMovementId: string,
  input: PendingMovementConfirmationInput,
) {
  return database.$transaction(async (transaction) => {
    const existingExpense = await transaction.expense.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
      select: expenseFields,
    });

    if (existingExpense) {
      if (existingExpense.userId !== userId) throw notFound();
      return { expense: toExpenseDto(existingExpense), created: false };
    }

    const pendingMovement = await transaction.pendingMovement.findFirst({
      where: { id: pendingMovementId, userId },
      select: pendingFields,
    });
    if (!pendingMovement) throw notFound();

    const alreadyConfirmed = await transaction.expense.findUnique({
      where: { pendingMovementId },
      select: expenseFields,
    });
    if (alreadyConfirmed) {
      return { expense: toExpenseDto(alreadyConfirmed), created: false };
    }

    const [incomes, expenses, budgets, savingsGoals] = await Promise.all([
      transaction.income.findMany({
        where: { userId },
        select: { amountMinor: true },
      }),
      transaction.expense.findMany({
        where: { userId },
        select: { amountMinor: true, category: true },
      }),
      transaction.budget.findMany({
        where: { userId, active: true },
        select: { id: true, amountMinor: true, category: true },
      }),
      transaction.savingsGoal.findMany({
        where: { userId, active: true },
        select: { id: true, amountMinor: true },
      }),
    ]);
    const evaluation = calculateSpendableBalance({
      incomes,
      expenses: [
        ...expenses,
        {
          amountMinor: pendingMovement.amountMinor,
          category: pendingMovement.category,
        },
      ],
      budgets,
      savingsGoals,
      category: pendingMovement.category,
    });
    const alerts = createFinancialAlerts({
      spendableBalance: evaluation.spendableBalance,
      expenseAmountMinor: pendingMovement.amountMinor,
      margins: evaluation.margins,
    });
    if (
      !input.acceptedWarning &&
      alerts.some((alert) => alert.severity === "BLOCKING")
    ) {
      throw new AppError(
        409,
        "WARNING_NOT_ACCEPTED",
        "Confirmation requires accepted warning",
      );
    }

    const expense = await transaction.expense.create({
      data: {
        userId,
        pendingMovementId,
        idempotencyKey: input.idempotencyKey,
        amountMinor: pendingMovement.amountMinor,
        date: pendingMovement.date,
        description: pendingMovement.description,
        category: pendingMovement.category,
      },
      select: expenseFields,
    });
    await transaction.pendingMovement.update({
      where: { id: pendingMovementId },
      data: { status: "CONFIRMED" },
    });

    return { expense: toExpenseDto(expense), created: true };
  });
}

export async function updateExpense(
  database: PrismaClient,
  userId: string,
  expenseId: string,
  input: ExpenseUpdateInput,
) {
  return database.$transaction(async (transaction) => {
    const currentExpense = await transaction.expense.findFirst({
      where: { id: expenseId, userId },
      select: expenseFields,
    });
    if (!currentExpense) throw expenseNotFound();

    const [incomes, expenses, budgets, savingsGoals] = await Promise.all([
      transaction.income.findMany({
        where: { userId },
        select: { amountMinor: true },
      }),
      transaction.expense.findMany({
        where: { userId, NOT: { id: expenseId } },
        select: { amountMinor: true, category: true },
      }),
      transaction.budget.findMany({
        where: { userId, active: true },
        select: { id: true, amountMinor: true, category: true },
      }),
      transaction.savingsGoal.findMany({
        where: { userId, active: true },
        select: { id: true, amountMinor: true },
      }),
    ]);
    const evaluation = calculateSpendableBalance({
      incomes,
      expenses: [
        ...expenses,
        { amountMinor: input.amountMinor, category: input.category },
      ],
      budgets,
      savingsGoals,
      category: input.category,
    });
    const alerts = createFinancialAlerts({
      spendableBalance: evaluation.spendableBalance,
      expenseAmountMinor: input.amountMinor,
      margins: evaluation.margins,
    });
    if (
      !input.acceptedWarning &&
      alerts.some((alert) => alert.severity === "BLOCKING")
    ) {
      throw new AppError(
        409,
        "WARNING_NOT_ACCEPTED",
        "Expense update requires accepted warning",
      );
    }

    const expense = await transaction.expense.update({
      where: { id: expenseId },
      data: {
        amountMinor: input.amountMinor,
        date: input.date,
        description: input.description,
        category: input.category,
      },
      select: expenseFields,
    });

    return {
      expense: toExpenseDto(expense),
      evaluation: toEvaluationDto(evaluation, alerts),
    };
  });
}

export async function deleteExpense(
  database: PrismaClient,
  userId: string,
  expenseId: string,
) {
  await database.$transaction(async (transaction) => {
    const expense = await transaction.expense.findFirst({
      where: { id: expenseId, userId },
      select: { id: true, pendingMovementId: true },
    });
    if (!expense) throw expenseNotFound();

    await transaction.expense.delete({ where: { id: expense.id } });
    await transaction.pendingMovement.update({
      where: { id: expense.pendingMovementId },
      data: { status: "PENDING" },
    });
  });
}

const pendingFields = {
  id: true,
  amountMinor: true,
  date: true,
  description: true,
  category: true,
  status: true,
} as const;

const expenseFields = {
  id: true,
  userId: true,
  pendingMovementId: true,
  amountMinor: true,
  date: true,
  description: true,
  category: true,
  idempotencyKey: true,
} as const;

function toPendingDto(pendingMovement: {
  id: string;
  amountMinor: bigint;
  date: Date;
  description: string;
  category: string;
  status: string;
}) {
  return {
    ...pendingMovement,
    amountMinor: pendingMovement.amountMinor.toString(),
    date: pendingMovement.date.toISOString().slice(0, 10),
  };
}

function toExpenseDto(expense: {
  id: string;
  pendingMovementId: string;
  amountMinor: bigint;
  date: Date;
  description: string;
  category: string;
}) {
  return {
    id: expense.id,
    pendingMovementId: expense.pendingMovementId,
    amountMinor: expense.amountMinor.toString(),
    date: expense.date.toISOString().slice(0, 10),
    description: expense.description,
    category: expense.category,
  };
}

function toEvaluationDto(
  evaluation: ReturnType<typeof calculateSpendableBalance>,
  alerts: ReturnType<typeof createFinancialAlerts>,
) {
  return {
    baseBalance: evaluation.baseBalance.toString(),
    spendableBalance: evaluation.spendableBalance.toString(),
    margins: evaluation.margins.map((margin) => ({
      ...margin,
      amountMinor: margin.amountMinor.toString(),
    })),
    alerts: alerts.map((alert) => ({
      ...alert,
      amountMinor: alert.amountMinor.toString(),
      spendableBalance: alert.spendableBalance.toString(),
    })),
  };
}

function notFound() {
  return new AppError(
    404,
    "PENDING_MOVEMENT_NOT_FOUND",
    "Pending movement not found",
  );
}

function expenseNotFound() {
  return new AppError(404, "EXPENSE_NOT_FOUND", "Expense not found");
}
