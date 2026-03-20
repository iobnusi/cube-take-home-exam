'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { filtersFromParamsClient } from './utils';
import type { Filters } from './types';

type FilterKey = keyof Filters;
type PendingFiltersListener = (keys: FilterKey[]) => void;
type PendingNavigationListener = (isPending: boolean) => void;

let pendingFilterKeysStore: FilterKey[] = [];
let pendingNavigationStore = false;
let pendingSearchStore: string | null = null;
const pendingFiltersListeners = new Set<PendingFiltersListener>();
const pendingNavigationListeners = new Set<PendingNavigationListener>();

function normalizeSearch(search: string) {
  const params = new URLSearchParams(search);
  return new URLSearchParams(
    Array.from(params.entries()).sort(([leftKey], [rightKey]) =>
      leftKey.localeCompare(rightKey),
    ),
  ).toString();
}

function setPendingFilterKeys(keys: FilterKey[]) {
  pendingFilterKeysStore = keys;
  pendingFiltersListeners.forEach((listener) => listener(keys));
}

function setPendingNavigation(isPending: boolean) {
  pendingNavigationStore = isPending;
  pendingNavigationListeners.forEach((listener) => listener(isPending));
}

function clearPendingNavigation() {
  pendingSearchStore = null;
  setPendingFilterKeys([]);
  setPendingNavigation(false);
}

export function useFilters(): {
  filters: Filters;
  setFilter: (key: FilterKey, value: string | number | undefined) => void;
  setFilters: (updates: Partial<Filters>) => void;
  pendingFilterKeys: FilterKey[];
  isNavigating: boolean;
} {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = normalizeSearch(searchParams.toString());
  const [, startTransition] = useTransition();
  const [pendingFilterKeys, setPendingFilterKeysState] = useState<FilterKey[]>(
    pendingFilterKeysStore,
  );
  const [isNavigating, setIsNavigating] = useState(pendingNavigationStore);

  const filters: Filters = useMemo(
    () => filtersFromParamsClient(searchParams),
    [searchParams],
  );

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
    const listener: PendingNavigationListener = (isPending) => {
      setIsNavigating(isPending);
    };

    pendingNavigationListeners.add(listener);
    return () => {
      pendingNavigationListeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (pendingSearchStore === null) {
      return;
    }

    if (currentSearch === pendingSearchStore) {
      clearPendingNavigation();
    }
  }, [currentSearch]);

  const setFilters = useCallback(
    (updates: Partial<Filters>) => {
      const current = new URLSearchParams(searchParams.toString());
      const updateKeys = Object.keys(updates) as FilterKey[];

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '' || value === null) {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      const isPageOnly = Object.keys(updates).length === 1 && 'page' in updates;
      if (!isPageOnly) {
        current.delete('page');
      }

      const nextSearch = normalizeSearch(current.toString());

      if (nextSearch === currentSearch) {
        clearPendingNavigation();
        return;
      }

      pendingSearchStore = nextSearch;
      setPendingFilterKeys(updateKeys);
      setPendingNavigation(true);
      startTransition(() => {
        router.push(`${pathname}?${nextSearch}`);
      });
    },
    [router, pathname, searchParams, currentSearch, startTransition],
  );

  const setFilter = useCallback(
    (key: keyof Filters, value: string | number | undefined) => {
      setFilters({ [key]: value });
    },
    [setFilters],
  );

  return {
    filters,
    setFilter,
    setFilters,
    pendingFilterKeys,
    isNavigating,
  };
}
