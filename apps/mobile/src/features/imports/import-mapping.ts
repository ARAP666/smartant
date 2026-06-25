export type ImportColumnRole = "date" | "amount" | "description" | "category";

export type ImportMapping = Partial<Record<ImportColumnRole, string>>;

export function suggestImportMapping(headers: string[]): ImportMapping {
  return {
    date: findHeader(headers, ["date", "fecha"]),
    amount: findHeader(headers, ["amount", "monto", "total"]),
    description: findHeader(headers, ["description", "descripcion", "detalle"]),
    category: findHeader(headers, ["category", "categoria"]),
  };
}

export function canContinueImport(mapping: ImportMapping) {
  return Boolean(mapping.date && mapping.amount);
}

function findHeader(headers: string[], names: string[]) {
  return headers.find((header) => names.includes(header.trim().toLowerCase()));
}
