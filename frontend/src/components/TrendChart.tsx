"use client";

import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useFilters } from "@/lib/useFilters";
import { fetchTrends } from "@/lib/api";
import type { TrendGroupBy, TrendResponse } from "@/lib/types";

const GROUP_BY_OPTIONS: { value: TrendGroupBy; label: string }[] = [
  { value: "platform", label: "Platform" },
  { value: "region", label: "Region" },
];

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#84cc16",
];

function formatNmv(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

function formatPeriod(period: string) {
  const date = new Date(period);
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export default function TrendChart() {
  const { filters, setFilter } = useFilters();
  const groupBy = (filters.groupBy as TrendGroupBy) ?? "platform";

  const [trendData, setTrendData] = useState<TrendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchTrends(filters, groupBy)
      .then(setTrendData)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  }, [filters.platform, filters.region, groupBy]);

  const { chartData, groups } = useMemo(() => {
    if (!trendData) return { chartData: [], groups: [] };

    const allGroups = Object.keys(trendData.data);
    const periodSet = new Set<string>();
    allGroups.forEach((g) => {
      trendData.data[g].forEach((d) => periodSet.add(d.period));
    });

    const sortedPeriods = Array.from(periodSet).sort();
    const rows = sortedPeriods.map((period) => {
      const row: Record<string, string | number> = { period: formatPeriod(period) };
      allGroups.forEach((g) => {
        const point = trendData.data[g].find((d) => d.period === period);
        row[g] = point?.nmv ?? 0;
      });
      return row;
    });

    return { chartData: rows, groups: allGroups };
  }, [trendData]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Monthly NMV</h2>
          <p className="text-xs text-slate-500 mt-0.5">Grouped by {groupBy}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Group by</span>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {GROUP_BY_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter("groupBy", value)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  groupBy === value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.25"/>
                <path d="M21 12a9 9 0 00-9-9"/>
              </svg>
              Loading chart data...
            </div>
          </div>
        ) : error ? (
          <div className="h-64 flex items-center justify-center text-sm text-red-500">{error}</div>
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm text-slate-400">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatNmv}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip
                formatter={(value) => [formatNmv(Number(value)), ""]}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "12px",
                  color: "#f8fafc",
                }}
                labelStyle={{ color: "#94a3b8", marginBottom: "4px" }}
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "12px", color: "#64748b", paddingTop: "12px" }}
              />
              {groups.map((group, i) => (
                <Bar
                  key={group}
                  dataKey={group}
                  fill={COLORS[i % COLORS.length]}
                  radius={[3, 3, 0, 0]}
                  maxBarSize={32}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
