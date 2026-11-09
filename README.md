# Ledger – Personal Expense Analyzer

A portfolio/demo frontend: visualize monthly spending by category, filter by category, compare months, and track budgets.
Built with **Next.js 15 (App Router) + TypeScript + Tailwind CSS 3 + Recharts + lucide-react**. All data is mocked.

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the build
npm run typecheck  # tsc --noEmit
```

Copy `.env.example` to `.env.local` to change mock latency or simulate failures (`NEXT_PUBLIC_MOCK_FAILURE_RATE=0.3` shows the error states).

## Screens

| Route | Purpose |
|---|---|
| `/` | Overview: month picker, category filter, stat tiles, insights, donut + table, 6-month trend, budget alerts, recent expenses |
| `/expenses` | Searchable, filterable, sortable, paginated list. Accepts `?category=a,b&month=2026-10` |
| `/expenses/[id]` | Detail with budget context and similar expenses |
| `/categories` | Budget progress and trend per category; pin favorites (saved in localStorage) |
| `/compare` | Month vs month: grouped bars plus a table of movers |

## Folder guide

```
src/
├── app/               routes (pages, layout, error, not-found)
├── components/
│   ├── ui/            primitives: Button, Card, Badge, Field, Pagination, Skeleton, EmptyState, ErrorState, ProgressBar
│   ├── layout/        AppShell (sidebar / bottom tabs), PageHeader, ThemeToggle
│   └── features/      expense-specific: charts, stat tiles, filters, tables
├── services/          the ONLY layer that touches data (async, simulated latency)
├── data/              mock datasets (typed)
├── hooks/             useAsync, useDebounce, useExpenseFilters, usePinnedCategories, ...
├── lib/               formatters, analytics (pure), query helpers, constants, icons
├── styles/globals.css design tokens (light/dark) + base styles
└── types/             entity models
```

## Replacing the mock services with a real API

1. Set `NEXT_PUBLIC_API_BASE_URL` (see `src/services/config.ts`; currently unused) and `NEXT_PUBLIC_USE_MOCK=false`.
2. In `src/services/*.ts`, replace each function body with a `fetch` call that returns the same typed shape:
   - `referenceService`: `getCategories`, `getPaymentMethods`, `getCategoryById`
   - `expenseService`: `getExpenses(query)`, `getExpenseById(id)`, `getSimilarExpenses(id)`
   - `analyticsService`: `getAvailableMonths`, `getDashboard(month, categoryIds)`, `getCategoryOverview`, `getBudgetStatus`, `getComparison`
3. Components and hooks do not change. `analyticsService` currently computes aggregates client-side from raw data; a real backend would normally return those aggregates directly.

## Editing mock data

- `src/data/categories.ts`: names, icons, colors (`cat-1`…`cat-10` tokens), monthly budgets.
- `src/data/paymentMethods.ts`: cards, UPI, cash.
- `src/data/expenses.ts`: seeded generator (fixed monthly bills + variable spending rules) plus hand-written edge cases. Change `fixedRules` / `variableRules` or the seed (`createRng(...)`), or replace `expenses` with a literal array of `Expense` objects.

## Design tokens

Colors, shadows and category hues are CSS variables in `src/styles/globals.css` (light and `[data-theme="dark"]`), exposed to Tailwind in `tailwind.config.ts`. Change the look there only.

## Assumptions

- Single user; no auth, no add/edit/delete.
- Currency is INR (₹, `en-IN` formatting).
- Data covers Nov 2025 – Oct 2026; Oct 2026 is the default month.
- Budgets are fixed monthly limits per category. "Near limit" is ≥ 80%, "Over" is ≥ 100%.
- 10 categories, 5 payment methods, about 380 expenses so 12 months of charts look real.
- Insights ignore the category filter (they describe the whole month).
- Light and dark themes both provided; first visit follows the system setting.
- Pinned categories are stored only in the browser's localStorage.
- Fonts (Inter, Fraunces) load via `next/font/google`, which needs network access at build time.
