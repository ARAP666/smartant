import argon2 from "argon2";
import { z } from "zod";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors.js";
import { createSessionSecrets } from "./session.js";

export const loginSchema = z.object({
  email: z.preprocess(
    (value) => (typeof value === "string" ? value.trim().toLowerCase() : value),
    z.email(),
  ),
  password: z.string().min(1).max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;

export async function loginUser(database: PrismaClient, input: LoginInput) {
  const user = await database.user.findUnique({
    where: { email: input.email },
    select: { id: true, email: true, passwordHash: true },
  });

  if (!user) {
    await argon2.hash(input.password, { type: argon2.argon2id });
    throw invalidCredentials();
  }

  if (!(await argon2.verify(user.passwordHash, input.password))) {
    throw invalidCredentials();
  }

  const session = createSessionSecrets();
  await database.session.create({
    data: {
      userId: user.id,
      tokenHash: session.tokenHash,
      expiresAt: session.expiresAt,
    },
  });

  return {
    user: { id: user.id, email: user.email },
    sessionToken: session.sessionToken,
  };
}

function invalidCredentials() {
  return new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
}
