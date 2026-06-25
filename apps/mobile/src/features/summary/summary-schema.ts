export type SummaryPeriod = "WEEKLY" | "MONTHLY";

export type FinancialSummary = {
  period: { kind: SummaryPeriod; start: string; end: string; timeZone: string };
  incomeTotal: string;
  expenseTotal: string;
  savingsGoalTotal: string;
  budgetTotal: string;
  spendableBalance: string;
  empty: boolean;
};

export type ExpenseCategory = {
  category: string;
  amountMinor: string;
  percentage: number;
};
