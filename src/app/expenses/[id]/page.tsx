"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Repeat } from "lucide-react";
import type { ReactNode } from "react";
import { useAsync } from "@/hooks/useAsync";
import { useCategories, usePaymentMethods } from "@/hooks/useReferenceData";
import { getExpenseById, getSimilarExpenses } from "@/services/expenseService";
import { getBudgetStatus } from "@/services/analyticsService";
import { formatCurrency, formatDate, formatMonth } from "@/lib/format";
import { monthOf } from "@/lib/months";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { CategoryBadge, CategoryIconTile } from "@/components/features/CategoryBadge";
import { BudgetRow } from "@/components/features/BudgetAlertsCard";
import { ExpenseTable } from "@/components/features/ExpenseTable";

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 font-medium">{children}</dd>
    </div>
  );
}

export default function ExpenseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const expense = useAsync(() => getExpenseById(id), [id]);
  const similar = useAsync(() => getSimilarExpenses(id), [id]);
  const { byId: categoriesById } = useCategories();
  const { byId: paymentsById } = usePaymentMethods();
  const e = expense.data;
  const budget = useAsync(
    () => (e ? getBudgetStatus(e.categoryId, monthOf(e.date)) : Promise.resolve(null)),
    [e?.id],
  );

  const back = (
    <Link href="/expenses" className="mb-4 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-muted hover:text-ink">
      <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All expenses
    </Link>
  );

  if (expense.error) return <>{back}<ErrorState message={expense.error.message} onRetry={expense.reload} /></>;
  if (!e && expense.loading) {
    return (
      <>
        {back}
        <div className="space-y-4" role="status" aria-label="Loading expense">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </>
    );
  }
  if (!e) {
    return (
      <>
        {back}
        <EmptyState
          title="Expense not found"
          description="This expense doesn't exist or was removed."
          action={<Link href="/expenses" className={buttonStyles("primary")}>Back to expenses</Link>}
        />
      </>
    );
  }

  const category = categoriesById[e.categoryId];
  const payment = paymentsById[e.paymentMethodId];

  return (
    <>
      {back}
      <Card className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            {category && <CategoryIconTile category={category} size="lg" />}
            <div className="min-w-0">
              <h1 className="text-title break-words">{e.title}</h1>
              <p className="mt-1 text-muted">
                {e.merchant} · {formatDate(e.date)}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {category && <CategoryBadge category={category} />}
                {e.isRecurring && (
                  <Badge tone="primary">
                    <Repeat className="h-3 w-3" aria-hidden="true" /> Recurring
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <p className="font-display text-display font-semibold tabular-nums">{formatCurrency(e.amount, { decimals: true })}</p>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card aria-labelledby="details-title">
          <CardHeader id="details-title" title="Details" />
          <dl className="grid gap-5 sm:grid-cols-2">
            <Detail label="Date">{formatDate(e.date)}</Detail>
            <Detail label="Category">{category?.name ?? "—"}</Detail>
            <Detail label="Paid with">{payment ? (payment.last4 ? `${payment.issuer} ${payment.name} ••${payment.last4}` : `${payment.name} · ${payment.issuer}`) : "—"}</Detail>
            <Detail label="Merchant">{e.merchant}</Detail>
            <Detail label="Tags">
              {e.tags.length ? (
                <span className="flex flex-wrap gap-1.5">
                  {e.tags.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </span>
              ) : (
                <span className="font-normal text-muted">None</span>
              )}
            </Detail>
            <Detail label="Reference">{e.id}</Detail>
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-muted">Note</dt>
              <dd className="mt-1">{e.note ?? <span className="text-muted">No note added</span>}</dd>
            </div>
          </dl>
        </Card>

        <Card aria-labelledby="context-title">
          <CardHeader id="context-title" title="Budget context" description={`${category?.name ?? "Category"} in ${formatMonth(monthOf(e.date))}`} />
          {budget.data ? <ul><BudgetRow budget={budget.data} /></ul> : <Skeleton className="h-16 w-full" />}
        </Card>
      </div>

      <Card className="mt-6" aria-labelledby="similar-title">
        <CardHeader id="similar-title" title="Similar expenses" description="Same category, same merchant first" />
        {similar.data ? (
          similar.data.length ? (
            <ExpenseTable expenses={similar.data} categoriesById={categoriesById} caption="Similar expenses" />
          ) : (
            <EmptyState title="Nothing similar" description="This is the only expense in its category." />
          )
        ) : (
          <Skeleton className="h-32 w-full" />
        )}
      </Card>
    </>
  );
}
