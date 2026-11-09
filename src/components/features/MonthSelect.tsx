import type { MonthKey } from "@/types";
import { formatMonth } from "@/lib/format";
import { Select } from "@/components/ui/Field";

interface MonthSelectProps {
  label?: string;
  months: MonthKey[];
  value: string;
  onChange: (month: string) => void;
  includeAll?: boolean;
  hideLabel?: boolean;
  className?: string;
}

export function MonthSelect({ label = "Month", months, value, onChange, includeAll, hideLabel, className }: MonthSelectProps) {
  const options = [
    ...(includeAll ? [{ value: "all", label: "All time" }] : []),
    ...months.map((m) => ({ value: m, label: formatMonth(m) })),
  ];
  return <Select label={label} options={options} value={value} onValueChange={onChange} hideLabel={hideLabel} className={className} />;
}
