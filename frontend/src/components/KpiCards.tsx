"use client";

import { useEffect, useState } from "react";
import { useFilters } from "@/lib/useFilters";
import { fetchAllSummaries } from "@/lib/api";
import type { SummaryResponse } from "@/lib/types";
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

const METRIC_ORDER: Array<typeof KPI_CONFIG[number]["metric"]> = [
  "nmv",
  "units_sold",
  "avg_price",
  "unique_shops",
  "unique_products",
];

export default function KpiCards() {
  const { filters } = useFilters();
  const [data, setData] = useState<SummaryResponse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchAllSummaries(filters)
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [filters.platform, filters.region, filters.from, filters.to]);

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
        return (
          <KpiCard
            key={metric}
            label={config.label}
            value={value}
            icon={config.icon}
            description={config.description}
          />
        );
      })}
    </>
  );
}
