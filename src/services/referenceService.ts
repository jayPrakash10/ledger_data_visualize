import type { Category, PaymentMethod } from "@/types";
import { categories } from "@/data/categories";
import { paymentMethods } from "@/data/paymentMethods";
import { simulateLatency } from "@/services/delay";

export async function getCategories(): Promise<Category[]> {
  await simulateLatency();
  return categories.map((c) => ({ ...c }));
}

export async function getCategoryById(id: string): Promise<Category | null> {
  await simulateLatency();
  return categories.find((c) => c.id === id) ?? null;
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  await simulateLatency();
  return paymentMethods.map((p) => ({ ...p }));
}
