import { PrismaPg } from "@prisma/adapter-pg";
import type { parseConfig } from "../config.js";
import { PrismaClient } from "../generated/prisma/client.js";

export function createDatabase(config: ReturnType<typeof parseConfig>) {
  const adapter = new PrismaPg({ connectionString: config.databaseUrl });
  return new PrismaClient({ adapter });
}
