"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ledger:pinned-categories";

/** Pinned (favorite) category ids, remembered per browser. Works without storage. */
export function usePinnedCategories() {
  const [pinned, setPinned] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setPinned(JSON.parse(raw) as string[]);
    } catch {
      /* storage unavailable: start empty */
    }
  }, []);

  const toggle = useCallback((id: string) => {
    setPinned((current) => {
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { pinned, toggle };
}
