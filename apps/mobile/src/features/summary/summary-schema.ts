export type FinancialSummary = {
  period: { kind: string; start: string; end: string };
  incomeTotal: string;
  expenseTotal: string;
  savingsGoalTotal: string;
  budgetTotal: string;
  spendableBalance: string;
  empty: boolean;
};
