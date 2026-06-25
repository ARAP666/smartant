import "dotenv/config";
import { parseConfig } from "../src/config.js";
import { loginUser } from "../src/features/auth/login.js";
import { registerUser } from "../src/features/auth/register.js";
import { createDatabase } from "../src/shared/db.js";

const email = "demo@smartant.local";
const password = "SmartAntDemo2026!";
const database = createDatabase(parseConfig(process.env));

try {
  await registerUser(database, { email, password });
} catch (error) {
  if (!isEmailConflict(error)) throw error;
}

await loginUser(database, { email, password });
console.log(`Demo account ready: ${email} / ${password}`);
await database.$disconnect();

function isEmailConflict(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "EMAIL_ALREADY_REGISTERED"
  );
}
