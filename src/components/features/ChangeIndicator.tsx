import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/cn";

/** Spending change: an increase reads as a warning, a decrease as good. Never color-only. */
export function ChangeIndicator({ pct, suffix = "vs last month" }: { pct: number | null; suffix?: string }) {
  if (pct === null) return <span className="text-sm text-muted">No prior data</span>;
  const rounded = Math.round(pct);
  if (rounded === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-sm text-muted">
        <Minus className="h-4 w-4" aria-hidden="true" /> Flat {suffix}
      </span>
    );
  }
  const up = rounded > 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm font-medium", up ? "text-danger" : "text-success")}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      {formatPercent(pct, { signed: true })}
      <span className="font-normal text-muted">{suffix}</span>
    </span>
  );
}
