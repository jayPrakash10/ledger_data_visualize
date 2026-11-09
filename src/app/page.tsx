"use client";

import { useState } from "react";
import Link from "next/link";
import { useAsync } from "@/hooks/useAsync";
import { useCategories } from "@/hooks/useReferenceData";
import { usePinnedCategories } from "@/hooks/usePinnedCategories";
import { getAvailableMonths, getDashboard } from "@/services/analyticsService";
import { formatMonth } from "@/lib/format";
import { PageHeader } from "@/components/layout/PageHeader";
import { MonthSelect } from "@/components/features/MonthSelect";
import { CategoryFilter } from "@/components/features/CategoryFilter";
import { StatTiles } from "@/components/features/StatTiles";
import { InsightCards } from "@/components/features/InsightCards";
import { CategoryBreakdownCard } from "@/components/features/CategoryBreakdownCard";
import { TrendCard } from "@/components/features/TrendCard";
import { BudgetAlertsCard } from "@/components/features/BudgetAlertsCard";
import { ExpenseTable } from "@/components/features/ExpenseTable";
import { DashboardSkeleton } from "@/components/features/DashboardSkeleton";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";

export default function OverviewPage() {
  const monthsState = useAsync(getAvailableMonths, []);
  const { categories, byId } = useCategories();
  const { pinned } = usePinnedCategories();
  const [chosenMonth, setChosenMonth] = useState<string>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const months = monthsState.data ?? [];
  const month = chosenMonth ?? months[0];

  const dashboard = useAsync(
    () => (month ? getDashboard(month, selectedIds) : Promise.resolve(undefined)),
    [month, selectedIds.join(",")],
  );

  const toggle = (id: string) =>
    setSelectedIds((cur) => (cur.includes(id) ? cur.filter((c) => c !== id) : [...cur, id]));

  const error = monthsState.error ?? dashboard.error;
  const data = dashboard.data;

  return (
    <>
      <PageHeader
        title="Overview"
        description={month ? `Your spending in ${formatMonth(month)}` : "Your monthly spending at a glance"}
        actions={
          months.length > 0 && month ? (
            <MonthSelect months={months} value={month} onChange={setChosenMonth} className="w-48" />
          ) : null
        }
      />

      <div className="mb-6">
        <CategoryFilter
          categories={categories}
          selectedIds={selectedIds}
          pinnedIds={pinned}
          onToggle={toggle}
          onClear={() => setSelectedIds([])}
        />
      </div>

      {error ? (
        <ErrorState message={error.message} onRetry={() => (monthsState.error ? monthsState.reload() : dashboard.reload())} />
      ) : !data ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6 transition-opacity duration-200" style={{ opacity: dashboard.loading ? 0.6 : 1 }} aria-busy={dashboard.loading}>
          <StatTiles data={data} />
          <InsightCards insights={data.insights} />
          <div className="grid gap-6 xl:grid-cols-2">
            <CategoryBreakdownCard month={data.month} total={data.total} breakdown={data.breakdown} />
            <div className="space-y-6">
              <TrendCard trend={data.trend} month={data.month} />
            </div>
          </div>
          <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
            <BudgetAlertsCard budgets={data.budgets} month={data.month} />
            <Card aria-labelledby="recent-title">
              <CardHeader
                id="recent-title"
                title="Recent expenses"
                action={
                  <Link
                    href={`/expenses?month=${data.month}${selectedIds.length ? `&category=${selectedIds.join(",")}` : ""}`}
                    className="rounded-sm text-sm font-medium text-primary hover:underline"
                  >
                    View all
                  </Link>
                }
              />
              {data.recent.length === 0 ? (
                <EmptyState title="No expenses here" description="Nothing matches this month and category selection." />
              ) : (
                <ExpenseTable expenses={data.recent} categoriesById={byId} caption="Recent expenses" />
              )}
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
