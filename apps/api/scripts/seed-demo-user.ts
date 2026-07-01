import "dotenv/config";
import argon2 from "argon2";
import { parseConfig } from "../src/config.js";
import { createDatabase } from "../src/shared/db.js";

const email = "demo@smartant.local";
const password = "SmartAntDemo2026!";
const database = createDatabase(parseConfig(process.env));
const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

await database.user.upsert({
  where: { email },
  create: { email, passwordHash },
  update: { passwordHash },
});
console.log(`Demo account ready: ${email} / ${password}`);
await database.$disconnect();
