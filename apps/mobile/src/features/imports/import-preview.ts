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

export function parseCsvImport(text: string) {
  const rows = parseCsv(text);
  return {
    headers: rows[0]?.map((header) => header.trim()).filter(Boolean) ?? [],
    records: rows.slice(1),
  };
}

export function buildImportPreviewRows(
  text: string,
  mapping: Partial<
    Record<"date" | "amount" | "description" | "category", string>
  >,
): ImportPreviewRow[] {
  const { headers, records } = parseCsvImport(text);
  const indexes = {
    date: indexOf(headers, mapping.date),
    amount: indexOf(headers, mapping.amount),
    description: indexOf(headers, mapping.description),
    category: indexOf(headers, mapping.category),
  };

  return records.map((record, index) => ({
    id: `row-${index + 1}`,
    date: valueAt(record, indexes.date),
    amountMinor: toMinor(valueAt(record, indexes.amount)),
    description: valueAt(record, indexes.description),
    category: valueAt(record, indexes.category),
  }));
}

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

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function indexOf(headers: string[], header?: string) {
  return header ? headers.indexOf(header) : -1;
}

function valueAt(record: string[], index: number) {
  return index >= 0 ? record[index]?.trim() || undefined : undefined;
}

function toMinor(value?: string) {
  if (!value) return undefined;
  const normalized = value.replace(/[^\d.,-]/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return undefined;
  const [whole, cents = ""] = normalized.split(".");
  return `${whole}${cents.padEnd(2, "0")}`;
}
