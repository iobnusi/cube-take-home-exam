'use client';

import { useEffect, useMemo, useState } from 'react';
import { useFilters } from '@/lib/useFilters';
import type { Filters, IsMall } from '@/lib/types';
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

const SCOPED_FILTER_KEYS = [
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
] as const;

export default function FilterBar({
  platforms,
  regions,
  l1Categories,
  disable,
  scope = 'default',
}: {
  platforms?: string[];
  regions?: string[];
  l1Categories?: string[];
  disable?: {
    platform?: boolean;
    region?: boolean;
    origin?: boolean;
    is_mall?: boolean;
    category?: boolean;
    dateRange?: boolean;
  };
  scope?: 'default' | 'top';
}) {
  const { filters, setFilters } = useFilters();

  const scopedFilters = useMemo(
    () =>
      scope === 'top'
        ? {
            platform: filters.top_platform,
            region: filters.top_region,
            from: filters.top_from,
            to: filters.top_to,
            l1_category: filters.top_l1_category,
            l2_category: filters.top_l2_category,
            l3_category: filters.top_l3_category,
            l4_category: filters.top_l4_category,
            origin: filters.top_origin,
            is_mall: filters.top_is_mall,
          }
        : {
            platform: filters.platform,
            region: filters.region,
            from: filters.from,
            to: filters.to,
            l1_category: filters.l1_category,
            l2_category: filters.l2_category,
            l3_category: filters.l3_category,
            l4_category: filters.l4_category,
            origin: filters.origin,
            is_mall: filters.is_mall,
          },
    [filters, scope],
  );

  // set a temp state for filters
  const [tempFilters, setTempFilters] = useState<Filters>(scopedFilters);

  useEffect(() => {
    setTempFilters(scopedFilters);
  }, [scopedFilters]);

  const [l2Options, setL2Options] = useState<string[]>([]);
  const [l3Options, setL3Options] = useState<string[]>([]);
  const [l4Options, setL4Options] = useState<string[]>([]);

  // Fetch L2 when L1 changes
  useEffect(() => {
    if (!tempFilters.l1_category) {
      setL2Options([]);
      return;
    }
    const controller = new AbortController();
    fetchL2Categories(tempFilters.l1_category)
      .then((opts) => {
        if (!controller.signal.aborted) setL2Options(opts);
      })
      .catch(() => {
        if (!controller.signal.aborted) setL2Options([]);
      });
    return () => controller.abort();
  }, [tempFilters.l1_category]);

  // Fetch L3 when L1 or L2 changes
  useEffect(() => {
    if (!tempFilters.l1_category || !tempFilters.l2_category) {
      setL3Options([]);
      return;
    }
    const controller = new AbortController();
    fetchL3Categories(tempFilters.l1_category, tempFilters.l2_category)
      .then((opts) => {
        if (!controller.signal.aborted) setL3Options(opts);
      })
      .catch(() => {
        if (!controller.signal.aborted) setL3Options([]);
      });
    return () => controller.abort();
  }, [tempFilters.l1_category, tempFilters.l2_category]);

  // Fetch L4 when L1, L2, or L3 changes
  useEffect(() => {
    if (
      !tempFilters.l1_category ||
      !tempFilters.l2_category ||
      !tempFilters.l3_category
    ) {
      setL4Options([]);
      return;
    }
    const controller = new AbortController();
    fetchL4Categories(
      tempFilters.l1_category,
      tempFilters.l2_category,
      tempFilters.l3_category,
    )
      .then((opts) => {
        if (!controller.signal.aborted) setL4Options(opts);
      })
      .catch(() => {
        if (!controller.signal.aborted) setL4Options([]);
      });
    return () => controller.abort();
  }, [
    tempFilters.l1_category,
    tempFilters.l2_category,
    tempFilters.l3_category,
  ]);

  const handleSubmit = () => {
    setFilters(
      scope === 'top'
        ? {
            top_platform: tempFilters.platform,
            top_region: tempFilters.region,
            top_from: tempFilters.from,
            top_to: tempFilters.to,
            top_l1_category: tempFilters.l1_category,
            top_l2_category: tempFilters.l2_category,
            top_l3_category: tempFilters.l3_category,
            top_l4_category: tempFilters.l4_category,
            top_origin: tempFilters.origin,
            top_is_mall: tempFilters.is_mall,
          }
        : {
            platform: tempFilters.platform,
            region: tempFilters.region,
            from: tempFilters.from,
            to: tempFilters.to,
            l1_category: tempFilters.l1_category,
            l2_category: tempFilters.l2_category,
            l3_category: tempFilters.l3_category,
            l4_category: tempFilters.l4_category,
            origin: tempFilters.origin,
            is_mall: tempFilters.is_mall,
          },
    );
  };

  const handleClear = () => {
    const clearFilters = {
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
    };
    setFilters(
      scope === 'top'
        ? {
            top_platform: undefined,
            top_region: undefined,
            top_from: undefined,
            top_to: undefined,
            top_l1_category: undefined,
            top_l2_category: undefined,
            top_l3_category: undefined,
            top_l4_category: undefined,
            top_origin: undefined,
            top_is_mall: undefined,
          }
        : {
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
          },
    );
    setTempFilters(clearFilters);
  };

  const hasFilters = useMemo(
    () =>
      !!(
        tempFilters.platform ||
        tempFilters.region ||
        tempFilters.from ||
        tempFilters.to ||
        tempFilters.l1_category ||
        tempFilters.l2_category ||
        tempFilters.l3_category ||
        tempFilters.l4_category ||
        tempFilters.origin ||
        tempFilters.is_mall
      ),
    [tempFilters],
  );

  const hasDirtyFilters = useMemo(
    () =>
      SCOPED_FILTER_KEYS.some(
        (key) => tempFilters[key] !== scopedFilters[key],
      ),
    [tempFilters, scopedFilters],
  );

  const handleSelectL1Category = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedFilters = {
      ...tempFilters,
      l1_category: e.target.value || undefined,
    };

    if (!e.target.value) {
      updatedFilters.l2_category = undefined;
      updatedFilters.l3_category = undefined;
      updatedFilters.l4_category = undefined;
    }

    setTempFilters(updatedFilters);
  };

  const handleSelectL2Category = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedFilters = {
      ...tempFilters,
      l2_category: e.target.value || undefined,
    };

    if (!e.target.value) {
      updatedFilters.l3_category = undefined;
      updatedFilters.l4_category = undefined;
    }

    setTempFilters(updatedFilters);
  };

  const handleSelectL3Category = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedFilters = {
      ...tempFilters,
      l3_category: e.target.value || undefined,
    };

    if (!e.target.value) {
      updatedFilters.l4_category = undefined;
    }

    setTempFilters(updatedFilters);
  };

  // const handleSelectL2Category = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        {hasDirtyFilters && (
          <button
            onClick={handleSubmit}
            className="h-8 px-3 text-sm text-white bg-blue-500 hover:bg-blue-600 border border-dashed border-slate-300 rounded-lg hover:border-slate-400 transition-colors flex items-center gap-1.5"
          >
            Submit
          </button>
        )}
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
        {!disable?.platform && platforms && (
          <select
            value={tempFilters.platform ?? ''}
            onChange={(e) =>
              setTempFilters({
                ...tempFilters,
                platform: e.target.value || undefined,
              })
            }
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
        )}
        {!disable?.region && regions && (
          <select
            value={tempFilters.region ?? ''}
            onChange={(e) =>
              setTempFilters({
                ...tempFilters,
                region: e.target.value || undefined,
              })
            }
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
        )}
        {!disable?.origin && (
          <select
            value={tempFilters.origin ?? ''}
            onChange={(e) =>
              setTempFilters({
                ...tempFilters,
                origin: e.target.value || undefined,
              })
            }
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
        )}
        {!disable?.is_mall && (
          <select
            value={tempFilters.is_mall ?? ''}
            onChange={(e) =>
              setTempFilters({
                ...tempFilters,
                is_mall: (e.target.value as IsMall) || undefined,
              })
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
        )}
      </div>
      {/* Row 3: date range */}
      {!disable?.dateRange && (
        <div className="ml-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-bold w-18">
            Date Range
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400">From</span>
            <input
              type="date"
              value={tempFilters.from ?? ''}
              onChange={(e) =>
                setTempFilters({
                  ...tempFilters,
                  from: e.target.value || undefined,
                })
              }
              className={INPUT_CLASS}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400">To</span>
            <input
              type="date"
              value={tempFilters.to ?? ''}
              onChange={(e) =>
                setTempFilters({
                  ...tempFilters,
                  to: e.target.value || undefined,
                })
              }
              className={INPUT_CLASS}
            />
          </div>
        </div>
      )}

      {/* Row 4: cascading category dropdowns */}
      {!disable?.category && l1Categories && (
        <div className="ml-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-bold w-18 mr-1">
            Category
          </span>

          <select
            value={tempFilters.l1_category ?? ''}
            onChange={handleSelectL1Category}
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
            value={tempFilters.l2_category ?? ''}
            onChange={handleSelectL2Category}
            disabled={!tempFilters.l1_category}
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
            value={tempFilters.l3_category ?? ''}
            onChange={handleSelectL3Category}
            disabled={!tempFilters.l2_category}
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
            value={tempFilters.l4_category ?? ''}
            onChange={(e) =>
              setTempFilters({
                ...tempFilters,
                l4_category: e.target.value || undefined,
              })
            }
            disabled={!tempFilters.l3_category}
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
      )}
    </div>
  );
}
