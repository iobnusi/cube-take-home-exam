"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import type { FilterParams } from "./types";
import type { TrendGroupBy } from "./types";

export interface Filters extends FilterParams {
  groupBy?: TrendGroupBy;
  page?: number;
}

export function useFilters(): {
  filters: Filters;
  setFilter: (key: keyof Filters, value: string | number | undefined) => void;
  setFilters: (updates: Partial<Filters>) => void;
} {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: Filters = {
    platform: searchParams.get("platform") ?? undefined,
    region: searchParams.get("region") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    groupBy: (searchParams.get("groupBy") as TrendGroupBy) ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
  };

  const setFilters = useCallback(
    (updates: Partial<Filters>) => {
      const current = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === null) {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      // Reset page when filters change (not when page itself changes)
      const isPageOnly = Object.keys(updates).length === 1 && "page" in updates;
      if (!isPageOnly) {
        current.delete("page");
      }

      router.push(`${pathname}?${current.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const setFilter = useCallback(
    (key: keyof Filters, value: string | number | undefined) => {
      setFilters({ [key]: value });
    },
    [setFilters]
  );

  return { filters, setFilter, setFilters };
}
