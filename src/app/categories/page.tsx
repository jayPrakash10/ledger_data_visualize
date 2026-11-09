"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import { useAsync } from "@/hooks/useAsync";
import { usePinnedCategories } from "@/hooks/usePinnedCategories";
import { getAvailableMonths, getCategoryOverview } from "@/services/analyticsService";
import { formatCurrency, formatMonth } from "@/lib/format";
import { categoryColor } from "@/lib/icons";
import { cn } from "@/lib/cn";
import { PageHeader } from "@/components/layout/PageHeader";
import { MonthSelect } from "@/components/features/MonthSelect";
import { CategoryIconTile } from "@/components/features/CategoryBadge";
import { ChangeIndicator } from "@/components/features/ChangeIndicator";
import { BudgetRow } from "@/components/features/BudgetAlertsCard";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import type { CategoryOverviewItem } from "@/types";

function MiniBars({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-10 items-end gap-1" aria-hidden="true">
      {values.map((v, i) => (
        <div
          key={i}
          className="w-3 rounded-sm"
          style={{ height: `${Math.max(6, (v / max) * 100)}%`, backgroundColor: color, opacity: i === values.length - 1 ? 1 : 0.4 }}
        />
      ))}
    </div>
  );
}

function CategoryCard({
  item,
  month,
  pinned,
  onTogglePin,
}: {
  item: CategoryOverviewItem;
  month: string;
  pinned: boolean;
  onTogglePin: () => void;
}) {
  const { category } = item;
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <CategoryIconTile category={category} />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold">{category.name}</h2>
          <p className="text-sm text-muted">{category.description}</p>
        </div>
        <button
          type="button"
          onClick={onTogglePin}
          aria-pressed={pinned}
          aria-label={`${pinned ? "Unpin" : "Pin"} ${category.name}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-subtle hover:text-ink"
        >
          <Star className={cn("h-5 w-5", pinned && "fill-current text-warning")} aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-display text-2xl font-semibold tabular-nums">{formatCurrency(item.spent)}</p>
          <ChangeIndicator pct={item.changePct} suffix="vs last month" />
        </div>
        <MiniBars values={item.history} color={categoryColor(category)} />
      </div>

      <ul>
        <BudgetRow budget={item.budget} />
      </ul>

      <div className="mt-auto flex items-center justify-between text-sm">
        <span className="text-muted">
          {item.count} transaction{item.count === 1 ? "" : "s"}
        </span>
        <Link href={`/expenses?category=${category.id}&month=${month}`} className="rounded-sm font-medium text-primary hover:underline">
          View expenses
        </Link>
      </div>
    </Card>
  );
}

function CategoriesContent() {
  const params = useSearchParams();
  const monthsState = useAsync(getAvailableMonths, []);
  const [chosen, setChosen] = useState<string | undefined>(params.get("month") ?? undefined);
  const { pinned, toggle } = usePinnedCategories();

  const months = monthsState.data ?? [];
  const month = chosen ?? months[0];
  const overview = useAsync(() => (month ? getCategoryOverview(month) : Promise.resolve([])), [month]);

  const items = [...(overview.data ?? [])].sort(
    (a, b) => Number(pinned.includes(b.category.id)) - Number(pinned.includes(a.category.id)),
  );
  const error = monthsState.error ?? overview.error;

  return (
    <>
      <PageHeader
        title="Categories"
        description={month ? `Budgets and trends · ${formatMonth(month)}. Pin your favorites to the top.` : "Budgets and trends"}
        actions={month ? <MonthSelect months={months} value={month} onChange={setChosen} className="w-48" /> : null}
      />
      {error ? (
        <ErrorState message={error.message} onRetry={monthsState.error ? monthsState.reload : overview.reload} />
      ) : !overview.data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading categories">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 transition-opacity duration-200 sm:grid-cols-2 xl:grid-cols-3" style={{ opacity: overview.loading ? 0.6 : 1 }}>
          {items.map((item) => (
            <CategoryCard
              key={item.category.id}
              item={item}
              month={month ?? ""}
              pinned={pinned.includes(item.category.id)}
              onTogglePin={() => toggle(item.category.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <CategoriesContent />
    </Suspense>
  );
}
