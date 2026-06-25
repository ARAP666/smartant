import { randomUUID } from "node:crypto";
import express from "express";
import multer from "multer";
import { z } from "zod";
import { type LoginInput, loginSchema } from "./features/auth/login.js";
import {
  type RegisterInput,
  registerSchema,
} from "./features/auth/register.js";
import { getBearerToken } from "./features/auth/session.js";
import { type BudgetInput, budgetSchema } from "./features/budgets/budgets.js";
import {
  type HistoryQuery,
  historyQuerySchema,
} from "./features/history/history.js";
import {
  type ImportConfirmationInput,
  importConfirmationSchema,
} from "./features/imports/imports.js";
import { type IncomeInput, incomeSchema } from "./features/incomes/incomes.js";
import {
  type ExpenseUpdateInput,
  expenseUpdateSchema,
  type PendingMovementConfirmationInput,
  type PendingMovementInput,
  pendingMovementConfirmationSchema,
  pendingMovementSchema,
} from "./features/pending-movements/pending-movements.js";
import {
  type ProfileInput,
  profileSchema,
} from "./features/profile/profile.js";
import {
  invalidReceiptFile,
  type ReceiptDetectionInput,
  receiptDetectionSchema,
} from "./features/receipts/receipts.js";
import {
  type SalaryGenerationInput,
  type SalaryInput,
  salaryGenerationSchema,
  salarySchema,
} from "./features/salary/salary.js";
import {
  type SavingsGoalInput,
  savingsGoalSchema,
} from "./features/savings-goals/savings-goals.js";
import {
  type SummaryPeriod,
  summaryPeriodSchema,
} from "./features/summary/summary.js";
import { AppError } from "./shared/errors.js";

type RegistrationResult = {
  user: { id: string; email: string };
  sessionToken: string;
};

export type AuthHandlers = {
  register: (input: RegisterInput) => Promise<RegistrationResult>;
  login: (input: LoginInput) => Promise<RegistrationResult>;
  authenticate: (
    token: string,
  ) => Promise<{ id: string; email: string } | null>;
  logout: (token: string) => Promise<void>;
};

export type ProfileHandlers = {
  getProfile: (userId: string) => Promise<{
    profile: { email: string; currency: string; timeZone: string };
  }>;
  updateProfile: (
    userId: string,
    input: ProfileInput,
  ) => Promise<{
    profile: { email: string; currency: string; timeZone: string };
  }>;
};

type IncomeDto = {
  id: string;
  amountMinor: string;
  date: string;
  description: string;
};

type BudgetDto = {
  id: string;
  amountMinor: string;
  period: string;
  category: string | null;
  active: boolean;
};

type SavingsGoalDto = {
  id: string;
  amountMinor: string;
  period: string;
  active: boolean;
};

type PendingMovementDto = {
  id: string;
  amountMinor: string;
  date: string;
  description: string;
  category: string;
  status: string;
};

type ExpenseDto = {
  id: string;
  pendingMovementId: string;
  amountMinor: string;
  date: string;
  description: string;
  category: string;
};

type EvaluationDto = {
  baseBalance: string;
  spendableBalance: string;
  margins: Array<{
    kind: string;
    id?: string;
    category?: string | null;
    amountMinor: string;
  }>;
  alerts?: Array<{
    severity: string;
    rule: string;
    amountMinor: string;
    spendableBalance: string;
  }>;
};

type SalaryDto = {
  id: string;
  amountMinor: string;
  frequency: string;
  nextDate: string;
  pausedAt: Date | null;
  paused: boolean;
};

type FinancialSummaryDto = {
  period: { kind: string; start: string; end: string; timeZone: string };
  incomeTotal: string;
  expenseTotal: string;
  savingsGoalTotal: string;
  budgetTotal: string;
  spendableBalance: string;
  empty: boolean;
};

type ExpenseCategoryDto = {
  category: string;
  amountMinor: string;
  percentage: number;
};

type HistoryMovementDto = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amountMinor: string;
  date: string;
  description: string;
  category: string | null;
};

type ReceiptDetectionDto = {
  pendingMovement: PendingMovementDto;
  detected: {
    amountMinor: string;
    date: string;
    description: string;
    category: string;
    confidence: { amount: boolean; date: boolean; description: boolean };
  };
};

type ImportConfirmationDto = {
  created: number;
  skipped: number;
  failed: number;
  rows: Array<{
    rowId: string;
    status: "CREATED" | "SKIPPED";
    expenseId?: string;
    alertSeverity?: string;
    reason?: string;
  }>;
};

export type IncomeHandlers = {
  listIncomes: (userId: string) => Promise<{ incomes: IncomeDto[] }>;
  createIncome: (
    userId: string,
    input: IncomeInput,
  ) => Promise<{ income: IncomeDto }>;
  updateIncome: (
    userId: string,
    id: string,
    input: IncomeInput,
  ) => Promise<{ income: IncomeDto }>;
  deleteIncome: (userId: string, id: string) => Promise<void>;
};

export type BudgetHandlers = {
  listBudgets: (userId: string) => Promise<{ budgets: BudgetDto[] }>;
  createBudget: (
    userId: string,
    input: BudgetInput,
  ) => Promise<{ budget: BudgetDto }>;
  updateBudget: (
    userId: string,
    id: string,
    input: BudgetInput,
  ) => Promise<{ budget: BudgetDto }>;
  deleteBudget: (userId: string, id: string) => Promise<void>;
};

export type SavingsGoalHandlers = {
  listSavingsGoals: (
    userId: string,
  ) => Promise<{ savingsGoals: SavingsGoalDto[] }>;
  createSavingsGoal: (
    userId: string,
    input: SavingsGoalInput,
  ) => Promise<{ savingsGoal: SavingsGoalDto }>;
  updateSavingsGoal: (
    userId: string,
    id: string,
    input: SavingsGoalInput,
  ) => Promise<{ savingsGoal: SavingsGoalDto }>;
  deleteSavingsGoal: (userId: string, id: string) => Promise<void>;
};

export type PendingMovementHandlers = {
  evaluatePendingMovement: (
    userId: string,
    input: PendingMovementInput,
  ) => Promise<{
    pendingMovement: PendingMovementDto;
    evaluation: EvaluationDto;
  }>;
  reviewPendingMovement: (
    userId: string,
    pendingMovementId: string,
    input: PendingMovementInput,
  ) => Promise<{
    pendingMovement: PendingMovementDto;
    evaluation: EvaluationDto;
  }>;
  confirmPendingMovement: (
    userId: string,
    pendingMovementId: string,
    input: PendingMovementConfirmationInput,
  ) => Promise<{
    expense: ExpenseDto;
    created: boolean;
  }>;
  updateExpense: (
    userId: string,
    expenseId: string,
    input: ExpenseUpdateInput,
  ) => Promise<{
    expense: ExpenseDto;
    evaluation: EvaluationDto;
  }>;
  deleteExpense: (userId: string, expenseId: string) => Promise<void>;
};

export type SalaryHandlers = {
  getSalary: (userId: string) => Promise<{ salary: SalaryDto | null }>;
  upsertSalary: (
    userId: string,
    input: SalaryInput,
  ) => Promise<{ salary: SalaryDto }>;
  pauseSalary: (
    userId: string,
    paused: boolean,
  ) => Promise<{ salary: SalaryDto }>;
  deleteSalary: (userId: string) => Promise<void>;
  generateSalaryIncome: (
    userId: string,
    input: SalaryGenerationInput,
  ) => Promise<{ income: IncomeDto; generated: boolean }>;
};

export type SummaryHandlers = {
  getFinancialSummary: (
    userId: string,
    period: SummaryPeriod,
  ) => Promise<{ summary: FinancialSummaryDto }>;
  getExpenseCategoryDistribution: (
    userId: string,
    period: SummaryPeriod,
  ) => Promise<{
    categories: ExpenseCategoryDto[];
    totalExpenseMinor: string;
  }>;
};

export type HistoryHandlers = {
  listMovementHistory: (
    userId: string,
    query: HistoryQuery,
  ) => Promise<{
    movements: HistoryMovementDto[];
    page: {
      offset: number;
      limit: number;
      total: number;
      nextOffset: number | null;
    };
  }>;
};

export type ReceiptHandlers = {
  detectReceiptPendingMovement: (
    userId: string,
    input: ReceiptDetectionInput,
  ) => Promise<ReceiptDetectionDto>;
};

export type ImportHandlers = {
  confirmImport: (
    userId: string,
    input: ImportConfirmationInput,
  ) => Promise<ImportConfirmationDto>;
};

const unavailable: AuthHandlers = {
  register: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Registration unavailable");
  },
  login: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Login unavailable");
  },
  authenticate: async () => null,
  logout: async () => {
    throw unauthorized();
  },
};

const unavailableProfile: ProfileHandlers = {
  getProfile: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Profile unavailable");
  },
  updateProfile: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Profile unavailable");
  },
};

const unavailableIncomes: IncomeHandlers = {
  listIncomes: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Incomes unavailable");
  },
  createIncome: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Incomes unavailable");
  },
  updateIncome: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Incomes unavailable");
  },
  deleteIncome: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Incomes unavailable");
  },
};

const unavailableBudgets: BudgetHandlers = {
  listBudgets: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Budgets unavailable");
  },
  createBudget: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Budgets unavailable");
  },
  updateBudget: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Budgets unavailable");
  },
  deleteBudget: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Budgets unavailable");
  },
};

const unavailableSavingsGoals: SavingsGoalHandlers = {
  listSavingsGoals: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Savings goals unavailable");
  },
  createSavingsGoal: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Savings goals unavailable");
  },
  updateSavingsGoal: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Savings goals unavailable");
  },
  deleteSavingsGoal: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Savings goals unavailable");
  },
};

const unavailablePendingMovements: PendingMovementHandlers = {
  evaluatePendingMovement: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Pending movements unavailable");
  },
  reviewPendingMovement: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Pending movements unavailable");
  },
  confirmPendingMovement: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Pending movements unavailable");
  },
  updateExpense: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Expenses unavailable");
  },
  deleteExpense: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Expenses unavailable");
  },
};

const unavailableSalary: SalaryHandlers = {
  getSalary: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Salary unavailable");
  },
  upsertSalary: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Salary unavailable");
  },
  pauseSalary: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Salary unavailable");
  },
  deleteSalary: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Salary unavailable");
  },
  generateSalaryIncome: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Salary unavailable");
  },
};

const unavailableSummary: SummaryHandlers = {
  getFinancialSummary: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Summary unavailable");
  },
  getExpenseCategoryDistribution: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Summary unavailable");
  },
};

const unavailableHistory: HistoryHandlers = {
  listMovementHistory: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "History unavailable");
  },
};

const unavailableReceipts: ReceiptHandlers = {
  detectReceiptPendingMovement: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Receipts unavailable");
  },
};

const unavailableImports: ImportHandlers = {
  confirmImport: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Imports unavailable");
  },
};

export function createApp(
  checkDatabase: () => Promise<void>,
  auth: Partial<AuthHandlers> | AuthHandlers["register"] = {},
  profile: Partial<ProfileHandlers> = {},
  incomes: Partial<IncomeHandlers> = {},
  salary: Partial<SalaryHandlers> = {},
  budgets: Partial<BudgetHandlers> = {},
  savingsGoals: Partial<SavingsGoalHandlers> = {},
  pendingMovements: Partial<PendingMovementHandlers> = {},
  summary: Partial<SummaryHandlers> = {},
  history: Partial<HistoryHandlers> = {},
  receipts: Partial<ReceiptHandlers> = {},
  imports: Partial<ImportHandlers> = {},
) {
  const handlers =
    typeof auth === "function"
      ? { ...unavailable, register: auth }
      : { ...unavailable, ...auth };
  const profileHandlers = { ...unavailableProfile, ...profile };
  const incomeHandlers = { ...unavailableIncomes, ...incomes };
  const salaryHandlers = { ...unavailableSalary, ...salary };
  const budgetHandlers = { ...unavailableBudgets, ...budgets };
  const savingsGoalHandlers = {
    ...unavailableSavingsGoals,
    ...savingsGoals,
  };
  const pendingMovementHandlers = {
    ...unavailablePendingMovements,
    ...pendingMovements,
  };
  const summaryHandlers = { ...unavailableSummary, ...summary };
  const historyHandlers = { ...unavailableHistory, ...history };
  const receiptHandlers = { ...unavailableReceipts, ...receipts };
  const importHandlers = { ...unavailableImports, ...imports };
  const app = express();
  app.disable("x-powered-by");
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
  });
  app.use(operationalMiddleware);
  app.use(authRateLimit());
  app.use(express.json({ limit: "256kb" }));

  app.get("/api/v1/health", async (_request, response) => {
    try {
      await checkDatabase();
      response.json({ data: { status: "ok", database: "ok" } });
    } catch {
      sendError(
        response,
        new AppError(503, "DATABASE_UNAVAILABLE", "Database unavailable"),
      );
    }
  });

  app.post("/api/v1/auth/register", async (request, response) => {
    const requestId = randomUUID();
    const parsed = registerSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(422).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid registration data",
          details: { fieldErrors: parsed.error.flatten().fieldErrors },
          requestId,
        },
      });
      return;
    }

    try {
      response.status(201).json({ data: await handlers.register(parsed.data) });
    } catch (error) {
      const safeError =
        error instanceof AppError
          ? error
          : new AppError(500, "INTERNAL_ERROR", "Unexpected server error");
      response.status(safeError.status).json({
        error: {
          code: safeError.code,
          message: safeError.message,
          details: safeError.details,
          requestId,
        },
      });
    }
  });

  app.post("/api/v1/auth/login", async (request, response) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      sendError(
        response,
        new AppError(422, "VALIDATION_ERROR", "Invalid login data", {
          fieldErrors: parsed.error.flatten().fieldErrors,
        }),
      );
      return;
    }

    try {
      response.json({ data: await handlers.login(parsed.data) });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.get("/api/v1/auth/session", async (request, response) => {
    try {
      const token = getBearerToken(request.header("Authorization"));
      const user = token ? await handlers.authenticate(token) : null;
      if (!user) {
        sendError(response, unauthorized());
        return;
      }
      response.json({ data: { user } });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.post("/api/v1/auth/logout", async (request, response) => {
    try {
      const token = getBearerToken(request.header("Authorization"));
      const user = token ? await handlers.authenticate(token) : null;
      if (!token || !user) {
        sendError(response, unauthorized());
        return;
      }
      await handlers.logout(token);
      response.status(204).send();
    } catch (error) {
      sendError(response, error);
    }
  });

  app.get("/api/v1/profile", async (request, response) => {
    try {
      const user = await authenticateRequest(request, handlers);
      response.json({ data: await profileHandlers.getProfile(user.id) });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.patch("/api/v1/profile", async (request, response) => {
    const parsed = profileSchema.safeParse(request.body);
    if (!parsed.success) {
      sendError(
        response,
        new AppError(422, "VALIDATION_ERROR", "Invalid profile data", {
          fieldErrors: parsed.error.flatten().fieldErrors,
        }),
      );
      return;
    }

    try {
      const user = await authenticateRequest(request, handlers);
      response.json({
        data: await profileHandlers.updateProfile(user.id, parsed.data),
      });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.get("/api/v1/incomes", async (request, response) => {
    try {
      const user = await authenticateRequest(request, handlers);
      response.json({ data: await incomeHandlers.listIncomes(user.id) });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.post("/api/v1/incomes", async (request, response) => {
    const parsed = incomeSchema.safeParse(request.body);
    if (!parsed.success) {
      sendError(response, validationError(parsed.error));
      return;
    }

    try {
      const user = await authenticateRequest(request, handlers);
      response.status(201).json({
        data: await incomeHandlers.createIncome(user.id, parsed.data),
      });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.patch("/api/v1/incomes/:id", async (request, response) => {
    const parsed = incomeSchema.safeParse(request.body);
    if (!parsed.success) {
      sendError(response, validationError(parsed.error));
      return;
    }

    try {
      const user = await authenticateRequest(request, handlers);
      response.json({
        data: await incomeHandlers.updateIncome(
          user.id,
          request.params.id,
          parsed.data,
        ),
      });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.delete("/api/v1/incomes/:id", async (request, response) => {
    try {
      const user = await authenticateRequest(request, handlers);
      await incomeHandlers.deleteIncome(user.id, request.params.id);
      response.status(204).send();
    } catch (error) {
      sendError(response, error);
    }
  });

  app.get("/api/v1/budgets", async (request, response) => {
    try {
      const user = await authenticateRequest(request, handlers);
      response.json({ data: await budgetHandlers.listBudgets(user.id) });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.post("/api/v1/budgets", async (request, response) => {
    const parsed = budgetSchema.safeParse(request.body);
    if (!parsed.success) {
      sendError(response, validationError(parsed.error));
      return;
    }

    try {
      const user = await authenticateRequest(request, handlers);
      response.status(201).json({
        data: await budgetHandlers.createBudget(user.id, parsed.data),
      });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.patch("/api/v1/budgets/:id", async (request, response) => {
    const parsed = budgetSchema.safeParse(request.body);
    if (!parsed.success) {
      sendError(response, validationError(parsed.error));
      return;
    }

    try {
      const user = await authenticateRequest(request, handlers);
      response.json({
        data: await budgetHandlers.updateBudget(
          user.id,
          request.params.id,
          parsed.data,
        ),
      });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.delete("/api/v1/budgets/:id", async (request, response) => {
    try {
      const user = await authenticateRequest(request, handlers);
      await budgetHandlers.deleteBudget(user.id, request.params.id);
      response.status(204).send();
    } catch (error) {
      sendError(response, error);
    }
  });

  app.get("/api/v1/savings-goals", async (request, response) => {
    try {
      const user = await authenticateRequest(request, handlers);
      response.json({
        data: await savingsGoalHandlers.listSavingsGoals(user.id),
      });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.post("/api/v1/savings-goals", async (request, response) => {
    const parsed = savingsGoalSchema.safeParse(request.body);
    if (!parsed.success) {
      sendError(response, validationError(parsed.error));
      return;
    }

    try {
      const user = await authenticateRequest(request, handlers);
      response.status(201).json({
        data: await savingsGoalHandlers.createSavingsGoal(user.id, parsed.data),
      });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.patch("/api/v1/savings-goals/:id", async (request, response) => {
    const parsed = savingsGoalSchema.safeParse(request.body);
    if (!parsed.success) {
      sendError(response, validationError(parsed.error));
      return;
    }

    try {
      const user = await authenticateRequest(request, handlers);
      response.json({
        data: await savingsGoalHandlers.updateSavingsGoal(
          user.id,
          request.params.id,
          parsed.data,
        ),
      });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.delete("/api/v1/savings-goals/:id", async (request, response) => {
    try {
      const user = await authenticateRequest(request, handlers);
      await savingsGoalHandlers.deleteSavingsGoal(user.id, request.params.id);
      response.status(204).send();
    } catch (error) {
      sendError(response, error);
    }
  });

  app.post("/api/v1/pending-movements/evaluate", async (request, response) => {
    const parsed = pendingMovementSchema.safeParse(request.body);
    if (!parsed.success) {
      sendError(response, validationError(parsed.error));
      return;
    }

    try {
      const user = await authenticateRequest(request, handlers);
      response.status(201).json({
        data: await pendingMovementHandlers.evaluatePendingMovement(
          user.id,
          parsed.data,
        ),
      });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.patch(
    "/api/v1/pending-movements/:id/review",
    async (request, response) => {
      const parsed = pendingMovementSchema.safeParse(request.body);
      if (!parsed.success) {
        sendError(response, validationError(parsed.error));
        return;
      }

      try {
        const user = await authenticateRequest(request, handlers);
        response.json({
          data: await pendingMovementHandlers.reviewPendingMovement(
            user.id,
            request.params.id,
            parsed.data,
          ),
        });
      } catch (error) {
        sendError(response, error);
      }
    },
  );

  app.post(
    "/api/v1/pending-movements/:id/confirm",
    async (request, response) => {
      const parsed = pendingMovementConfirmationSchema.safeParse(request.body);
      if (!parsed.success) {
        sendError(response, validationError(parsed.error));
        return;
      }

      try {
        const user = await authenticateRequest(request, handlers);
        const data = await pendingMovementHandlers.confirmPendingMovement(
          user.id,
          request.params.id,
          parsed.data,
        );
        response.status(data.created ? 201 : 200).json({ data });
      } catch (error) {
        sendError(response, error);
      }
    },
  );

  app.patch("/api/v1/expenses/:id", async (request, response) => {
    const parsed = expenseUpdateSchema.safeParse(request.body);
    if (!parsed.success) {
      sendError(response, validationError(parsed.error));
      return;
    }

    try {
      const user = await authenticateRequest(request, handlers);
      response.json({
        data: await pendingMovementHandlers.updateExpense(
          user.id,
          request.params.id,
          parsed.data,
        ),
      });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.delete("/api/v1/expenses/:id", async (request, response) => {
    try {
      const user = await authenticateRequest(request, handlers);
      await pendingMovementHandlers.deleteExpense(user.id, request.params.id);
      response.status(204).send();
    } catch (error) {
      sendError(response, error);
    }
  });

  app.get("/api/v1/summary", async (request, response) => {
    const parsed = summaryPeriodSchema.safeParse(request.query.period);
    if (!parsed.success) {
      sendError(response, validationError(parsed.error));
      return;
    }

    try {
      const user = await authenticateRequest(request, handlers);
      response.json({
        data: await summaryHandlers.getFinancialSummary(user.id, parsed.data),
      });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.get("/api/v1/summary/categories", async (request, response) => {
    const parsed = summaryPeriodSchema.safeParse(request.query.period);
    if (!parsed.success) {
      sendError(response, validationError(parsed.error));
      return;
    }

    try {
      const user = await authenticateRequest(request, handlers);
      response.json({
        data: await summaryHandlers.getExpenseCategoryDistribution(
          user.id,
          parsed.data,
        ),
      });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.get("/api/v1/history", async (request, response) => {
    const parsed = historyQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      sendError(response, validationError(parsed.error));
      return;
    }

    try {
      const user = await authenticateRequest(request, handlers);
      response.json({
        data: await historyHandlers.listMovementHistory(user.id, parsed.data),
      });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.post(
    "/api/v1/receipts/detect",
    upload.single("receipt"),
    async (request, response) => {
      try {
        const user = await authenticateRequest(request, handlers);
        if (!request.file) {
          sendError(response, invalidReceiptFile());
          return;
        }
        const parsed = receiptDetectionSchema.safeParse({
          originalName: request.file.originalname,
          mimeType: request.file.mimetype,
          size: request.file.size,
          text:
            typeof request.body.text === "string"
              ? request.body.text
              : undefined,
        });
        if (!parsed.success) {
          sendError(response, validationError(parsed.error));
          return;
        }
        response.status(201).json({
          data: await receiptHandlers.detectReceiptPendingMovement(
            user.id,
            parsed.data,
          ),
        });
      } catch (error) {
        sendError(response, error);
      }
    },
  );

  app.post("/api/v1/imports/confirm", async (request, response) => {
    const parsed = importConfirmationSchema.safeParse(request.body);
    if (!parsed.success) {
      sendError(response, validationError(parsed.error));
      return;
    }

    try {
      const user = await authenticateRequest(request, handlers);
      response.status(201).json({
        data: await importHandlers.confirmImport(user.id, parsed.data),
      });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.get("/api/v1/salary", async (request, response) => {
    try {
      const user = await authenticateRequest(request, handlers);
      response.json({ data: await salaryHandlers.getSalary(user.id) });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.put("/api/v1/salary", async (request, response) => {
    const parsed = salarySchema.safeParse(request.body);
    if (!parsed.success) {
      sendError(response, validationError(parsed.error));
      return;
    }

    try {
      const user = await authenticateRequest(request, handlers);
      response.json({
        data: await salaryHandlers.upsertSalary(user.id, parsed.data),
      });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.patch("/api/v1/salary/pause", async (request, response) => {
    const parsed = pauseSchema.safeParse(request.body);
    if (!parsed.success) {
      sendError(response, validationError(parsed.error));
      return;
    }

    try {
      const user = await authenticateRequest(request, handlers);
      response.json({
        data: await salaryHandlers.pauseSalary(user.id, parsed.data.paused),
      });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.delete("/api/v1/salary", async (request, response) => {
    try {
      const user = await authenticateRequest(request, handlers);
      await salaryHandlers.deleteSalary(user.id);
      response.status(204).send();
    } catch (error) {
      sendError(response, error);
    }
  });

  app.post("/api/v1/salary/generate", async (request, response) => {
    const parsed = salaryGenerationSchema.safeParse(request.body ?? {});
    if (!parsed.success) {
      sendError(response, validationError(parsed.error));
      return;
    }

    try {
      const user = await authenticateRequest(request, handlers);
      response.status(201).json({
        data: await salaryHandlers.generateSalaryIncome(user.id, parsed.data),
      });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.use(
    (
      error: unknown,
      _request: express.Request,
      response: express.Response,
      _next: express.NextFunction,
    ) => {
      sendError(
        response,
        error instanceof multer.MulterError ? invalidReceiptFile() : error,
      );
    },
  );

  return app;
}

function unauthorized() {
  return new AppError(401, "UNAUTHORIZED", "Authentication required");
}

function sendError(response: express.Response, error: unknown) {
  const safeError =
    error instanceof AppError
      ? error
      : new AppError(500, "INTERNAL_ERROR", "Unexpected server error");
  response.status(safeError.status).json({
    error: {
      code: safeError.code,
      message: safeError.message,
      details: safeError.details,
      requestId:
        typeof response.locals.requestId === "string"
          ? response.locals.requestId
          : randomUUID(),
    },
  });
}

async function authenticateRequest(
  request: express.Request,
  handlers: AuthHandlers,
) {
  const token = getBearerToken(request.header("Authorization"));
  const user = token ? await handlers.authenticate(token) : null;
  if (!user) throw unauthorized();
  return user;
}

function validationError(error: { flatten: () => { fieldErrors: unknown } }) {
  return new AppError(422, "VALIDATION_ERROR", "Invalid request data", {
    fieldErrors: error.flatten().fieldErrors,
  });
}

const pauseSchema = z.object({ paused: z.boolean() });

function operationalMiddleware(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  const requestId = request.header("x-request-id") ?? randomUUID();
  const startedAt = Date.now();
  response.locals.requestId = requestId;
  response.setHeader("X-Request-Id", requestId);
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("Cross-Origin-Resource-Policy", "same-site");
  response.on("finish", () => {
    console.log(
      JSON.stringify({
        level: "info",
        event: "http_request",
        requestId,
        method: request.method,
        path: request.path,
        status: response.statusCode,
        durationMs: Date.now() - startedAt,
      }),
    );
  });
  next();
}

function authRateLimit() {
  const attempts = new Map<string, { count: number; resetAt: number }>();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 20;

  return (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    if (
      !["/api/v1/auth/login", "/api/v1/auth/register"].includes(request.path)
    ) {
      next();
      return;
    }

    const now = Date.now();
    const key = `${request.ip}:${request.path}`;
    const current = attempts.get(key);
    const attempt =
      current && current.resetAt > now
        ? { count: current.count + 1, resetAt: current.resetAt }
        : { count: 1, resetAt: now + windowMs };
    attempts.set(key, attempt);

    if (attempt.count > maxAttempts) {
      response.setHeader(
        "Retry-After",
        String(Math.ceil((attempt.resetAt - now) / 1000)),
      );
      sendError(
        response,
        new AppError(429, "RATE_LIMITED", "Too many authentication attempts"),
      );
      return;
    }

    next();
  };
}
