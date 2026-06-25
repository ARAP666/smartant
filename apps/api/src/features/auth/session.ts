import { createHash, randomBytes } from "node:crypto";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors.js";

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

export function createSessionSecrets() {
  const sessionToken = randomBytes(32).toString("base64url");
  return {
    sessionToken,
    tokenHash: hashSessionToken(sessionToken),
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
  };
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getBearerToken(header: string | undefined) {
  const [scheme, token] = header?.split(" ") ?? [];
  return scheme === "Bearer" && token ? token : null;
}

export async function authenticateSession(
  database: PrismaClient,
  token: string,
) {
  const session = await database.session.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    select: {
      expiresAt: true,
      revokedAt: true,
      user: { select: { id: true, email: true } },
    },
  });

  if (!session || session.revokedAt || session.expiresAt <= new Date())
    return null;
  return session.user;
}

export async function logoutSession(database: PrismaClient, token: string) {
  const result = await database.session.updateMany({
    where: {
      tokenHash: hashSessionToken(token),
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    data: { revokedAt: new Date() },
  });

  if (result.count === 0) {
    throw new AppError(401, "UNAUTHORIZED", "Authentication required");
  }
}
