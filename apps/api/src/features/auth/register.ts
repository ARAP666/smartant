import argon2 from "argon2";
import { z } from "zod";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors.js";
import { createSessionSecrets } from "./session.js";

export const registerSchema = z.object({
  email: z.preprocess(
    (value) => (typeof value === "string" ? value.trim().toLowerCase() : value),
    z.email(),
  ),
  password: z.string().min(12).max(128),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export async function createRegistrationSecrets(password: string) {
  const session = createSessionSecrets();
  return {
    passwordHash: await argon2.hash(password, { type: argon2.argon2id }),
    ...session,
  };
}

export async function registerUser(
  database: PrismaClient,
  input: RegisterInput,
) {
  const secrets = await createRegistrationSecrets(input.password);

  try {
    const user = await database.$transaction(async (transaction) => {
      const createdUser = await transaction.user.create({
        data: {
          email: input.email,
          passwordHash: secrets.passwordHash,
        },
        select: { id: true, email: true },
      });
      await transaction.session.create({
        data: {
          userId: createdUser.id,
          tokenHash: secrets.tokenHash,
          expiresAt: secrets.expiresAt,
        },
      });
      return createdUser;
    });

    return { user, sessionToken: secrets.sessionToken };
  } catch (error) {
    if (hasCode(error, "P2002")) {
      throw new AppError(
        409,
        "EMAIL_ALREADY_REGISTERED",
        "Email already registered",
      );
    }
    throw error;
  }
}

function hasCode(error: unknown, code: string) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}
