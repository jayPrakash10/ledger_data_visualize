import type {
  BudgetStatus,
  CategoryOverviewItem,
  ComparisonData,
  DashboardData,
  Insight,
  MonthKey,
  TrendPoint,
} from "@/types";
import { categories } from "@/data/categories";
import { expenses } from "@/data/expenses";
import {
  breakdownByCategory,
  budgetStatus,
  expensesInMonth,
  percentChange,
  spendByCategory,
  sumAmount,
} from "@/lib/analytics";
import { formatCurrency, formatMonthShort, monthName } from "@/lib/format";
import { daysInMonth, lastNMonths, monthOf, shiftMonth } from "@/lib/months";
import { simulateLatency } from "@/services/delay";

/** Months that contain data, newest first. */
export async function getAvailableMonths(): Promise<MonthKey[]> {
  await simulateLatency();
  return Array.from(new Set(expenses.map((e) => monthOf(e.date)))).sort().reverse();
}

function buildInsights(month: MonthKey): Insight[] {
  const previous = shiftMonth(month, -1);
  const current = spendByCategory(expensesInMonth(expenses, month));
  const before = spendByCategory(expensesInMonth(expenses, previous));

  const movers = categories
    .map((category) => {
      const now = current[category.id] ?? 0;
      const prev = before[category.id] ?? 0;
      return { category, now, prev, delta: now - prev, pct: percentChange(now, prev) };
    })
    .filter((m) => m.pct !== null && Math.abs(m.delta) >= 500);

  const insights: Insight[] = [];
  const riser = [...movers].sort((a, b) => b.delta - a.delta)[0];
  if (riser && riser.delta > 0) {
    insights.push({
      id: "riser",
      tone: "up",
      categoryId: riser.category.id,
      title: `${riser.category.name} is up ${Math.round(riser.pct ?? 0)}%`,
      detail: `${formatCurrency(riser.delta)} more than in ${monthName(previous)}.`,
    });
  }
  const faller = [...movers].sort((a, b) => a.delta - b.delta)[0];
  if (faller && faller.delta < 0) {
    insights.push({
      id: "faller",
      tone: "down",
      categoryId: faller.category.id,
      title: `${faller.category.name} dropped ${Math.abs(Math.round(faller.pct ?? 0))}%`,
      detail: `You spent ${formatCurrency(Math.abs(faller.delta))} less than in ${monthName(previous)}.`,
    });
  }

  const total = sumAmount(expensesInMonth(expenses, month));
  const essentialIds = categories.filter((c) => c.isEssential).map((c) => c.id);
  const essentials = sumAmount(expensesInMonth(expenses, month).filter((e) => essentialIds.includes(e.categoryId)));
  if (total > 0) {
    insights.push({
      id: "essentials",
      tone: "info",
      title: `${Math.round((essentials / total) * 100)}% went to essentials`,
      detail: `${formatCurrency(essentials)} of ${formatCurrency(total)} covered rent, groceries, bills and health.`,
    });
  }
  return insights.slice(0, 3);
}

export async function getDashboard(month: MonthKey, categoryIds: string[]): Promise<DashboardData> {
  await simulateLatency();
  const inScope = (categoryId: string) => categoryIds.length === 0 || categoryIds.includes(categoryId);
  const scoped = expenses.filter((e) => inScope(e.categoryId));

  const monthRows = expensesInMonth(scoped, month);
  const total = sumAmount(monthRows);
  const previousTotal = sumAmount(expensesInMonth(scoped, shiftMonth(month, -1)));
  const breakdown = breakdownByCategory(monthRows, categories);

  const trend: TrendPoint[] = lastNMonths(month, 6).map((m) => ({
    month: m,
    label: formatMonthShort(m),
    total: sumAmount(expensesInMonth(scoped, m)),
  }));

  const spent = spendByCategory(expensesInMonth(expenses, month));
  const budgets: BudgetStatus[] = categories
    .filter((c) => inScope(c.id))
    .map((c) => budgetStatus(c, spent[c.id] ?? 0))
    .sort((a, b) => b.ratio - a.ratio);

  return {
    month,
    total,
    previousTotal,
    changePct: percentChange(total, previousTotal),
    dailyAverage: total / daysInMonth(month),
    txnCount: monthRows.length,
    largest: [...monthRows].sort((a, b) => b.amount - a.amount)[0] ?? null,
    topCategory: breakdown[0] ?? null,
    breakdown,
    trend,
    budgets,
    insights: buildInsights(month),
    recent: [...monthRows].sort((a, b) => b.date.localeCompare(a.date) || b.amount - a.amount).slice(0, 6),
  };
}

export async function getCategoryOverview(month: MonthKey): Promise<CategoryOverviewItem[]> {
  await simulateLatency();
  const months = lastNMonths(month, 6);
  const byMonth = months.map((m) => spendByCategory(expensesInMonth(expenses, m)));
  return categories.map((category) => {
    const history = byMonth.map((s) => s[category.id] ?? 0);
    const spent = history[history.length - 1];
    const previousSpent = history[history.length - 2];
    return {
      category,
      spent,
      previousSpent,
      history,
      count: expensesInMonth(expenses, month).filter((e) => e.categoryId === category.id).length,
      changePct: percentChange(spent, previousSpent),
      budget: budgetStatus(category, spent),
    };
  });
}

export async function getBudgetStatus(categoryId: string, month: MonthKey): Promise<BudgetStatus | null> {
  await simulateLatency();
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return null;
  const spent = sumAmount(expensesInMonth(expenses, month).filter((e) => e.categoryId === categoryId));
  return budgetStatus(category, spent);
}

export async function getComparison(monthA: MonthKey, monthB: MonthKey): Promise<ComparisonData> {
  await simulateLatency();
  const a = spendByCategory(expensesInMonth(expenses, monthA));
  const b = spendByCategory(expensesInMonth(expenses, monthB));
  const rows = categories
    .map((category) => {
      const va = a[category.id] ?? 0;
      const vb = b[category.id] ?? 0;
      return { category, a: va, b: vb, delta: vb - va, deltaPct: percentChange(vb, va) };
    })
    .sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta));
  return {
    monthA,
    monthB,
    totalA: rows.reduce((s, r) => s + r.a, 0),
    totalB: rows.reduce((s, r) => s + r.b, 0),
    rows,
  };
}
