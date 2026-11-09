import type { ReactNode } from "react";
import type { DashboardData } from "@/types";
import { formatCurrency, formatDateShort } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ChangeIndicator } from "@/components/features/ChangeIndicator";

function Tile({ label, value, footer }: { label: string; value: string; footer: ReactNode }) {
  return (
    <Card className="flex flex-col gap-1.5">
      <p className="text-sm text-muted">{label}</p>
      <p className="font-display text-3xl font-semibold tabular-nums tracking-tight">{value}</p>
      <div className="min-h-5 text-sm text-muted">{footer}</div>
    </Card>
  );
}

export function StatTiles({ data }: { data: DashboardData }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Tile label="Total spent" value={formatCurrency(data.total)} footer={<ChangeIndicator pct={data.changePct} />} />
      <Tile
        label="Daily average"
        value={formatCurrency(data.dailyAverage)}
        footer={`Across ${data.txnCount} transaction${data.txnCount === 1 ? "" : "s"}`}
      />
      <Tile
        label="Top category"
        value={data.topCategory ? data.topCategory.category.name : "—"}
        footer={data.topCategory ? `${formatCurrency(data.topCategory.amount)} · ${Math.round(data.topCategory.share)}% of spend` : "No spending yet"}
      />
      <Tile
        label="Largest expense"
        value={data.largest ? formatCurrency(data.largest.amount) : "—"}
        footer={data.largest ? `${data.largest.merchant} · ${formatDateShort(data.largest.date)}` : "No spending yet"}
      />
    </div>
  );
}

export function StatTilesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-hidden="true">
      {Array.from({ length: 4 }, (_, i) => (
        <Card key={i} className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-28" />
        </Card>
      ))}
    </div>
  );
}
