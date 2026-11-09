import type { Expense, ExpensePage, ExpenseQuery } from "@/types";
import { expenses } from "@/data/expenses";
import { filterExpenses, sortExpenses } from "@/lib/expenseQuery";
import { sumAmount } from "@/lib/analytics";
import { simulateLatency } from "@/services/delay";

export async function getExpenses(query: ExpenseQuery): Promise<ExpensePage> {
  await simulateLatency();
  const matched = sortExpenses(filterExpenses(expenses, query), query.sort);
  const pageCount = Math.max(1, Math.ceil(matched.length / query.pageSize));
  const page = Math.min(Math.max(1, query.page), pageCount);
  const start = (page - 1) * query.pageSize;
  return {
    items: matched.slice(start, start + query.pageSize),
    total: matched.length,
    totalAmount: sumAmount(matched),
    page,
    pageCount,
  };
}

export async function getExpenseById(id: string): Promise<Expense | null> {
  await simulateLatency();
  return expenses.find((e) => e.id === id) ?? null;
}

/** Other expenses in the same category, same-merchant matches first. */
export async function getSimilarExpenses(id: string, limit = 4): Promise<Expense[]> {
  await simulateLatency();
  const source = expenses.find((e) => e.id === id);
  if (!source) return [];
  return expenses
    .filter((e) => e.id !== id && e.categoryId === source.categoryId)
    .sort((a, b) => {
      const merchant = Number(b.merchant === source.merchant) - Number(a.merchant === source.merchant);
      return merchant || b.date.localeCompare(a.date);
    })
    .slice(0, limit);
}
