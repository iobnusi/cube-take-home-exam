'use client';

import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import type { SummaryGroupBy } from '@/lib/types';

const PIE_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
];

interface KpiCardChartItem {
  label: string;
  value: number;
}

interface KpiCardSelectOption {
  label: string;
  value: string;
}

interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  breakdownLabel?: string;
  chartData?: KpiCardChartItem[];
  groupBy?: SummaryGroupBy;
  groupByOptions?: SummaryGroupBy[];
  onGroupByChange?: (groupBy: SummaryGroupBy) => void;
  selectorValue?: string;
  selectorOptions?: KpiCardSelectOption[];
  selectorAriaLabel?: string;
  onSelectorChange?: (value: string) => void;
}

export default function KpiCard({
  label,
  value,
  icon,
  description,
  breakdownLabel,
  chartData,
  groupBy,
  groupByOptions,
  onGroupByChange,
  selectorValue,
  selectorOptions,
  selectorAriaLabel,
  onSelectorChange,
}: KpiCardProps) {
  const hasChart = Boolean(chartData?.length);
  const total = chartData?.reduce((sum, item) => sum + item.value, 0) ?? 0;
  const hasGroupBySelector = Boolean(
    groupBy && groupByOptions?.length && onGroupByChange,
  );
  const hasCustomSelector = Boolean(
    selectorValue !== undefined && selectorOptions?.length && onSelectorChange,
  );

  const renderSelector = (className: string) => {
    if (hasGroupBySelector && groupBy && groupByOptions && onGroupByChange) {
      return (
        <label className={className}>
          <span className="sr-only">Group {label} by</span>
          <select
            value={groupBy}
            onChange={(event) =>
              onGroupByChange(event.target.value as SummaryGroupBy)
            }
            className="appearance-none rounded-full border border-slate-200 bg-slate-50 py-1 pl-3 pr-8 text-[11px] font-medium text-slate-600 outline-none transition-colors focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
          >
            {groupByOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'platform' ? 'Platform' : 'Region'}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              d="M6 8l4 4 4-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </label>
      );
    }

    if (
      hasCustomSelector &&
      selectorValue !== undefined &&
      selectorOptions &&
      onSelectorChange
    ) {
      return (
        <label className={className}>
          <span className="sr-only">{selectorAriaLabel ?? `Filter ${label}`}</span>
          <select
            value={selectorValue}
            onChange={(event) => onSelectorChange(event.target.value)}
            className="appearance-none rounded-full border border-slate-200 bg-slate-50 py-1 pl-3 pr-8 text-[11px] font-medium text-slate-600 outline-none transition-colors focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
          >
            {selectorOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              d="M6 8l4 4 4-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </label>
      );
    }

    return null;
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {label}
          </p>
          {description && (
            <p className="mt-1 text-xs text-slate-400">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {renderSelector('relative hidden sm:block')}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-colors duration-200 group-hover:bg-blue-50 group-hover:text-blue-500">
            {icon}
          </div>
        </div>
      </div>

      <div className="mt-5 min-w-0 flex-1">
        <p className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
          {value}
        </p>
        {hasChart && breakdownLabel && (
          <p className="mt-2 text-xs font-medium text-slate-500">
            Grouped by{' '}
            <span className="capitalize text-slate-700">{breakdownLabel}</span>
          </p>
        )}
        {renderSelector('relative mt-3 inline-block sm:hidden')}
      </div>

      {hasChart && chartData && (
        <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="h-24 w-24 shrink-0">
              <PieChart width={96} height={96}>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={24}
                  outerRadius={42}
                  paddingAngle={2}
                  stroke="none"
                  isAnimationActive
                  animationBegin={0}
                  animationDuration={450}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.label}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  isAnimationActive={false}
                  formatter={(pieValue, name) => [
                    Number(pieValue ?? 0).toLocaleString(),
                    String(name ?? ''),
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  labelStyle={{ display: 'none' }}
                />
              </PieChart>
            </div>

            <div className="grid w-full gap-2">
              {chartData.map((entry, index) => {
                const share =
                  total > 0 ? Math.round((entry.value / total) * 100) : 0;

                return (
                  <div
                    key={entry.label}
                    className="flex items-center justify-between gap-2 rounded-xl bg-white px-2.5 py-2 text-[11px]"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            PIE_COLORS[index % PIE_COLORS.length],
                        }}
                      />
                      <span className="truncate font-medium text-slate-600">
                        {entry.label}
                      </span>
                    </div>
                    <span className="shrink-0 font-semibold tabular-nums text-slate-800">
                      {share}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
