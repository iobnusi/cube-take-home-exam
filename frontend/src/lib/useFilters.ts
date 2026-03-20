"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import type { FilterParams, IsMall, SummaryGroupBy } from "./types";
import type { TrendGroupBy } from "./types";

export type SortDir = 'asc' | 'desc';

export interface Filters extends FilterParams {
  groupBy?: TrendGroupBy;
  page?: number;
  sort_by?: string;
  sort_dir?: SortDir;
  kpi_nmv_group_by?: SummaryGroupBy;
  kpi_units_sold_group_by?: SummaryGroupBy;
  kpi_unique_shops_group_by?: SummaryGroupBy;
  kpi_unique_products_group_by?: SummaryGroupBy;
  kpi_avg_price_platform?: string;
}

type FilterKey = keyof Filters;
type PendingFiltersListener = (keys: FilterKey[]) => void;

let pendingFilterKeysStore: FilterKey[] = [];
const pendingFiltersListeners = new Set<PendingFiltersListener>();

function setPendingFilterKeys(keys: FilterKey[]) {
  pendingFilterKeysStore = keys;
  pendingFiltersListeners.forEach((listener) => listener(keys));
}

export function useFilters(): {
  filters: Filters;
  setFilter: (key: keyof Filters, value: string | number | undefined) => void;
  setFilters: (updates: Partial<Filters>) => void;
  pendingFilterKeys: FilterKey[];
  isNavigating: boolean;
} {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, startTransition] = useTransition();
  const [pendingFilterKeys, setPendingFilterKeysState] = useState<FilterKey[]>(
    pendingFilterKeysStore,
  );

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
    kpi_nmv_group_by:
      (searchParams.get("kpi_nmv_group_by") as SummaryGroupBy) ?? undefined,
    kpi_units_sold_group_by:
      (searchParams.get("kpi_units_sold_group_by") as SummaryGroupBy) ?? undefined,
    kpi_unique_shops_group_by:
      (searchParams.get("kpi_unique_shops_group_by") as SummaryGroupBy) ?? undefined,
    kpi_unique_products_group_by:
      (searchParams.get("kpi_unique_products_group_by") as SummaryGroupBy) ?? undefined,
    kpi_avg_price_platform:
      searchParams.get("kpi_avg_price_platform") ?? undefined,
  };

  useEffect(() => {
    const listener: PendingFiltersListener = (keys) => {
      setPendingFilterKeysState(keys);
    };

    pendingFiltersListeners.add(listener);
    return () => {
      pendingFiltersListeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (pendingFilterKeysStore.length > 0) {
      setPendingFilterKeys([]);
    }
  }, [searchParams]);

  const setFilters = useCallback(
    (updates: Partial<Filters>) => {
      const current = new URLSearchParams(searchParams.toString());
      const updateKeys = Object.keys(updates) as FilterKey[];

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === null) {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      const isPageOnly = Object.keys(updates).length === 1 && "page" in updates;
      if (!isPageOnly) {
        current.delete("page");
      }

      setPendingFilterKeys(updateKeys);
      startTransition(() => {
        router.push(`${pathname}?${current.toString()}`);
      });
    },
    [router, pathname, searchParams, startTransition]
  );

  const setFilter = useCallback(
    (key: keyof Filters, value: string | number | undefined) => {
      setFilters({ [key]: value });
    },
    [setFilters]
  );

  return {
    filters,
    setFilter,
    setFilters,
    pendingFilterKeys,
    isNavigating,
  };
}
