import type { MonthKey } from "@/types";

const inr0 = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const inr2 = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number, opts: { decimals?: boolean } = {}): string {
  return (opts.decimals ? inr2 : inr0).format(value);
}

/** Compact axis label: ₹850, ₹1.2k, ₹45k, ₹1.5L. */
export function formatCompact(value: number): string {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1).replace(/\.0$/, "")}L`;
  if (value >= 10000) return `₹${Math.round(value / 1000)}k`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `₹${Math.round(value)}`;
}

export function formatPercent(value: number, opts: { signed?: boolean } = {}): string {
  const rounded = Math.round(value);
  const sign = opts.signed && rounded > 0 ? "+" : "";
  return `${sign}${rounded}%`;
}

function toDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d ?? 1);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(toDate(iso));
}

export function formatDateShort(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(toDate(iso));
}

export function formatMonth(month: MonthKey): string {
  return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(
    toDate(`${month}-01`),
  );
}

export function formatMonthShort(month: MonthKey): string {
  const d = toDate(`${month}-01`);
  const m = new Intl.DateTimeFormat("en-IN", { month: "short" }).format(d);
  return `${m} ’${String(d.getFullYear()).slice(2)}`;
}

export function monthName(month: MonthKey): string {
  return new Intl.DateTimeFormat("en-IN", { month: "long" }).format(toDate(`${month}-01`));
}
