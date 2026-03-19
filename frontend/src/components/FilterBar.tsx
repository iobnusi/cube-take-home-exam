'use client';

import { useEffect, useState } from 'react';
import { useFilters } from '@/lib/useFilters';
import type { IsMall } from '@/lib/types';
import {
  fetchL2Categories,
  fetchL3Categories,
  fetchL4Categories,
} from '@/lib/api/filters';
import { MALL_STATUS, ORIGINS } from '@/lib/constants';

const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;

const SELECT_CLASS =
  'h-8 pl-3 pr-8 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer hover:border-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

const INPUT_CLASS =
  'h-8 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-colors';

const CHEVRON_STYLE = {
  backgroundImage: CHEVRON_SVG,
  backgroundRepeat: 'no-repeat' as const,
  backgroundPosition: 'right 8px center',
};

export default function FilterBar({
  platforms,
  regions,
  l1Categories,
}: {
  platforms: string[];
  regions: string[];
  l1Categories: string[];
}) {
  const { filters, setFilter, setFilters } = useFilters();

  const [l2Options, setL2Options] = useState<string[]>([]);
  const [l3Options, setL3Options] = useState<string[]>([]);
  const [l4Options, setL4Options] = useState<string[]>([]);

  // Fetch L2 when L1 changes
  useEffect(() => {
    if (!filters.l1_category) {
      setL2Options([]);
      return;
    }
    const controller = new AbortController();
    fetchL2Categories(filters.l1_category)
      .then((opts) => {
        if (!controller.signal.aborted) setL2Options(opts);
      })
      .catch(() => {
        if (!controller.signal.aborted) setL2Options([]);
      });
    return () => controller.abort();
  }, [filters.l1_category]);

  // Fetch L3 when L1 or L2 changes
  useEffect(() => {
    if (!filters.l1_category || !filters.l2_category) {
      setL3Options([]);
      return;
    }
    const controller = new AbortController();
    fetchL3Categories(filters.l1_category, filters.l2_category)
      .then((opts) => {
        if (!controller.signal.aborted) setL3Options(opts);
      })
      .catch(() => {
        if (!controller.signal.aborted) setL3Options([]);
      });
    return () => controller.abort();
  }, [filters.l1_category, filters.l2_category]);

  // Fetch L4 when L1, L2, or L3 changes
  useEffect(() => {
    if (!filters.l1_category || !filters.l2_category || !filters.l3_category) {
      setL4Options([]);
      return;
    }
    const controller = new AbortController();
    fetchL4Categories(
      filters.l1_category,
      filters.l2_category,
      filters.l3_category,
    )
      .then((opts) => {
        if (!controller.signal.aborted) setL4Options(opts);
      })
      .catch(() => {
        if (!controller.signal.aborted) setL4Options([]);
      });
    return () => controller.abort();
  }, [filters.l1_category, filters.l2_category, filters.l3_category]);

  const handleClear = () => {
    setFilters({
      platform: undefined,
      region: undefined,
      from: undefined,
      to: undefined,
      l1_category: undefined,
      l2_category: undefined,
      l3_category: undefined,
      l4_category: undefined,
      origin: undefined,
      is_mall: undefined,
    });
  };

  const hasFilters = !!(
    filters.platform ||
    filters.region ||
    filters.from ||
    filters.to ||
    filters.l1_category ||
    filters.l2_category ||
    filters.l3_category ||
    filters.l4_category ||
    filters.origin ||
    filters.is_mall
  );

  const handleL1Change = (value: string) => {
    setFilters({
      l1_category: value || undefined,
      l2_category: undefined,
      l3_category: undefined,
      l4_category: undefined,
    });
  };

  const handleL2Change = (value: string) => {
    setFilters({
      l2_category: value || undefined,
      l3_category: undefined,
      l4_category: undefined,
    });
  };

  const handleL3Change = (value: string) => {
    setFilters({
      l3_category: value || undefined,
      l4_category: undefined,
    });
  };

  return (
    <div className="px-6 py-3 bg-white border-b border-slate-200 space-y-2">
      {/* Row 1: Header and clear all button */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 mr-1">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Filters
          </span>
        </div>

        {hasFilters && (
          <button
            onClick={handleClear}
            className="h-8 px-3 text-sm text-slate-500 hover:text-slate-700 border border-dashed border-slate-300 rounded-lg hover:border-slate-400 transition-colors flex items-center gap-1.5"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear all
          </button>
        )}
      </div>
      {/* Row 2: platform, region, origin, mall status */}
      <div className="ml-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-bold w-18">
          Dimensions
        </span>
        <select
          value={filters.platform ?? ''}
          onChange={(e) => setFilter('platform', e.target.value || undefined)}
          className={SELECT_CLASS}
          style={CHEVRON_STYLE}
        >
          <option value="">All Platforms</option>
          {platforms.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={filters.region ?? ''}
          onChange={(e) => setFilter('region', e.target.value || undefined)}
          className={SELECT_CLASS}
          style={CHEVRON_STYLE}
        >
          <option value="">All Regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={filters.origin ?? ''}
          onChange={(e) => setFilter('origin', e.target.value || undefined)}
          className={SELECT_CLASS}
          style={CHEVRON_STYLE}
        >
          <option value="">All Origins</option>
          {ORIGINS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>

        <select
          value={filters.is_mall ?? ''}
          onChange={(e) =>
            setFilter('is_mall', (e.target.value as IsMall) || undefined)
          }
          className={SELECT_CLASS}
          style={CHEVRON_STYLE}
        >
          <option value="">All Mall Status</option>
          {MALL_STATUS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {/* Row 3: date range */}
      <div className="ml-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-bold w-18">
          Date Range
        </span>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400">From</span>
          <input
            type="date"
            value={filters.from ?? ''}
            onChange={(e) => setFilter('from', e.target.value || undefined)}
            className={INPUT_CLASS}
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400">To</span>
          <input
            type="date"
            value={filters.to ?? ''}
            onChange={(e) => setFilter('to', e.target.value || undefined)}
            className={INPUT_CLASS}
          />
        </div>
      </div>

      {/* Row 4: cascading category dropdowns */}
      <div className="ml-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-bold w-18 mr-1">
          Category
        </span>

        <select
          value={filters.l1_category ?? ''}
          onChange={(e) => handleL1Change(e.target.value)}
          className={SELECT_CLASS}
          style={CHEVRON_STYLE}
        >
          <option value="">All L1</option>
          {l1Categories.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>

        <select
          value={filters.l2_category ?? ''}
          onChange={(e) => handleL2Change(e.target.value)}
          disabled={!filters.l1_category}
          className={SELECT_CLASS}
          style={CHEVRON_STYLE}
        >
          <option value="">All L2</option>
          {l2Options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>

        <select
          value={filters.l3_category ?? ''}
          onChange={(e) => handleL3Change(e.target.value)}
          disabled={!filters.l2_category}
          className={SELECT_CLASS}
          style={CHEVRON_STYLE}
        >
          <option value="">All L3</option>
          {l3Options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>

        <select
          value={filters.l4_category ?? ''}
          onChange={(e) =>
            setFilter('l4_category', e.target.value || undefined)
          }
          disabled={!filters.l3_category}
          className={SELECT_CLASS}
          style={CHEVRON_STYLE}
        >
          <option value="">All L4</option>
          {l4Options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
