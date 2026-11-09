"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ComparisonData } from "@/types";
import { formatCompact, formatMonthShort } from "@/lib/format";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ChartTooltip } from "@/components/features/ChartTooltip";

const tick = { fill: "rgb(var(--muted))", fontSize: 12 };

export function CompareChart({ data }: { data: ComparisonData }) {
  const reduced = usePrefersReducedMotion();
  const labelA = formatMonthShort(data.monthA);
  const labelB = formatMonthShort(data.monthB);
  const rows = data.rows
    .filter((r) => r.a > 0 || r.b > 0)
    .map((r) => ({ name: r.category.name, [labelA]: r.a, [labelB]: r.b }));

  return (
    <div
      className="w-full"
      style={{ height: Math.max(260, rows.length * 56) }}
      role="img"
      aria-label={`Bar chart comparing spending by category between ${labelA} and ${labelB}. The table below has the exact figures.`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 0 }} barGap={3}>
          <CartesianGrid horizontal={false} stroke="rgb(var(--line))" />
          <XAxis type="number" tickFormatter={formatCompact} tick={tick} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={tick} axisLine={false} tickLine={false} width={96} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgb(var(--subtle) / 0.6)" }} />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Bar dataKey={labelA} fill="rgb(var(--chart-b))" radius={[0, 4, 4, 0]} isAnimationActive={!reduced} />
          <Bar dataKey={labelB} fill="rgb(var(--chart-a))" radius={[0, 4, 4, 0]} isAnimationActive={!reduced} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
