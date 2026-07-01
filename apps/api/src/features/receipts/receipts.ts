import { z } from "zod";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors.js";

export const receiptDetectionSchema = z.object({
  originalName: z.string().trim().min(1).max(160),
  mimeType: z.enum(["image/jpeg", "image/png"]),
  size: z
    .number()
    .int()
    .min(1)
    .max(5 * 1024 * 1024),
  text: z.string().max(4000).optional(),
});

export type ReceiptDetectionInput = z.infer<typeof receiptDetectionSchema>;

type ReceiptAttachmentInput = {
  originalName: string;
  mimeType: "image/jpeg" | "image/png";
  data: Uint8Array<ArrayBuffer>;
};

export async function saveReceiptAttachment(
  database: PrismaClient,
  userId: string,
  expenseId: string,
  input: ReceiptAttachmentInput,
) {
  const expense = await database.expense.findFirst({
    where: { id: expenseId, userId },
    select: { id: true },
  });
  if (!expense)
    throw new AppError(404, "EXPENSE_NOT_FOUND", "Expense not found");

  const attachment = await database.receiptAttachment.upsert({
    where: { expenseId },
    create: { ...input, expenseId, userId },
    update: input,
    select: { id: true, originalName: true, mimeType: true, updatedAt: true },
  });
  return { attachment };
}

export async function getReceiptAttachment(
  database: PrismaClient,
  userId: string,
  expenseId: string,
) {
  const attachment = await database.receiptAttachment.findFirst({
    where: { expenseId, userId },
    select: {
      id: true,
      originalName: true,
      mimeType: true,
      data: true,
      updatedAt: true,
    },
  });
  if (!attachment)
    throw new AppError(
      404,
      "RECEIPT_NOT_FOUND",
      "Receipt attachment not found",
    );
  const { data, ...metadata } = attachment;
  return {
    attachment: {
      ...metadata,
      dataBase64: Buffer.from(data).toString("base64"),
    },
  };
}

export async function deleteReceiptAttachment(
  database: PrismaClient,
  userId: string,
  expenseId: string,
) {
  const result = await database.receiptAttachment.deleteMany({
    where: { expenseId, userId },
  });
  if (result.count === 0)
    throw new AppError(
      404,
      "RECEIPT_NOT_FOUND",
      "Receipt attachment not found",
    );
}

export async function detectReceiptPendingMovement(
  database: PrismaClient,
  userId: string,
  input: ReceiptDetectionInput,
) {
  const detected = detectReceiptFields(input.text ?? "", input.originalName);
  const pendingMovement = await database.pendingMovement.create({
    data: {
      userId,
      amountMinor: detected.amountMinor,
      date: detected.date,
      description: detected.description,
      category: detected.category,
    },
    select: {
      id: true,
      amountMinor: true,
      date: true,
      description: true,
      category: true,
      status: true,
    },
  });

  return {
    pendingMovement: {
      ...pendingMovement,
      amountMinor: pendingMovement.amountMinor.toString(),
      date: pendingMovement.date.toISOString().slice(0, 10),
    },
    detected: {
      amountMinor: detected.amountMinor.toString(),
      date: detected.date.toISOString().slice(0, 10),
      description: detected.description,
      category: detected.category,
      confidence: detected.confidence,
    },
  };
}

function detectReceiptFields(text: string, originalName: string) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const amount = text.match(/\b\d{1,7}(?:[.,]\d{2})?\b/g)?.at(-1);
  const date = text.match(/\b\d{4}-\d{2}-\d{2}\b/)?.[0];
  const description = lines[0] ?? originalName.replace(/\.[^.]+$/, "");

  return {
    amountMinor: amount ? BigInt(amount.replace(/[^\d]/g, "")) : 1n,
    date: date ? new Date(`${date}T00:00:00.000Z`) : today(),
    description: description.slice(0, 120) || "Recibo por revisar",
    category: "Recibo",
    confidence: {
      amount: Boolean(amount),
      date: Boolean(date),
      description: Boolean(lines[0]),
    },
  };
}

function today() {
  return new Date(new Date().toISOString().slice(0, 10));
}

export function invalidReceiptFile() {
  return new AppError(422, "INVALID_RECEIPT_FILE", "Invalid receipt file");
}
