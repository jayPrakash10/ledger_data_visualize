import { formatCurrency } from "@/lib/format";

interface Entry {
  name?: string | number;
  value?: number | string;
  color?: string;
  payload?: { color?: string };
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: Entry[];
}

export function ChartTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-line bg-surface px-3 py-2 text-sm shadow-pop">
      {label !== undefined && <p className="mb-1 font-medium">{label}</p>}
      <ul className="space-y-0.5">
        {payload.map((entry, i) => (
          <li key={`${entry.name}-${i}`} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.payload?.color ?? entry.color }}
              aria-hidden="true"
            />
            <span className="text-muted">{entry.name}</span>
            <span className="ml-auto pl-4 font-medium tabular-nums">{formatCurrency(Number(entry.value ?? 0))}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
