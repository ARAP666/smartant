export type PeriodMovement = {
  amountMinor: bigint;
  category?: string | null;
};

export type PeriodBudget = {
  id: string;
  amountMinor: bigint;
  category?: string | null;
  active?: boolean;
};

export type PeriodSavingsGoal = {
  id: string;
  amountMinor: bigint;
  active?: boolean;
};

export type SpendableBalanceInput = {
  incomes: PeriodMovement[];
  expenses: PeriodMovement[];
  budgets: PeriodBudget[];
  savingsGoals: PeriodSavingsGoal[];
  category?: string | null;
};

export type SpendableMargin = {
  kind: "BASE" | "BUDGET" | "SAVINGS_GOAL";
  id?: string;
  category?: string | null;
  amountMinor: bigint;
};

export function calculateSpendableBalance(input: SpendableBalanceInput) {
  const incomeTotal = sum(input.incomes);
  const expenseTotal = sum(input.expenses);
  const baseBalance = incomeTotal - expenseTotal;
  const margins: SpendableMargin[] = [
    { kind: "BASE", amountMinor: baseBalance },
    ...budgetMargins(input),
    savingsMargin(baseBalance, input.savingsGoals),
  ];
  const spendableBalance = max(
    0n,
    min(margins.map((margin) => margin.amountMinor)),
  );

  return {
    incomeTotal,
    expenseTotal,
    baseBalance,
    margins,
    spendableBalance,
  };
}

function budgetMargins(input: SpendableBalanceInput): SpendableMargin[] {
  return input.budgets
    .filter((budget) => budget.active !== false)
    .filter((budget) => appliesToCategory(budget.category, input.category))
    .map((budget) => ({
      kind: "BUDGET" as const,
      id: budget.id,
      category: budget.category ?? null,
      amountMinor:
        budget.amountMinor -
        sum(
          input.expenses.filter((expense) =>
            appliesToBudget(budget.category, expense.category),
          ),
        ),
    }));
}

function savingsMargin(
  baseBalance: bigint,
  savingsGoals: PeriodSavingsGoal[],
): SpendableMargin {
  return {
    kind: "SAVINGS_GOAL",
    amountMinor:
      baseBalance -
      savingsGoals
        .filter((goal) => goal.active !== false)
        .reduce((total, goal) => total + goal.amountMinor, 0n),
  };
}

function sum(values: PeriodMovement[]) {
  return values.reduce((total, value) => total + value.amountMinor, 0n);
}

function min(values: bigint[]) {
  return values.reduce((lowest, value) => (value < lowest ? value : lowest));
}

function max(left: bigint, right: bigint) {
  return left > right ? left : right;
}

function appliesToCategory(
  ruleCategory: string | null | undefined,
  selectedCategory: string | null | undefined,
) {
  return (
    !ruleCategory || !selectedCategory || ruleCategory === selectedCategory
  );
}

function appliesToBudget(
  budgetCategory: string | null | undefined,
  expenseCategory: string | null | undefined,
) {
  return !budgetCategory || budgetCategory === expenseCategory;
}
