import "dotenv/config";
import { createApp } from "./app.js";
import { parseConfig } from "./config.js";
import { loginUser } from "./features/auth/login.js";
import { registerUser } from "./features/auth/register.js";
import { authenticateSession, logoutSession } from "./features/auth/session.js";
import { getProfile, updateProfile } from "./features/profile/profile.js";
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
);

app.listen(config.port, () => {
  console.log(`Smart Ant API listening on port ${config.port}`);
});
