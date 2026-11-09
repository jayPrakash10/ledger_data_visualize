/** Month identifier in "YYYY-MM" form. */
export type MonthKey = string;

export type CategoryIconKey =
  | "home"
  | "basket"
  | "utensils"
  | "car"
  | "zap"
  | "heart"
  | "bag"
  | "film"
  | "plane"
  | "graduation";

export interface Category {
  id: string;
  name: string;
  icon: CategoryIconKey;
  /** Key of a CSS color token, e.g. "cat-1". */
  colorKey: string;
  monthlyBudget: number;
  isEssential: boolean;
  description: string;
}

export type PaymentType = "card" | "upi" | "cash" | "bank";

export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentType;
  issuer: string;
  last4?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  /** ISO date "YYYY-MM-DD". */
  date: string;
  categoryId: string;
  paymentMethodId: string;
  merchant: string;
  note?: string;
  isRecurring: boolean;
  tags: string[];
}

export type ExpenseSort = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

export interface ExpenseQuery {
  search?: string;
  categoryIds?: string[];
  /** "YYYY-MM" or "all". */
  month?: MonthKey | "all";
  sort: ExpenseSort;
  page: number;
  pageSize: number;
}

export interface ExpensePage {
  items: Expense[];
  total: number;
  totalAmount: number;
  page: number;
  pageCount: number;
}

export type BudgetState = "ok" | "warning" | "over";

export interface BudgetStatus {
  category: Category;
  limit: number;
  spent: number;
  ratio: number;
  state: BudgetState;
}

export interface BreakdownItem {
  category: Category;
  amount: number;
  share: number;
  count: number;
}

export interface TrendPoint {
  month: MonthKey;
  label: string;
  total: number;
}

export interface Insight {
  id: string;
  tone: "up" | "down" | "info";
  title: string;
  detail: string;
  categoryId?: string;
}

export interface DashboardData {
  month: MonthKey;
  total: number;
  previousTotal: number;
  changePct: number | null;
  dailyAverage: number;
  txnCount: number;
  largest: Expense | null;
  topCategory: BreakdownItem | null;
  breakdown: BreakdownItem[];
  trend: TrendPoint[];
  budgets: BudgetStatus[];
  insights: Insight[];
  recent: Expense[];
}

export interface CategoryOverviewItem {
  category: Category;
  spent: number;
  count: number;
  previousSpent: number;
  changePct: number | null;
  budget: BudgetStatus;
  /** Last 6 months of spend, oldest first. */
  history: number[];
}

export interface ComparisonRow {
  category: Category;
  a: number;
  b: number;
  delta: number;
  deltaPct: number | null;
}

export interface ComparisonData {
  monthA: MonthKey;
  monthB: MonthKey;
  totalA: number;
  totalB: number;
  rows: ComparisonRow[];
}
