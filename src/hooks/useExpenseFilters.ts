"use client";

import { useCallback, useMemo, useState } from "react";
import type { ExpenseQuery, ExpenseSort } from "@/types";
import { PAGE_SIZE } from "@/lib/constants";
import { useDebounce } from "@/hooks/useDebounce";

export interface ExpenseFilters {
  search: string;
  categoryIds: string[];
  month: string;
  sort: ExpenseSort;
  page: number;
}

const DEFAULTS: ExpenseFilters = { search: "", categoryIds: [], month: "all", sort: "date-desc", page: 1 };

export function useExpenseFilters(initial: Partial<ExpenseFilters> = {}) {
  const [filters, setFilters] = useState<ExpenseFilters>({ ...DEFAULTS, ...initial });
  const debouncedSearch = useDebounce(filters.search, 250);

  const query = useMemo<ExpenseQuery>(
    () => ({
      search: debouncedSearch,
      categoryIds: filters.categoryIds,
      month: filters.month,
      sort: filters.sort,
      page: filters.page,
      pageSize: PAGE_SIZE,
    }),
    [debouncedSearch, filters.categoryIds, filters.month, filters.sort, filters.page],
  );

  const patch = useCallback((change: Partial<ExpenseFilters>) => {
    setFilters((f) => ({ ...f, page: 1, ...change }));
  }, []);

  const toggleCategory = useCallback((id: string) => {
    setFilters((f) => ({
      ...f,
      page: 1,
      categoryIds: f.categoryIds.includes(id) ? f.categoryIds.filter((c) => c !== id) : [...f.categoryIds, id],
    }));
  }, []);

  const isFiltered =
    filters.search !== "" || filters.categoryIds.length > 0 || filters.month !== "all";

  return {
    filters,
    query,
    isFiltered,
    setSearch: (search: string) => patch({ search }),
    setMonth: (month: string) => patch({ month }),
    setSort: (sort: ExpenseSort) => patch({ sort }),
    setPage: (page: number) => setFilters((f) => ({ ...f, page })),
    toggleCategory,
    clearCategories: () => patch({ categoryIds: [] }),
    reset: () => setFilters(DEFAULTS),
  };
}
