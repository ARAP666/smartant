import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.url().startsWith("postgresql://"),
  PORT: z.coerce.number().int().positive().default(3000),
});

export function parseConfig(env: Record<string, string | undefined>) {
  const config = schema.parse(env);
  return {
    databaseUrl: config.DATABASE_URL,
    port: config.PORT,
  };
}
