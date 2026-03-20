'use client';

import { useMemo } from 'react';
import { useFilters, type Filters } from '@/lib/useFilters';
import type {
  SummaryBreakdownItem,
  SummaryGroupBy,
  SummaryMetric,
  SummaryResponse,
} from '@/lib/types';
import KpiCard from './KpiCard';
import KpiCardSkeleton from './KpiCardSkeleton';

type GroupByQueryKey =
  | 'kpi_nmv_group_by'
  | 'kpi_units_sold_group_by'
  | 'kpi_unique_shops_group_by'
  | 'kpi_unique_products_group_by';

export const AVG_PRICE_SELECTOR_ALL = '__all_platforms__';

const KPI_CONFIG = {
  nmv: {
    label: 'Total NMV',
    format: (value: number) =>
      value >= 1_000_000
        ? `$${(value / 1_000_000).toFixed(1)}M`
        : value >= 1_000
          ? `$${(value / 1_000).toFixed(1)}K`
          : `$${value.toFixed(0)}`,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    description: 'Net merchandise value',
  },
  units_sold: {
    label: 'Units Sold',
    format: (value: number) =>
      value >= 1_000_000
        ? `${(value / 1_000_000).toFixed(1)}M`
        : value >= 1_000
          ? `${(value / 1_000).toFixed(1)}K`
          : value.toLocaleString(),
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
    description: 'Total units across orders',
  },
  unique_shops: {
    label: 'Active Shops',
    format: (value: number) => value.toLocaleString(),
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    description: 'Distinct shop count',
  },
  unique_products: {
    label: 'Unique Products',
    format: (value: number) => value.toLocaleString(),
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ),
    description: 'Distinct product SKUs',
  },
  avg_price: {
    label: 'Avg Price / Unit',
    format: (value: number) => `$${value.toFixed(2)}`,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    description: 'Average selling price',
  },
} satisfies Record<
  SummaryMetric,
  {
    label: string;
    format: (value: number) => string;
    icon: React.ReactNode;
    description: string;
  }
>;

const SELECTABLE_GROUP_BY_OPTIONS: SummaryGroupBy[] = ['platform', 'region'];
const SHARED_KPI_FILTER_KEYS: Array<keyof Filters> = [
  'platform',
  'region',
  'from',
  'to',
  'l1_category',
  'l2_category',
  'l3_category',
  'l4_category',
  'origin',
  'is_mall',
];

function buildChartData(items?: SummaryBreakdownItem[]) {
  if (!items?.length) {
    return undefined;
  }

  const rankedItems = items.filter((item) => item.value > 0);
  const topItems = rankedItems.slice(0, 4).map((item) => ({
    label: item.group || 'Unknown',
    value: item.value,
  }));
  const otherValue = rankedItems
    .slice(4)
    .reduce((sum, item) => sum + item.value, 0);

  if (otherValue > 0) {
    topItems.push({ label: 'Others', value: otherValue });
  }

  return topItems.length ? topItems : undefined;
}

export default function KpiMetricCard({
  metric,
  summary,
  selectedGroupBy,
  groupByQueryKey,
  platforms,
  avgPricePlatform,
}: {
  metric: SummaryMetric;
  summary: SummaryResponse;
  selectedGroupBy?: SummaryGroupBy;
  groupByQueryKey?: GroupByQueryKey;
  platforms?: string[];
  avgPricePlatform?: string;
}) {
  const { setFilter, pendingFilterKeys, isNavigating } = useFilters();
  const config = KPI_CONFIG[metric];
  const chartData = buildChartData(summary.breakdown?.items);
  const isAvgPriceCard = metric === 'avg_price';

  const avgPriceSelectorOptions = useMemo(
    () => [
      { label: 'All Platforms', value: AVG_PRICE_SELECTOR_ALL },
      ...(platforms ?? []).map((platform) => ({
        label: platform,
        value: platform,
      })),
    ],
    [platforms],
  );

  const isPending =
    isNavigating &&
    pendingFilterKeys.some((key) => {
      if (SHARED_KPI_FILTER_KEYS.includes(key)) {
        return true;
      }

      if (groupByQueryKey && key === groupByQueryKey) {
        return true;
      }

      return isAvgPriceCard && key === 'kpi_avg_price_platform';
    });

  if (isPending) {
    return <KpiCardSkeleton hasChart={!isAvgPriceCard} />;
  }

  return (
    <KpiCard
      label={config.label}
      value={config.format(summary.total)}
      icon={config.icon}
      description={config.description}
      breakdownLabel={summary.breakdown?.group_by}
      chartData={chartData}
      groupBy={selectedGroupBy}
      groupByOptions={
        groupByQueryKey ? SELECTABLE_GROUP_BY_OPTIONS : undefined
      }
      onGroupByChange={
        groupByQueryKey
          ? (groupBy) => setFilter(groupByQueryKey, groupBy)
          : undefined
      }
      selectorValue={
        isAvgPriceCard ? avgPricePlatform ?? AVG_PRICE_SELECTOR_ALL : undefined
      }
      selectorOptions={isAvgPriceCard ? avgPriceSelectorOptions : undefined}
      selectorAriaLabel={
        isAvgPriceCard ? 'Filter Avg Price by platform' : undefined
      }
      onSelectorChange={
        isAvgPriceCard
          ? (value) =>
              setFilter(
                'kpi_avg_price_platform',
                value === AVG_PRICE_SELECTOR_ALL ? undefined : value,
              )
          : undefined
      }
    />
  );
}
