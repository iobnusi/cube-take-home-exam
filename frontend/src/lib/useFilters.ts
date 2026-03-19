"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import type { FilterParams, IsMall } from "./types";
import type { TrendGroupBy } from "./types";

export type SortDir = 'asc' | 'desc';

export interface Filters extends FilterParams {
  groupBy?: TrendGroupBy;
  page?: number;
  sort_by?: string;
  sort_dir?: SortDir;
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
    l1_category: searchParams.get("l1_category") ?? undefined,
    l2_category: searchParams.get("l2_category") ?? undefined,
    l3_category: searchParams.get("l3_category") ?? undefined,
    l4_category: searchParams.get("l4_category") ?? undefined,
    origin: searchParams.get("origin") ?? undefined,
    is_mall: (searchParams.get("is_mall") as IsMall) ?? undefined,
    groupBy: (searchParams.get("groupBy") as TrendGroupBy) ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    sort_by: searchParams.get("sort_by") ?? undefined,
    sort_dir: (searchParams.get("sort_dir") as SortDir) ?? undefined,
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
