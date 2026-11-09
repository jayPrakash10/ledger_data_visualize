"use client";

import { useState } from "react";
import { useAsync } from "@/hooks/useAsync";
import { getAvailableMonths, getComparison } from "@/services/analyticsService";
import { formatCurrency, formatMonth, formatPercent } from "@/lib/format";
import { percentChange } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { PageHeader } from "@/components/layout/PageHeader";
import { MonthSelect } from "@/components/features/MonthSelect";
import { CompareChart } from "@/components/features/CompareChart";
import { CategoryBadge } from "@/components/features/CategoryBadge";
import { ChangeIndicator } from "@/components/features/ChangeIndicator";
import { Card, CardHeader } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ComparePage() {
  const monthsState = useAsync(getAvailableMonths, []);
  const months = monthsState.data ?? [];
  const [pickA, setPickA] = useState<string>();
  const [pickB, setPickB] = useState<string>();
  const monthB = pickB ?? months[0];
  const monthA = pickA ?? months[1];

  const comparison = useAsync(
    () => (monthA && monthB ? getComparison(monthA, monthB) : Promise.resolve(undefined)),
    [monthA, monthB],
  );
  const data = comparison.data;
  const error = monthsState.error ?? comparison.error;

  return (
    <>
      <PageHeader
        title="Compare months"
        description="See which categories moved between two months."
        actions={
          months.length > 0 && monthA && monthB ? (
            <>
              <MonthSelect label="Baseline month" months={months} value={monthA} onChange={setPickA} className="w-44" />
              <MonthSelect label="Compare with" months={months} value={monthB} onChange={setPickB} className="w-44" />
            </>
          ) : null
        }
      />

      {error ? (
        <ErrorState message={error.message} onRetry={monthsState.error ? monthsState.reload : comparison.reload} />
      ) : !data ? (
        <div className="space-y-4" role="status" aria-label="Loading comparison">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      ) : (
        <div className="space-y-6 transition-opacity duration-200" style={{ opacity: comparison.loading ? 0.6 : 1 }}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-sm text-muted">{formatMonth(data.monthA)}</p>
              <p className="font-display text-3xl font-semibold tabular-nums">{formatCurrency(data.totalA)}</p>
            </Card>
            <Card>
              <p className="text-sm text-muted">{formatMonth(data.monthB)}</p>
              <p className="font-display text-3xl font-semibold tabular-nums">{formatCurrency(data.totalB)}</p>
            </Card>
            <Card>
              <p className="text-sm text-muted">Difference</p>
              <p className="font-display text-3xl font-semibold tabular-nums">
                {data.totalB - data.totalA >= 0 ? "+" : "−"}
                {formatCurrency(Math.abs(data.totalB - data.totalA))}
              </p>
              <ChangeIndicator pct={percentChange(data.totalB, data.totalA)} suffix="" />
            </Card>
          </div>

          <Card aria-labelledby="compare-chart-title">
            <CardHeader id="compare-chart-title" title="By category" description="Spending per category in each month" />
            <CompareChart data={data} />
          </Card>

          <Card aria-labelledby="compare-table-title" className="overflow-x-auto">
            <CardHeader id="compare-table-title" title="Biggest movers" description="Sorted by absolute change" />
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="sr-only">Category spending comparison</caption>
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                  <th scope="col" className="py-3 pr-3 font-medium">Category</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">{formatMonth(data.monthA)}</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">{formatMonth(data.monthB)}</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">Change</th>
                  <th scope="col" className="py-3 pl-3 text-right font-medium">%</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r) => (
                  <tr key={r.category.id} className="border-b border-line last:border-0">
                    <td className="py-3 pr-3"><CategoryBadge category={r.category} /></td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatCurrency(r.a)}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatCurrency(r.b)}</td>
                    <td className={cn("px-3 py-3 text-right font-medium tabular-nums", r.delta > 0 ? "text-danger" : r.delta < 0 ? "text-success" : "text-muted")}>
                      {r.delta > 0 ? "+" : r.delta < 0 ? "−" : ""}
                      {formatCurrency(Math.abs(r.delta))}
                    </td>
                    <td className="py-3 pl-3 text-right tabular-nums text-muted">
                      {r.deltaPct === null ? "—" : formatPercent(r.deltaPct, { signed: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </>
  );
}
