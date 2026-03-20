import { Suspense } from 'react';
import FilterBarSkeleton from '@/components/FilterBarSkeleton';
import KpiCards from '@/components/KpiCards';
import TopChartsFilterBarPanel from '@/components/TopChartsFilterBarPanel';
import TopChartsPanel from '@/components/TopChartsPanel';
import { fetchTopProducts, fetchTopShops } from '@/lib/api';
import {
  fetchL1Categories,
  fetchPlatforms,
  fetchRegions,
} from '@/lib/api/filters';
import { filtersFromParams } from '@/lib/utils';

const TOP_PARAM_KEYS = [
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

function KpiSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-slate-100" />
              <div className="h-3 w-28 rounded bg-slate-100" />
            </div>
            <div className="h-9 w-9 rounded-xl bg-slate-100" />
          </div>
          <div className="mt-5 h-8 w-28 rounded bg-slate-100" />
          <div className="mt-5 h-28 rounded-2xl bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

function pickParams(
  params: Record<string, string | undefined>,
  predicate: (key: string) => boolean,
) {
  return Object.fromEntries(
    Object.entries(params).filter(([key]) => predicate(key)),
  ) as Record<string, string | undefined>;
}

async function TopChartsFilterBarContent() {
  const [platforms, regions, l1Categories] = await Promise.all([
    fetchPlatforms(),
    fetchRegions(),
    fetchL1Categories(),
  ]);

  return (
    <TopChartsFilterBarPanel
      platforms={platforms}
      regions={regions}
      l1Categories={l1Categories}
    />
  );
}

async function TopChartsContent({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  const filters = filtersFromParams(params, 'top_');
  const [topProducts, topShops] = await Promise.all([
    fetchTopProducts(filters, 'nmv'),
    fetchTopShops(filters, 'nmv'),
  ]);

  return (
    <TopChartsPanel
      topProducts={topProducts.products}
      topShops={topShops.shops}
    />
  );
}

function PageContent({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  const kpiParams = pickParams(
    params,
    (key) => !TOP_PARAM_KEYS.includes(key as (typeof TOP_PARAM_KEYS)[number]),
  );
  const topParams = pickParams(params, (key) =>
    TOP_PARAM_KEYS.includes(key as (typeof TOP_PARAM_KEYS)[number]),
  );
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Summary of key sales metrics
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section>
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              KPI Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Four KPI cards now support region/platform pie breakdowns.
            </p>
          </div>
          <Suspense fallback={<KpiSkeleton />}>
            <KpiCards params={kpiParams} />
          </Suspense>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              Top Charts
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Top 10 products and shops for the current dashboard filters.
            </p>
          </div>

          <div className="space-y-4">
            <Suspense fallback={<FilterBarSkeleton />}>
              <TopChartsFilterBarContent />
            </Suspense>

            <TopChartsContent params={topParams} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  return (
    <Suspense>
      <PageContent params={params} />
    </Suspense>
  );
}
