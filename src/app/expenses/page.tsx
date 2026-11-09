"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { ExpenseSort } from "@/types";
import { useAsync } from "@/hooks/useAsync";
import { useCategories, usePaymentMethods } from "@/hooks/useReferenceData";
import { useExpenseFilters } from "@/hooks/useExpenseFilters";
import { usePinnedCategories } from "@/hooks/usePinnedCategories";
import { getExpenses } from "@/services/expenseService";
import { getAvailableMonths } from "@/services/analyticsService";
import { formatCurrency } from "@/lib/format";
import { PageHeader } from "@/components/layout/PageHeader";
import { CategoryFilter } from "@/components/features/CategoryFilter";
import { ExpenseTable } from "@/components/features/ExpenseTable";
import { MonthSelect } from "@/components/features/MonthSelect";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SearchInput, Select } from "@/components/ui/Field";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";

const sortOptions: { value: ExpenseSort; label: string }[] = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "amount-desc", label: "Highest amount" },
  { value: "amount-asc", label: "Lowest amount" },
];

function ExpensesContent() {
  const params = useSearchParams();
  const filters = useExpenseFilters({
    categoryIds: params.get("category")?.split(",").filter(Boolean) ?? [],
    month: params.get("month") ?? "all",
  });
  const { filters: f, query } = filters;

  const monthsState = useAsync(getAvailableMonths, []);
  const { categories, byId } = useCategories();
  const { byId: paymentsById } = usePaymentMethods();
  const { pinned } = usePinnedCategories();
  const result = useAsync(() => getExpenses(query), [JSON.stringify(query)]);
  const page = result.data;

  return (
    <>
      <PageHeader title="Expenses" description="Search, filter and sort every transaction." />

      <div className="mb-6 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_200px_180px]">
          <SearchInput
            label="Search expenses"
            placeholder="Search title, merchant, note or tag"
            value={f.search}
            onValueChange={filters.setSearch}
            className="sm:col-span-2 lg:col-span-1"
          />
          <MonthSelect label="Month" months={monthsState.data ?? []} value={f.month} onChange={filters.setMonth} includeAll hideLabel />
          <Select label="Sort by" options={sortOptions} value={f.sort} onValueChange={(v) => filters.setSort(v as ExpenseSort)} hideLabel />
        </div>
        <CategoryFilter
          categories={categories}
          selectedIds={f.categoryIds}
          pinnedIds={pinned}
          onToggle={filters.toggleCategory}
          onClear={filters.clearCategories}
        />
      </div>

      <Card className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm" aria-live="polite">
          <p className="text-muted">
            {page ? (
              <>
                <span className="font-medium text-ink">{page.total}</span> expense{page.total === 1 ? "" : "s"} ·{" "}
                <span className="font-medium text-ink tabular-nums">{formatCurrency(page.totalAmount)}</span> total
              </>
            ) : (
              "Loading…"
            )}
          </p>
          {filters.isFiltered && (
            <Button variant="ghost" size="sm" onClick={filters.reset}>
              Clear filters
            </Button>
          )}
        </div>

        {result.error ? (
          <ErrorState message={result.error.message} onRetry={result.reload} />
        ) : !page ? (
          <div className="space-y-3" role="status" aria-label="Loading expenses">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : page.items.length === 0 ? (
          <EmptyState
            title="No expenses match"
            description="Try a different search, month or category."
            action={
              <Button variant="secondary" onClick={filters.reset}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="space-y-4 transition-opacity duration-200" style={{ opacity: result.loading ? 0.6 : 1 }} aria-busy={result.loading}>
            <ExpenseTable expenses={page.items} categoriesById={byId} paymentsById={paymentsById} caption="Expenses" />
            <Pagination page={page.page} pageCount={page.pageCount} onPageChange={filters.setPage} />
          </div>
        )}
      </Card>
    </>
  );
}

export default function ExpensesPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <ExpensesContent />
    </Suspense>
  );
}
