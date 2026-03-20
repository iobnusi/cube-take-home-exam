'use client';

import { useFilters } from '@/lib/useFilters';
import type { Filters } from '@/lib/types';
import FilterBar from './FilterBar';
import FilterBarSkeleton from './FilterBarSkeleton';

const TOP_FILTER_KEYS: Array<keyof Filters> = [
  'top_platform',
  'top_region',
  'top_from',
  'top_to',
  'top_l1_category',
  'top_l2_category',
  'top_l3_category',
  'top_l4_category',
  'top_origin',
  'top_is_mall',
] as const;

export default function TopChartsFilterBarPanel({
  platforms,
  regions,
  l1Categories,
}: {
  platforms: string[];
  regions: string[];
  l1Categories: string[];
}) {
  const { pendingFilterKeys, isNavigating } = useFilters();
  const isPending =
    isNavigating &&
    pendingFilterKeys.some((key) => TOP_FILTER_KEYS.includes(key));

  if (isPending) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <FilterBarSkeleton />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <FilterBar
        platforms={platforms}
        regions={regions}
        l1Categories={l1Categories}
        scope="top"
        disable={{
          dateRange: true,
        }}
      />
    </div>
  );
}
