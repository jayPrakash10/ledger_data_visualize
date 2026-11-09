import type { Expense, ExpenseQuery, ExpenseSort } from "@/types";
import { monthOf } from "@/lib/months";

const sorters: Record<ExpenseSort, (a: Expense, b: Expense) => number> = {
  "date-desc": (a, b) => b.date.localeCompare(a.date) || b.amount - a.amount,
  "date-asc": (a, b) => a.date.localeCompare(b.date) || a.amount - b.amount,
  "amount-desc": (a, b) => b.amount - a.amount,
  "amount-asc": (a, b) => a.amount - b.amount,
};

export function filterExpenses(list: Expense[], query: Pick<ExpenseQuery, "search" | "categoryIds" | "month">): Expense[] {
  const needle = query.search?.trim().toLowerCase();
  return list.filter((e) => {
    if (query.categoryIds?.length && !query.categoryIds.includes(e.categoryId)) return false;
    if (query.month && query.month !== "all" && monthOf(e.date) !== query.month) return false;
    if (!needle) return true;
    const haystack = [e.title, e.merchant, e.note ?? "", ...e.tags].join(" ").toLowerCase();
    return haystack.includes(needle);
  });
}

export function sortExpenses(list: Expense[], sort: ExpenseSort): Expense[] {
  return [...list].sort(sorters[sort]);
}
