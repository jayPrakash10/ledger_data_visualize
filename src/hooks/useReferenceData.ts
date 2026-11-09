"use client";

import { useMemo } from "react";
import type { Category, PaymentMethod } from "@/types";
import { useAsync } from "@/hooks/useAsync";
import { getCategories, getPaymentMethods } from "@/services/referenceService";

const toMap = <T extends { id: string }>(list: T[] | undefined): Record<string, T> =>
  Object.fromEntries((list ?? []).map((item) => [item.id, item]));

export function useCategories() {
  const { data, loading, error, reload } = useAsync(getCategories, []);
  const byId = useMemo<Record<string, Category>>(() => toMap(data), [data]);
  return { categories: data ?? [], byId, loading, error, reload };
}

export function usePaymentMethods() {
  const { data, loading, error } = useAsync(getPaymentMethods, []);
  const byId = useMemo<Record<string, PaymentMethod>>(() => toMap(data), [data]);
  return { paymentMethods: data ?? [], byId, loading, error };
}
