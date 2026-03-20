import { Suspense } from 'react';
import FilterBar from '@/components/FilterBar';
import FilterBarSkeleton from '@/components/FilterBarSkeleton';
import KpiCards from '@/components/KpiCards';
import TopBarChartCard from '@/components/TopBarChartCard';
import { fetchTopProducts, fetchTopShops } from '@/lib/api';
import {
  fetchL1Categories,
  fetchPlatforms,
  fetchRegions,
} from '@/lib/api/filters';
import { filtersFromParams } from '@/lib/utils';

const KPI_PARAM_KEYS = [
  'kpi_nmv_group_by',
  'kpi_units_sold_group_by',
  'kpi_unique_shops_group_by',
  'kpi_unique_products_group_by',
  'kpi_avg_price_platform',
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

function TopChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse"
        >
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-slate-100" />
            <div className="h-3 w-48 rounded bg-slate-100" />
          </div>
          <div className="mt-5 h-72 rounded-xl bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

function buildParamsKey(
  params: Record<string, string | undefined>,
  predicate: (key: string) => boolean,
) {
  return JSON.stringify(
    Object.fromEntries(
      Object.entries(params)
        .filter(([key, value]) => predicate(key) && value !== undefined)
        .sort(([left], [right]) => left.localeCompare(right)),
    ),
  );
}

async function TopChartsFilterBarContent() {
  const [platforms, regions, l1Categories] = await Promise.all([
    fetchPlatforms(),
    fetchRegions(),
    fetchL1Categories(),
  ]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <FilterBar
        platforms={platforms}
        regions={regions}
        l1Categories={l1Categories}
        disable={{
          dateRange: true,
        }}
      />
    </div>
  );
}

async function TopChartsContent({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  const filters = filtersFromParams(params);
  const [topProducts, topShops] = await Promise.all([
    fetchTopProducts(filters, 'nmv'),
    fetchTopShops(filters, 'nmv'),
  ]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <TopBarChartCard
        title="Top 10 Products"
        subtitle="Highest product IDs ranked by NMV for the current filter set."
        data={topProducts.products}
        valueFormat="currency"
      />
      <TopBarChartCard
        title="Top 10 Shops"
        subtitle="Highest shop IDs ranked by NMV for the current filter set."
        data={topShops.shops}
        valueFormat="currency"
      />
    </div>
  );
}

function PageContent({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  const topChartsKey = buildParamsKey(
    params,
    (key) => !KPI_PARAM_KEYS.includes(key as (typeof KPI_PARAM_KEYS)[number]),
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
            <KpiCards params={params} />
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

            <Suspense
              key={`top-charts-${topChartsKey}`}
              fallback={<TopChartsSkeleton />}
            >
              <TopChartsContent params={params} />
            </Suspense>
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
