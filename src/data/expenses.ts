import type { Expense } from "@/types";
import { createRng } from "@/lib/random";

/**
 * MOCK DATA — generated deterministically (seeded) so every load is identical.
 * Covers Nov 2025 – Oct 2026. Edit the rules below, or replace `expenses`
 * with a hand-written array, to change the dataset.
 */

interface Item {
  title: string;
  merchant: string;
  min: number;
  max: number;
}

interface VariableRule {
  categoryId: string;
  items: Item[];
  pay: string[];
  /** Number of transactions for a calendar month (1-12). */
  count: (month: number, roll: () => number) => number;
}

interface FixedRule {
  title: string;
  merchant: string;
  categoryId: string;
  day: number;
  pay: string;
  tags: string[];
  amount: (month: number, roll: () => number) => number;
}

const between = (roll: () => number, min: number, max: number) =>
  min + Math.floor(roll() * (max - min + 1));

const MONTHS: { year: number; month: number }[] = [
  { year: 2025, month: 11 },
  { year: 2025, month: 12 },
  ...Array.from({ length: 10 }, (_, i) => ({ year: 2026, month: i + 1 })),
];

const fixedRules: FixedRule[] = [
  { title: "Monthly rent – 2BHK Indiranagar", merchant: "Mr. Rao (Landlord)", categoryId: "housing", day: 1, pay: "pm_bank", tags: ["rent", "fixed"], amount: () => 28000 },
  { title: "Society maintenance", merchant: "Green Meadows RWA", categoryId: "housing", day: 3, pay: "pm_upi", tags: ["fixed"], amount: () => 2400 },
  { title: "Electricity bill", merchant: "BESCOM", categoryId: "utilities", day: 8, pay: "pm_upi", tags: ["bill"], amount: (m, r) => ([3, 4, 5, 6].includes(m) ? between(r, 2800, 3400) : between(r, 1500, 2200)) },
  { title: "Fibre broadband", merchant: "ACT Fibernet", categoryId: "utilities", day: 5, pay: "pm_upi", tags: ["bill"], amount: () => 1049 },
  { title: "Mobile recharge", merchant: "Jio Prepaid", categoryId: "utilities", day: 10, pay: "pm_upi", tags: ["bill"], amount: () => 749 },
  { title: "Streaming subscription", merchant: "Netflix", categoryId: "entertainment", day: 12, pay: "pm_card", tags: ["subscription"], amount: () => 649 },
  { title: "Music subscription", merchant: "Spotify", categoryId: "entertainment", day: 14, pay: "pm_card", tags: ["subscription"], amount: () => 119 },
  { title: "Gym membership", merchant: "Cult.fit", categoryId: "health", day: 6, pay: "pm_debit", tags: ["fitness"], amount: () => 1500 },
];

const variableRules: VariableRule[] = [
  {
    categoryId: "groceries",
    pay: ["pm_upi", "pm_card", "pm_upi"],
    count: (_, r) => between(r, 6, 9),
    items: [
      { title: "Weekly vegetables & fruit", merchant: "Sabzi Mandi", min: 350, max: 900 },
      { title: "Monthly staples", merchant: "DMart", min: 1800, max: 3200 },
      { title: "Quick commerce order", merchant: "Blinkit", min: 250, max: 1100 },
      { title: "Groceries top-up", merchant: "BigBasket", min: 600, max: 2100 },
      { title: "Dairy & bread", merchant: "Nandini Milk Parlour", min: 120, max: 420 },
    ],
  },
  {
    categoryId: "dining",
    pay: ["pm_card", "pm_upi", "pm_card"],
    count: (m, r) => (m === 12 ? between(r, 8, 11) : between(r, 4, 8)),
    items: [
      { title: "Dinner with friends", merchant: "Toit Brewpub", min: 1200, max: 2600 },
      { title: "Biryani lunch", merchant: "Behrouz Biryani", min: 450, max: 900 },
      { title: "Food delivery", merchant: "Swiggy", min: 280, max: 750 },
      { title: "Food delivery", merchant: "Zomato", min: 300, max: 800 },
      { title: "Filter coffee & snacks", merchant: "Third Wave Coffee", min: 220, max: 520 },
    ],
  },
  {
    categoryId: "transport",
    pay: ["pm_upi", "pm_card", "pm_upi"],
    count: (_, r) => between(r, 7, 11),
    items: [
      { title: "Fuel", merchant: "Indian Oil", min: 900, max: 2200 },
      { title: "Cab ride", merchant: "Uber", min: 180, max: 650 },
      { title: "Auto ride", merchant: "Namma Yatri", min: 60, max: 220 },
      { title: "Metro card recharge", merchant: "Namma Metro", min: 300, max: 600 },
      { title: "Car servicing", merchant: "Maruti Service Centre", min: 1800, max: 4200 },
    ],
  },
  {
    categoryId: "shopping",
    pay: ["pm_card", "pm_card", "pm_upi"],
    count: (m, r) => (m === 10 ? between(r, 4, 5) : between(r, 1, 3)),
    items: [
      { title: "Running shoes", merchant: "Decathlon", min: 1999, max: 4500 },
      { title: "Festive kurta set", merchant: "Fabindia", min: 1800, max: 5200 },
      { title: "Home decor", merchant: "IKEA", min: 800, max: 3800 },
      { title: "Earphones & accessories", merchant: "Amazon", min: 499, max: 2999 },
      { title: "Gift for family", merchant: "Ferns N Petals", min: 700, max: 2400 },
    ],
  },
  {
    categoryId: "health",
    pay: ["pm_upi", "pm_debit"],
    count: (_, r) => between(r, 0, 2),
    items: [
      { title: "Pharmacy", merchant: "Apollo Pharmacy", min: 180, max: 1300 },
      { title: "Doctor consultation", merchant: "Manipal Clinic", min: 600, max: 1200 },
      { title: "Dental check-up", merchant: "Clove Dental", min: 800, max: 2800 },
      { title: "Lab tests", merchant: "Thyrocare", min: 700, max: 2400 },
    ],
  },
  {
    categoryId: "entertainment",
    pay: ["pm_card", "pm_upi"],
    count: (_, r) => between(r, 1, 3),
    items: [
      { title: "Movie tickets", merchant: "PVR Cinemas", min: 500, max: 1100 },
      { title: "Live music night", merchant: "BookMyShow", min: 800, max: 2500 },
      { title: "Board game café", merchant: "Dice & Dine", min: 400, max: 900 },
      { title: "Game purchase", merchant: "Steam", min: 399, max: 1499 },
    ],
  },
  {
    categoryId: "education",
    pay: ["pm_card"],
    count: (m, r) => ([1, 4, 8].includes(m) ? 1 : r() < 0.3 ? 1 : 0),
    items: [
      { title: "Online course – UX research", merchant: "Coursera", min: 2999, max: 4999 },
      { title: "Design books", merchant: "Crossword Bookstore", min: 600, max: 1800 },
      { title: "Weekend workshop fee", merchant: "Interaction Design Foundation", min: 1500, max: 3500 },
    ],
  },
  {
    categoryId: "travel",
    pay: ["pm_card", "pm_bank"],
    count: (m, r) => (m === 12 ? 4 : m === 5 ? 3 : m === 10 ? 1 : r() < 0.15 ? 1 : 0),
    items: [
      { title: "Flight tickets", merchant: "IndiGo", min: 4500, max: 9500 },
      { title: "Hotel stay", merchant: "Airbnb", min: 3000, max: 8200 },
      { title: "Train tickets", merchant: "IRCTC", min: 600, max: 2200 },
      { title: "Sightseeing & activities", merchant: "GetYourGuide", min: 900, max: 3200 },
    ],
  },
];

const roundAmount = (value: number) => (value < 100 ? Math.round(value) : Math.round(value / 5) * 5);
const iso = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

type Draft = Omit<Expense, "id">;

function generate(): Draft[] {
  const roll = createRng(20261031);
  const drafts: Draft[] = [];

  for (const { year, month } of MONTHS) {
    const days = new Date(year, month, 0).getDate();

    for (const rule of fixedRules) {
      drafts.push({
        title: rule.title,
        amount: rule.amount(month, roll),
        date: iso(year, month, rule.day),
        categoryId: rule.categoryId,
        paymentMethodId: rule.pay,
        merchant: rule.merchant,
        isRecurring: true,
        tags: rule.tags,
      });
    }

    for (const rule of variableRules) {
      const n = rule.count(month, roll);
      for (let i = 0; i < n; i += 1) {
        const item = rule.items[Math.floor(roll() * rule.items.length)];
        drafts.push({
          title: item.title,
          amount: roundAmount(item.min + roll() * (item.max - item.min)),
          date: iso(year, month, between(roll, 1, days)),
          categoryId: rule.categoryId,
          paymentMethodId: rule.pay[Math.floor(roll() * rule.pay.length)],
          merchant: item.merchant,
          isRecurring: false,
          tags: [],
        });
      }
    }
  }

  // Hand-written edge cases: very long title, tiny amount, big-ticket item, optional fields.
  drafts.push(
    {
      title: "MacBook Air M3 – freelance work laptop (down payment incl. AppleCare+ and extended warranty)",
      amount: 89999,
      date: "2026-08-17",
      categoryId: "shopping",
      paymentMethodId: "pm_card",
      merchant: "Apple Authorised Reseller – Indiranagar",
      note: "Keep the invoice for the GST claim on business equipment.",
      isRecurring: false,
      tags: ["work", "big-ticket"],
    },
    {
      title: "Annual health insurance premium – family floater plan with critical illness rider",
      amount: 24850,
      date: "2026-03-14",
      categoryId: "health",
      paymentMethodId: "pm_bank",
      merchant: "Care Health Insurance",
      note: "Renews every March. Policy no. ending 7741.",
      isRecurring: true,
      tags: ["insurance"],
    },
    {
      title: "Chai",
      amount: 20,
      date: "2026-06-02",
      categoryId: "dining",
      paymentMethodId: "pm_cash",
      merchant: "Roadside stall",
      isRecurring: false,
      tags: [],
    },
    {
      title: "Water purifier service",
      amount: 1200,
      date: "2026-09-21",
      categoryId: "housing",
      paymentMethodId: "pm_cash",
      merchant: "Kent RO Service",
      isRecurring: false,
      tags: [],
    },
  );

  return drafts;
}

export const expenses: Expense[] = generate()
  .sort((a, b) => (a.date === b.date ? a.title.localeCompare(b.title) : a.date.localeCompare(b.date)))
  .map((draft, index) => ({ ...draft, id: `exp_${String(index + 1).padStart(4, "0")}` }));
