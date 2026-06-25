import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.url().startsWith("postgresql://").optional(),
  NODE_ENV: z.string().optional(),
  PORT: z.coerce.number().int().positive().default(3000),
});

export function parseConfig(env: Record<string, string | undefined>) {
  const config = schema.parse(env);
  if (config.NODE_ENV === "production" && !config.DATABASE_URL) {
    throw new Error("DATABASE_URL is required in production");
  }
  return {
    databaseUrl:
      config.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5432/sentDB",
    port: config.PORT,
  };
}
