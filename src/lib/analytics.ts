import type { BreakdownItem, BudgetState, BudgetStatus, Category, Expense, MonthKey } from "@/types";
import { BUDGET_WARNING_RATIO } from "@/lib/constants";
import { monthOf } from "@/lib/months";

export const sumAmount = (list: Expense[]): number => list.reduce((total, e) => total + e.amount, 0);

export const expensesInMonth = (list: Expense[], month: MonthKey): Expense[] =>
  list.filter((e) => monthOf(e.date) === month);

/** Percent change from `previous` to `current`; null when there is no baseline. */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function spendByCategory(list: Expense[]): Record<string, number> {
  return list.reduce<Record<string, number>>((acc, e) => {
    acc[e.categoryId] = (acc[e.categoryId] ?? 0) + e.amount;
    return acc;
  }, {});
}

export function breakdownByCategory(list: Expense[], categories: Category[]): BreakdownItem[] {
  const total = sumAmount(list);
  return categories
    .map((category) => {
      const rows = list.filter((e) => e.categoryId === category.id);
      const amount = sumAmount(rows);
      return { category, amount, count: rows.length, share: total === 0 ? 0 : (amount / total) * 100 };
    })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}

export function budgetState(ratio: number): BudgetState {
  if (ratio >= 1) return "over";
  if (ratio >= BUDGET_WARNING_RATIO) return "warning";
  return "ok";
}

export function budgetStatus(category: Category, spent: number): BudgetStatus {
  const ratio = category.monthlyBudget === 0 ? 0 : spent / category.monthlyBudget;
  return { category, limit: category.monthlyBudget, spent, ratio, state: budgetState(ratio) };
}
