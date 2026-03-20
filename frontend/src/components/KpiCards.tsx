import { Suspense } from 'react';
import { fetchSummaryMetric } from '@/lib/api';
import { fetchPlatforms } from '@/lib/api/filters';
import type { SummaryGroupBy } from '@/lib/types';
import { filtersFromParams } from '@/lib/utils';
import KpiCardSkeleton from './KpiCardSkeleton';
import KpiMetricCard, { AVG_PRICE_SELECTOR_ALL } from './KpiMetricCard';

const KPI_PARAM_KEYS = [
  'kpi_nmv_group_by',
  'kpi_units_sold_group_by',
  'kpi_unique_shops_group_by',
  'kpi_unique_products_group_by',
  'kpi_avg_price_platform',
] as const;

function getKpiGroupBy(
  params: Record<string, string | undefined>,
  key: string,
): SummaryGroupBy {
  const value = params[key];
  return value === 'region' ? 'region' : 'platform';
}

function buildCardKey(
  params: Record<string, string | undefined>,
  activeKpiParam?: (typeof KPI_PARAM_KEYS)[number],
) {
  return JSON.stringify(
    Object.fromEntries(
      Object.entries(params)
        .filter(([key, value]) => {
          if (value === undefined) {
            return false;
          }

          if (
            !KPI_PARAM_KEYS.includes(key as (typeof KPI_PARAM_KEYS)[number])
          ) {
            return true;
          }

          return key === activeKpiParam;
        })
        .sort(([left], [right]) => left.localeCompare(right)),
    ),
  );
}

async function TotalNmvKpiCard({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  const filters = filtersFromParams(params);
  const selectedGroupBy = getKpiGroupBy(params, 'kpi_nmv_group_by');
  const summary = await fetchSummaryMetric('nmv', filters, selectedGroupBy);

  return (
    <KpiMetricCard
      metric="nmv"
      summary={summary}
      selectedGroupBy={selectedGroupBy}
      groupByQueryKey="kpi_nmv_group_by"
    />
  );
}

async function UnitsSoldKpiCard({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  const filters = filtersFromParams(params);
  const selectedGroupBy = getKpiGroupBy(params, 'kpi_units_sold_group_by');
  const summary = await fetchSummaryMetric(
    'units_sold',
    filters,
    selectedGroupBy,
  );

  return (
    <KpiMetricCard
      metric="units_sold"
      summary={summary}
      selectedGroupBy={selectedGroupBy}
      groupByQueryKey="kpi_units_sold_group_by"
    />
  );
}

async function ActiveShopsKpiCard({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  const filters = filtersFromParams(params);
  const selectedGroupBy = getKpiGroupBy(params, 'kpi_unique_shops_group_by');
  const summary = await fetchSummaryMetric(
    'unique_shops',
    filters,
    selectedGroupBy,
  );

  return (
    <KpiMetricCard
      metric="unique_shops"
      summary={summary}
      selectedGroupBy={selectedGroupBy}
      groupByQueryKey="kpi_unique_shops_group_by"
    />
  );
}

async function UniqueProductsKpiCard({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  const filters = filtersFromParams(params);
  const selectedGroupBy = getKpiGroupBy(params, 'kpi_unique_products_group_by');
  const summary = await fetchSummaryMetric(
    'unique_products',
    filters,
    selectedGroupBy,
  );

  return (
    <KpiMetricCard
      metric="unique_products"
      summary={summary}
      selectedGroupBy={selectedGroupBy}
      groupByQueryKey="kpi_unique_products_group_by"
    />
  );
}

async function AvgPriceKpiCard({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  const filters = filtersFromParams(params);
  const selectedPlatform = params.kpi_avg_price_platform;
  const [platforms, summary] = await Promise.all([
    fetchPlatforms(),
    fetchSummaryMetric('avg_price', {
      ...filters,
      platform:
        !selectedPlatform || selectedPlatform === AVG_PRICE_SELECTOR_ALL
          ? filters.platform
          : selectedPlatform,
    }),
  ]);

  return (
    <KpiMetricCard
      metric="avg_price"
      summary={summary}
      platforms={platforms}
      avgPricePlatform={selectedPlatform ?? AVG_PRICE_SELECTOR_ALL}
    />
  );
}

export default function KpiCards({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Suspense
        key={`kpi-nmv-${buildCardKey(params, 'kpi_nmv_group_by')}`}
        fallback={<KpiCardSkeleton />}
      >
        <TotalNmvKpiCard params={params} />
      </Suspense>

      <Suspense
        key={`kpi-units-sold-${buildCardKey(params, 'kpi_units_sold_group_by')}`}
        fallback={<KpiCardSkeleton />}
      >
        <UnitsSoldKpiCard params={params} />
      </Suspense>

      <Suspense
        key={`kpi-active-shops-${buildCardKey(params, 'kpi_unique_shops_group_by')}`}
        fallback={<KpiCardSkeleton />}
      >
        <ActiveShopsKpiCard params={params} />
      </Suspense>

      <Suspense
        key={`kpi-unique-products-${buildCardKey(params, 'kpi_unique_products_group_by')}`}
        fallback={<KpiCardSkeleton />}
      >
        <UniqueProductsKpiCard params={params} />
      </Suspense>

      <Suspense
        key={`kpi-avg-price-${buildCardKey(params, 'kpi_avg_price_platform')}`}
        fallback={<KpiCardSkeleton hasChart={false} />}
      >
        <AvgPriceKpiCard params={params} />
      </Suspense>
    </div>
  );
}
