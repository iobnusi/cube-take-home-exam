'use client';

import { useMemo, useState } from 'react';
import { useFilters } from '@/lib/useFilters';
import type { TrendGroupBy, TrendDataPoint, TrendResponse } from '@/lib/types';
import TrendChartCard from './TrendChartCard';

const GROUP_BY_OPTIONS: { value: TrendGroupBy; label: string }[] = [
  { value: 'platform', label: 'Platform' },
  { value: 'region', label: 'Region' },
  { value: 'none', label: 'None' },
];

function formatCurrency(v: number) {
  if (v >= 1_000_000_000) return `฿${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `฿${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `฿${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

function formatNumber(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return `${v.toFixed(0)}`;
}

function formatPeriod(period: string) {
  const date = new Date(period);
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

type MetricKey = keyof Omit<TrendDataPoint, 'period' | 'group'>;

interface ChartConfig {
  metric: MetricKey;
  title: string;
  format: (v: number) => string;
}

const CHART_CONFIGS: ChartConfig[] = [
  { metric: 'nmv', title: 'Monthly NMV', format: formatCurrency },
  { metric: 'units_sold', title: 'Units Sold', format: formatNumber },
  {
    metric: 'avg_price_per_unit',
    title: 'Avg Price / Unit',
    format: formatCurrency,
  },
  { metric: 'nmv_per_shop', title: 'NMV per Shop', format: formatCurrency },
  { metric: 'active_products', title: 'Active Products', format: formatNumber },
  { metric: 'active_shops', title: 'Active Shops', format: formatNumber },
];

function buildChartData(
  trendData: TrendResponse,
  metric: MetricKey,
): { chartData: Record<string, string | number>[]; groups: string[] } {
  const allGroups = Object.keys(trendData.data);
  const periodSet = new Set<string>();
  allGroups.forEach((g) => {
    trendData.data[g]?.forEach((d) => periodSet.add(d.period));
  });

  const sortedPeriods = Array.from(periodSet).sort();
  const chartData = sortedPeriods.map((period) => {
    const row: Record<string, string | number> = {
      period: formatPeriod(period),
    };
    allGroups.forEach((g) => {
      const point = trendData.data[g]?.find((d) => d.period === period);
      row[g] = point ? Number(point[metric]) : 0;
    });
    return row;
  });

  return { chartData, groups: allGroups };
}

export default function TrendChart({ data }: { data: TrendResponse }) {
  const { filters, setFilter } = useFilters();
  const [groupByState, setGroupByState] = useState<TrendGroupBy>(
    filters.groupBy ?? 'none',
  );

  const chartsByMetric = useMemo(() => {
    if (!data) return null;
    return CHART_CONFIGS.map((config) => ({
      ...config,
      ...buildChartData(data, config.metric),
    }));
  }, [data]);

  return (
    <div>
      {/* Header with group-by toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          {groupByState === 'none'
            ? 'Aggregated by all data'
            : `Grouped by ${groupByState}`}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Group by</span>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {GROUP_BY_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => {
                  setGroupByState(value);
                  setFilter('groupBy', value === 'none' ? undefined : value);
                }}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  groupByState === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts grid */}
      {chartsByMetric && (
        <div className="grid grid-cols-3 gap-4">
          {chartsByMetric.map((config) => (
            <TrendChartCard
              key={config.metric}
              title={config.title}
              subtitle={
                groupByState === 'none'
                  ? 'All data'
                  : `Grouped by ${groupByState}`
              }
              chartData={config.chartData}
              groups={config.groups}
              formatValue={config.format}
            />
          ))}
        </div>
      )}
    </div>
  );
}
