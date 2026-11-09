import Link from "next/link";
import { Repeat } from "lucide-react";
import type { Category, Expense, PaymentMethod } from "@/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { CategoryBadge } from "@/components/features/CategoryBadge";

interface ExpenseTableProps {
  expenses: Expense[];
  categoriesById: Record<string, Category>;
  paymentsById?: Record<string, PaymentMethod>;
  caption: string;
}

function paymentLabel(p?: PaymentMethod): string {
  if (!p) return "—";
  return p.last4 ? `${p.issuer} ••${p.last4}` : p.issuer === "Wallet" ? "Cash" : `${p.name} · ${p.issuer}`;
}

/** Table on md+, stacked cards below. Both are real lists/tables for assistive tech. */
export function ExpenseTable({ expenses, categoriesById, paymentsById, caption }: ExpenseTableProps) {
  const showPayment = Boolean(paymentsById);

  return (
    <>
      <table className="hidden w-full text-left text-sm md:table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <th scope="col" className="py-3 pr-3 font-medium">Date</th>
            <th scope="col" className="px-3 py-3 font-medium">Expense</th>
            <th scope="col" className="px-3 py-3 font-medium">Category</th>
            {showPayment && <th scope="col" className="px-3 py-3 font-medium">Paid with</th>}
            <th scope="col" className="py-3 pl-3 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => {
            const category = categoriesById[e.categoryId];
            return (
              <tr key={e.id} className="border-b border-line transition-colors duration-150 last:border-0 hover:bg-subtle/60">
                <td className="whitespace-nowrap py-3 pr-3 text-muted">{formatDate(e.date)}</td>
                <td className="max-w-xs px-3 py-3">
                  <Link href={`/expenses/${e.id}`} className="block truncate rounded-sm font-medium hover:underline" title={e.title}>
                    {e.title}
                  </Link>
                  <span className="flex items-center gap-2 text-xs text-muted">
                    <span className="truncate">{e.merchant}</span>
                    {e.isRecurring && (
                      <Badge tone="primary">
                        <Repeat className="h-3 w-3" aria-hidden="true" /> Recurring
                      </Badge>
                    )}
                  </span>
                </td>
                <td className="px-3 py-3">{category && <CategoryBadge category={category} />}</td>
                {showPayment && <td className="px-3 py-3 text-muted">{paymentLabel(paymentsById?.[e.paymentMethodId])}</td>}
                <td className="whitespace-nowrap py-3 pl-3 text-right font-medium tabular-nums">{formatCurrency(e.amount)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ul className="divide-y divide-line md:hidden" aria-label={caption}>
        {expenses.map((e) => {
          const category = categoriesById[e.categoryId];
          return (
            <li key={e.id} className="flex items-start justify-between gap-3 py-3">
              <div className="min-w-0 space-y-1.5">
                <Link href={`/expenses/${e.id}`} className="line-clamp-2 rounded-sm font-medium">
                  {e.title}
                </Link>
                <p className="text-xs text-muted">
                  {e.merchant} · {formatDate(e.date)}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {category && <CategoryBadge category={category} />}
                  {e.isRecurring && (
                    <Badge tone="primary">
                      <Repeat className="h-3 w-3" aria-hidden="true" /> Recurring
                    </Badge>
                  )}
                </div>
              </div>
              <p className="shrink-0 font-medium tabular-nums">{formatCurrency(e.amount)}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
