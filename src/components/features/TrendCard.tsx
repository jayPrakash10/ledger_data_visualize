"use client";

import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MonthKey, TrendPoint } from "@/types";
import { formatCompact, formatCurrency, formatMonthShort } from "@/lib/format";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Card, CardHeader } from "@/components/ui/Card";
import { ChartTooltip } from "@/components/features/ChartTooltip";

const tick = { fill: "rgb(var(--muted))", fontSize: 12 };

export function TrendCard({ trend, month }: { trend: TrendPoint[]; month: MonthKey }) {
  const reduced = usePrefersReducedMotion();
  const summary = trend.map((t) => `${t.label}: ${formatCurrency(t.total)}`).join(", ");

  return (
    <Card aria-labelledby="trend-title">
      <CardHeader id="trend-title" title="6-month trend" description="Total spending per month" />
      <div className="h-64 w-full" role="img" aria-label={`Line chart of monthly spending. ${summary}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: "rgb(var(--chart-a))", stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: "rgb(var(--chart-a))", stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgb(var(--line))" />
            <XAxis dataKey="label" tick={tick} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatCompact} tick={tick} axisLine={false} tickLine={false} width={48} />
            <Tooltip content={<ChartTooltip />} />
            <ReferenceLine x={formatMonthShort(month)} stroke="rgb(var(--muted))" strokeDasharray="4 4" />
            <Area
              type="monotone"
              dataKey="total"
              name="Spent"
              stroke="rgb(var(--chart-a))"
              strokeWidth={2.5}
              fill="url(#trendFill)"
              dot={{ r: 3, fill: "rgb(var(--chart-a))", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              isAnimationActive={!reduced}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
