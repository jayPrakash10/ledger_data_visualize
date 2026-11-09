import type { PaymentMethod } from "@/types";

// MOCK DATA
export const paymentMethods: PaymentMethod[] = [
  { id: "pm_card", name: "Regalia Credit Card", type: "card", issuer: "HDFC Bank", last4: "4821" },
  { id: "pm_debit", name: "Savings Debit Card", type: "card", issuer: "ICICI Bank", last4: "1190" },
  { id: "pm_upi", name: "UPI", type: "upi", issuer: "Google Pay" },
  { id: "pm_bank", name: "Net Banking", type: "bank", issuer: "HDFC Bank" },
  { id: "pm_cash", name: "Cash", type: "cash", issuer: "Wallet" },
];
