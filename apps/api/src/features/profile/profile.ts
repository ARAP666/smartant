import { z } from "zod";
import type { PrismaClient } from "../../generated/prisma/client.js";

export const profileSchema = z.object({
  currency: z
    .string()
    .trim()
    .regex(/^[A-Z]{3}$/)
    .refine(isCurrency),
  timeZone: z.string().trim().refine(isTimeZone),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export async function getProfile(database: PrismaClient, userId: string) {
  const user = await database.user.findUniqueOrThrow({
    where: { id: userId },
    select: { email: true, currency: true, timeZone: true },
  });

  return { profile: user };
}

export async function updateProfile(
  database: PrismaClient,
  userId: string,
  input: ProfileInput,
) {
  const user = await database.user.update({
    where: { id: userId },
    data: input,
    select: { email: true, currency: true, timeZone: true },
  });

  return { profile: user };
}

function isCurrency(currency: string) {
  try {
    new Intl.NumberFormat("en", { style: "currency", currency });
    return true;
  } catch {
    return false;
  }
}

function isTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone });
    return true;
  } catch {
    return false;
  }
}
