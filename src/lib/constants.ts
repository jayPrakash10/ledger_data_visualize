export const APP_NAME = "Ledger";
export const PAGE_SIZE = 10;
/** Budget usage at or above this ratio raises a warning. */
export const BUDGET_WARNING_RATIO = 0.8;

export const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: "overview" },
  { href: "/expenses", label: "Expenses", icon: "expenses" },
  { href: "/categories", label: "Categories", icon: "categories" },
  { href: "/compare", label: "Compare", icon: "compare" },
] as const;
