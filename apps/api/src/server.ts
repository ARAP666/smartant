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
import {
  createIncome,
  deleteIncome,
  listIncomes,
  updateIncome,
} from "./features/incomes/incomes.js";
import { getProfile, updateProfile } from "./features/profile/profile.js";
import {
  deleteSalary,
  generateSalaryIncome,
  getSalary,
  pauseSalary,
  upsertSalary,
} from "./features/salary/salary.js";
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
);

app.listen(config.port, () => {
  console.log(`Smart Ant API listening on port ${config.port}`);
});
