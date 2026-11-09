import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { BudgetStatus, BudgetState } from "@/types";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

const stateLabel: Record<BudgetState, string> = { ok: "On track", warning: "Near limit", over: "Over budget" };
const stateTone = { ok: "success", warning: "warning", over: "danger" } as const;

export function BudgetRow({ budget }: { budget: BudgetStatus }) {
  const { category, spent, limit, ratio, state } = budget;
  return (
    <li className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{category.name}</span>
        <Badge tone={stateTone[state]}>{stateLabel[state]}</Badge>
      </div>
      <ProgressBar ratio={ratio} state={state} label={`${category.name} budget used`} />
      <p className="text-sm text-muted tabular-nums">
        {formatCurrency(spent)} of {formatCurrency(limit)} · {formatPercent(ratio * 100)}
      </p>
    </li>
  );
}

export function BudgetAlertsCard({ budgets, month }: { budgets: BudgetStatus[]; month: string }) {
  const alerts = budgets.filter((b) => b.state !== "ok");
  return (
    <Card aria-labelledby="budget-title">
      <CardHeader
        id="budget-title"
        title="Budget alerts"
        description={alerts.length ? `${alerts.length} categor${alerts.length === 1 ? "y needs" : "ies need"} attention` : "Within budget"}
        action={
          <Link href={`/categories?month=${month}`} className="rounded-sm text-sm font-medium text-primary hover:underline">
            All budgets
          </Link>
        }
      />
      {alerts.length === 0 ? (
        <p className="flex items-center gap-2 rounded-md bg-success/10 p-4 text-sm text-success">
          <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
          Nothing over or close to its limit this month.
        </p>
      ) : (
        <ul className="space-y-5">
          {alerts.slice(0, 4).map((b) => (
            <BudgetRow key={b.category.id} budget={b} />
          ))}
        </ul>
      )}
    </Card>
  );
}
