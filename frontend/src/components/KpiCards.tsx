"use client";

import { useEffect, useMemo, useState } from "react";
import { useFilters } from "@/lib/useFilters";
import { fetchSummaryMetric } from "@/lib/api";
import { fetchPlatforms } from "@/lib/api/filters";
import type {
  SummaryBreakdownItem,
  SummaryGroupBy,
  SummaryMetric,
  SummaryResponse,
} from "@/lib/types";
import KpiCard from "./KpiCard";

const KPI_CONFIG = [
  {
    metric: "nmv" as const,
    label: "Total NMV",
    format: (v: number) =>
      v >= 1_000_000
        ? `$${(v / 1_000_000).toFixed(1)}M`
        : v >= 1_000
          ? `$${(v / 1_000).toFixed(1)}K`
          : `$${v.toFixed(0)}`,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    description: "Net merchandise value",
  },
  {
    metric: "units_sold" as const,
    label: "Units Sold",
    format: (v: number) =>
      v >= 1_000_000
        ? `${(v / 1_000_000).toFixed(1)}M`
        : v >= 1_000
          ? `${(v / 1_000).toFixed(1)}K`
          : `${v.toLocaleString()}`,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
    description: "Total units across orders",
  },
  {
    metric: "avg_price" as const,
    label: "Avg Price / Unit",
    format: (v: number) => `$${v.toFixed(2)}`,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    description: "Average selling price",
  },
  {
    metric: "unique_shops" as const,
    label: "Active Shops",
    format: (v: number) => v.toLocaleString(),
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    description: "Distinct shop count",
  },
  {
    metric: "unique_products" as const,
    label: "Unique Products",
    format: (v: number) => v.toLocaleString(),
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ),
    description: "Distinct product SKUs",
  },
];

const METRIC_ORDER: Array<(typeof KPI_CONFIG)[number]["metric"]> = [
  "nmv",
  "units_sold",
  "unique_shops",
  "unique_products",
  "avg_price",
];

const SELECTABLE_GROUP_BY_OPTIONS: SummaryGroupBy[] = ["platform", "region"];
const CHART_METRICS: SummaryMetric[] = ["nmv", "units_sold", "unique_shops", "unique_products"];
const AVG_PRICE_SELECTOR_ALL = "__all_platforms__";

interface SummaryState {
  requestKey: string;
  data: SummaryResponse[] | null;
  error: string | null;
}

type ChartGroupByState = Record<SummaryMetric, SummaryGroupBy>;

function buildChartData(items?: SummaryBreakdownItem[]) {
  if (!items?.length) {
    return undefined;
  }

  const rankedItems = items.filter((item) => item.value > 0);
  const topItems = rankedItems.slice(0, 4).map((item) => ({
    label: item.group || "Unknown",
    value: item.value,
  }));
  const otherValue = rankedItems
    .slice(4)
    .reduce((sum, item) => sum + item.value, 0);

  if (otherValue > 0) {
    topItems.push({ label: "Others", value: otherValue });
  }

  return topItems.length ? topItems : undefined;
}

export default function KpiCards() {
  const { filters } = useFilters();
  const [chartGroupBy, setChartGroupBy] = useState<ChartGroupByState>({
    nmv: "platform",
    units_sold: "platform",
    avg_price: "platform",
    unique_products: "platform",
    unique_shops: "platform",
  });
  const [platformOptions, setPlatformOptions] = useState<string[]>([]);
  const [avgPricePlatform, setAvgPricePlatform] = useState<string>(AVG_PRICE_SELECTOR_ALL);

  useEffect(() => {
    let cancelled = false;

    fetchPlatforms()
      .then((platforms) => {
        if (!cancelled) {
          setPlatformOptions(platforms);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPlatformOptions([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const requestKey = JSON.stringify({ filters, chartGroupBy, avgPricePlatform });
  const [state, setState] = useState<SummaryState>({
    requestKey,
    data: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      METRIC_ORDER.map((metric) => {
        if (metric === "avg_price") {
          return fetchSummaryMetric(metric, {
            ...filters,
            platform:
              avgPricePlatform === AVG_PRICE_SELECTOR_ALL
                ? filters.platform
                : avgPricePlatform,
          });
        }

        return CHART_METRICS.includes(metric)
          ? fetchSummaryMetric(metric, filters, chartGroupBy[metric])
          : fetchSummaryMetric(metric, filters);
      })
    )
      .then((data) => {
        if (!cancelled) {
          setState({
            requestKey,
            data,
            error: null,
          });
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setState({
            requestKey,
            data: null,
            error: e instanceof Error ? e.message : "Failed to load",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [avgPricePlatform, chartGroupBy, filters, requestKey]);

  const avgPriceSelectorOptions = useMemo(
    () => [
      { label: "All Platforms", value: AVG_PRICE_SELECTOR_ALL },
      ...platformOptions.map((platform) => ({
        label: platform,
        value: platform,
      })),
    ],
    [platformOptions]
  );

  const isCurrentRequest = state.requestKey === requestKey;
  const data = isCurrentRequest ? state.data : null;
  const error = isCurrentRequest ? state.error : null;
  const loading = !isCurrentRequest || (!data && !error);

  if (error) {
    return (
      <div className="col-span-full flex items-center gap-2 p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-200">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {error}
      </div>
    );
  }

  return (
    <>
      {METRIC_ORDER.map((metric) => {
        const config = KPI_CONFIG.find((c) => c.metric === metric)!;
        const summary = data?.find((d) => d.metric === metric);
        const value = loading ? "—" : summary ? config.format(summary.total) : "—";
        const chartData = loading ? undefined : buildChartData(summary?.breakdown?.items);
        const hasSelectableChart = CHART_METRICS.includes(metric);
        const isAvgPriceCard = metric === "avg_price";

        return (
          <KpiCard
            key={metric}
            label={config.label}
            value={value}
            icon={config.icon}
            description={config.description}
            breakdownLabel={summary?.breakdown?.group_by}
            chartData={chartData}
            groupBy={hasSelectableChart ? chartGroupBy[metric] : undefined}
            groupByOptions={hasSelectableChart ? SELECTABLE_GROUP_BY_OPTIONS : undefined}
            onGroupByChange={hasSelectableChart ? (groupBy) => {
              setChartGroupBy((current) => ({
                ...current,
                [metric]: groupBy,
              }));
            } : undefined}
            selectorValue={isAvgPriceCard ? avgPricePlatform : undefined}
            selectorOptions={isAvgPriceCard ? avgPriceSelectorOptions : undefined}
            selectorAriaLabel={isAvgPriceCard ? "Filter Avg Price by platform" : undefined}
            onSelectorChange={isAvgPriceCard ? setAvgPricePlatform : undefined}
          />
        );
      })}
    </>
  );
}
