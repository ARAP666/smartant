import "dotenv/config";
import { createApp } from "./app.js";
import { parseConfig } from "./config.js";
import { loginUser } from "./features/auth/login.js";
import { registerUser } from "./features/auth/register.js";
import { authenticateSession, logoutSession } from "./features/auth/session.js";
import {
  createBudget,
  deleteBudget,
  listBudgets,
  updateBudget,
} from "./features/budgets/budgets.js";
import { listMovementHistory } from "./features/history/history.js";
import { confirmImport } from "./features/imports/imports.js";
import {
  createIncome,
  deleteIncome,
  listIncomes,
  updateIncome,
} from "./features/incomes/incomes.js";
import {
  confirmPendingMovement,
  deleteExpense,
  evaluatePendingMovement,
  reviewPendingMovement,
  updateExpense,
} from "./features/pending-movements/pending-movements.js";
import { getProfile, updateProfile } from "./features/profile/profile.js";
import {
  deleteReceiptAttachment,
  detectReceiptPendingMovement,
  getReceiptAttachment,
  saveReceiptAttachment,
} from "./features/receipts/receipts.js";
import {
  deleteSalary,
  generateSalaryIncome,
  getSalary,
  pauseSalary,
  upsertSalary,
} from "./features/salary/salary.js";
import {
  createSavingsGoal,
  deleteSavingsGoal,
  listSavingsGoals,
  updateSavingsGoal,
} from "./features/savings-goals/savings-goals.js";
import {
  getExpenseCategoryDistribution,
  getFinancialSummary,
} from "./features/summary/summary.js";
import { createDatabase } from "./shared/db.js";

const config = parseConfig(process.env);
const database = createDatabase(config);
const app = createApp(
  async () => {
    await database.$queryRawUnsafe("SELECT 1");
  },
  {
    register: (input) => registerUser(database, input),
    login: (input) => loginUser(database, input),
    authenticate: (token) => authenticateSession(database, token),
    logout: (token) => logoutSession(database, token),
  },
  {
    getProfile: (userId) => getProfile(database, userId),
    updateProfile: (userId, input) => updateProfile(database, userId, input),
  },
  {
    listIncomes: (userId) => listIncomes(database, userId),
    createIncome: (userId, input) => createIncome(database, userId, input),
    updateIncome: (userId, id, input) =>
      updateIncome(database, userId, id, input),
    deleteIncome: (userId, id) => deleteIncome(database, userId, id),
  },
  {
    getSalary: (userId) => getSalary(database, userId),
    upsertSalary: (userId, input) => upsertSalary(database, userId, input),
    pauseSalary: (userId, paused) => pauseSalary(database, userId, paused),
    deleteSalary: (userId) => deleteSalary(database, userId),
    generateSalaryIncome: (userId, input) =>
      generateSalaryIncome(database, userId, input),
  },
  {
    listBudgets: (userId) => listBudgets(database, userId),
    createBudget: (userId, input) => createBudget(database, userId, input),
    updateBudget: (userId, id, input) =>
      updateBudget(database, userId, id, input),
    deleteBudget: (userId, id) => deleteBudget(database, userId, id),
  },
  {
    listSavingsGoals: (userId) => listSavingsGoals(database, userId),
    createSavingsGoal: (userId, input) =>
      createSavingsGoal(database, userId, input),
    updateSavingsGoal: (userId, id, input) =>
      updateSavingsGoal(database, userId, id, input),
    deleteSavingsGoal: (userId, id) => deleteSavingsGoal(database, userId, id),
  },
  {
    evaluatePendingMovement: (userId, input) =>
      evaluatePendingMovement(database, userId, input),
    reviewPendingMovement: (userId, pendingMovementId, input) =>
      reviewPendingMovement(database, userId, pendingMovementId, input),
    confirmPendingMovement: (userId, pendingMovementId, input) =>
      confirmPendingMovement(database, userId, pendingMovementId, input),
    updateExpense: (userId, expenseId, input) =>
      updateExpense(database, userId, expenseId, input),
    deleteExpense: (userId, expenseId) =>
      deleteExpense(database, userId, expenseId),
  },
  {
    getFinancialSummary: (userId, period) =>
      getFinancialSummary(database, userId, period),
    getExpenseCategoryDistribution: (userId, period) =>
      getExpenseCategoryDistribution(database, userId, period),
  },
  {
    listMovementHistory: (userId, query) =>
      listMovementHistory(database, userId, query),
  },
  {
    detectReceiptPendingMovement: (userId, input) =>
      detectReceiptPendingMovement(database, userId, input),
    saveAttachment: (userId, expenseId, input) =>
      saveReceiptAttachment(database, userId, expenseId, input),
    getAttachment: (userId, expenseId) =>
      getReceiptAttachment(database, userId, expenseId),
    deleteAttachment: async (userId, expenseId) =>
      deleteReceiptAttachment(database, userId, expenseId),
  },
  {
    confirmImport: (userId, input) => confirmImport(database, userId, input),
  },
);

app.listen(config.port, () => {
  console.log(`Smart Ant API listening on port ${config.port}`);
});
