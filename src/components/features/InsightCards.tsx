import { Lightbulb, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import type { Insight } from "@/types";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";

const tones: Record<Insight["tone"], { icon: LucideIcon; wrap: string }> = {
  up: { icon: TrendingUp, wrap: "bg-danger/15 text-danger" },
  down: { icon: TrendingDown, wrap: "bg-success/15 text-success" },
  info: { icon: Lightbulb, wrap: "bg-primary-soft text-ink" },
};

export function InsightCards({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) return null;
  return (
    <section aria-label="Insights" className="grid gap-4 md:grid-cols-3">
      {insights.map((insight) => {
        const { icon: Icon, wrap } = tones[insight.tone];
        return (
          <Card key={insight.id} className="flex gap-3">
            <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-md", wrap)} aria-hidden="true">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-sans text-base font-semibold">{insight.title}</h3>
              <p className="mt-0.5 text-sm text-muted">{insight.detail}</p>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
