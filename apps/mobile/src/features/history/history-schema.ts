export type MovementType = "INCOME" | "EXPENSE";

export type MovementHistoryQuery = {
  from?: string;
  to?: string;
  category?: string;
  type?: MovementType;
  offset: number;
  limit: number;
};

export type MovementHistoryItem = {
  id: string;
  type: MovementType;
  amountMinor: string;
  date: string;
  description: string;
  category: string | null;
};

export type MovementHistory = {
  movements: MovementHistoryItem[];
  page: {
    offset: number;
    limit: number;
    total: number;
    nextOffset: number | null;
  };
};
