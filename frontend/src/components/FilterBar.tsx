"use client";

import { useFilters } from "@/lib/useFilters";

const PLATFORMS = ["Shopee", "Lazada", "Tokopedia", "TikTok"];
const REGIONS = ["PH", "VN", "ID", "TH", "MY", "SG"];

export default function FilterBar() {
  const { filters, setFilter, setFilters } = useFilters();

  const handleClear = () => {
    setFilters({ platform: undefined, region: undefined, from: undefined, to: undefined });
  };

  const hasFilters = !!(filters.platform || filters.region || filters.from || filters.to);

  return (
    <div className="flex flex-wrap items-center gap-3 px-6 py-4 bg-white border-b border-slate-200">
      <div className="flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Filters</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 flex-1">
        <select
          value={filters.platform ?? ""}
          onChange={(e) => setFilter("platform", e.target.value || undefined)}
          className="h-8 pl-3 pr-8 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer hover:border-slate-300 transition-colors"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 8px center",
          }}
        >
          <option value="">All Platforms</option>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          value={filters.region ?? ""}
          onChange={(e) => setFilter("region", e.target.value || undefined)}
          className="h-8 pl-3 pr-8 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer hover:border-slate-300 transition-colors"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 8px center",
          }}
        >
          <option value="">All Regions</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400">From</span>
          <input
            type="date"
            value={filters.from ?? ""}
            onChange={(e) => setFilter("from", e.target.value || undefined)}
            className="h-8 px-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400">To</span>
          <input
            type="date"
            value={filters.to ?? ""}
            onChange={(e) => setFilter("to", e.target.value || undefined)}
            className="h-8 px-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-colors"
          />
        </div>

        {hasFilters && (
          <button
            onClick={handleClear}
            className="h-8 px-3 text-sm text-slate-500 hover:text-slate-700 border border-dashed border-slate-300 rounded-lg hover:border-slate-400 transition-colors flex items-center gap-1.5"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
