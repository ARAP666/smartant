export type ImportPreviewRow = {
  id: string;
  date?: string;
  amountMinor?: string;
  description?: string;
  category?: string;
  duplicateOf?: string;
};

export type ConfirmImportRow = {
  rowId: string;
  amountMinor: string;
  date: string;
  description: string;
  category: string;
};

export type ConfirmImportInput = {
  idempotencyKey: string;
  rows: ConfirmImportRow[];
};

export type ConfirmImportResult = {
  created: number;
  skipped: number;
  failed: number;
  rows: Array<{
    rowId: string;
    status: "CREATED" | "SKIPPED";
    expenseId?: string;
    alertSeverity?: string;
    reason?: string;
  }>;
};

export function classifyImportRows(rows: ImportPreviewRow[]) {
  return rows.map((row) => {
    if (!row.date)
      return { ...row, status: "INVALID" as const, reason: "Falta fecha" };
    if (!row.amountMinor) {
      return { ...row, status: "INVALID" as const, reason: "Falta monto" };
    }
    if (row.duplicateOf) {
      return {
        ...row,
        status: "DUPLICATE" as const,
        reason: `Coincide con ${row.duplicateOf}`,
      };
    }
    return { ...row, status: "VALID" as const, reason: "" };
  });
}
