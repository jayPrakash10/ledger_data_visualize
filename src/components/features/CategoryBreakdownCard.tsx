"use client";

import Link from "next/link";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { BreakdownItem, MonthKey } from "@/types";
import { formatCurrency, formatMonth } from "@/lib/format";
import { categoryColor } from "@/lib/icons";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ChartTooltip } from "@/components/features/ChartTooltip";

interface Props {
  month: MonthKey;
  total: number;
  breakdown: BreakdownItem[];
}

export function CategoryBreakdownCard({ month, total, breakdown }: Props) {
  const reduced = usePrefersReducedMotion();
  const data = breakdown.map((b) => ({ name: b.category.name, amount: b.amount, color: categoryColor(b.category) }));

  return (
    <Card aria-labelledby="breakdown-title">
      <CardHeader id="breakdown-title" title="Where it went" description={`Spending by category · ${formatMonth(month)}`} />
      {breakdown.length === 0 ? (
        <EmptyState title="No spending in this view" description="Try another month or clear the category filter." />
      ) : (
        <div className="grid items-center gap-6 md:grid-cols-[minmax(0,240px)_1fr]">
          <div
            className="relative mx-auto aspect-square w-full max-w-[240px]"
            role="img"
            aria-label={`Donut chart of ${formatCurrency(total)} spent across ${breakdown.length} categories. Details are listed beside the chart.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="amount" nameKey="name" innerRadius="64%" outerRadius="96%" paddingAngle={2} stroke="none" isAnimationActive={!reduced}>
                  {data.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-muted">Total</span>
              <span className="font-display text-xl font-semibold tabular-nums">{formatCurrency(total)}</span>
            </div>
          </div>

          <table className="w-full text-sm">
            <caption className="sr-only">Spending by category</caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">Category</th>
                <th scope="col">Share</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((b) => (
                <tr key={b.category.id} className="border-b border-line last:border-0">
                  <td className="py-2.5">
                    <Link
                      href={`/expenses?category=${b.category.id}&month=${month}`}
                      className="flex items-center gap-2 rounded-sm font-medium hover:underline"
                    >
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: categoryColor(b.category) }} aria-hidden="true" />
                      {b.category.name}
                    </Link>
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-muted">{Math.round(b.share)}%</td>
                  <td className="py-2.5 pl-3 text-right font-medium tabular-nums">{formatCurrency(b.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
