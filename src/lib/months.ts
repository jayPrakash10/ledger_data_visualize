import type { MonthKey } from "@/types";

export const monthOf = (isoDate: string): MonthKey => isoDate.slice(0, 7);

function parse(month: MonthKey): [number, number] {
  const [y, m] = month.split("-").map(Number);
  return [y, m];
}

export function shiftMonth(month: MonthKey, delta: number): MonthKey {
  const [y, m] = parse(month);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function daysInMonth(month: MonthKey): number {
  const [y, m] = parse(month);
  return new Date(y, m, 0).getDate();
}

/** The `count` months ending at `end` (inclusive), oldest first. */
export function lastNMonths(end: MonthKey, count: number): MonthKey[] {
  return Array.from({ length: count }, (_, i) => shiftMonth(end, i - (count - 1)));
}
