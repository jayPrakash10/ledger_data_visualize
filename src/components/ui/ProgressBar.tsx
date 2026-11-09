import type { BudgetState } from "@/types";
import { cn } from "@/lib/cn";

const fills: Record<BudgetState, string> = {
  ok: "bg-primary",
  warning: "bg-warning",
  over: "bg-danger",
};

interface ProgressBarProps {
  ratio: number;
  state: BudgetState;
  label: string;
}

export function ProgressBar({ ratio, state, label }: ProgressBarProps) {
  const pct = Math.min(100, Math.round(ratio * 100));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className="h-2 w-full overflow-hidden rounded-full bg-subtle"
    >
      <div className={cn("h-full rounded-full transition-[width] duration-200", fills[state])} style={{ width: `${pct}%` }} />
    </div>
  );
}
