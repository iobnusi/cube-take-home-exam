import { fetchSummaryMetric } from '@/lib/api';
import { fetchPlatforms } from '@/lib/api/filters';
import type { SummaryGroupBy } from '@/lib/types';
import { filtersFromParams } from '@/lib/utils';
import KpiMetricCard, { AVG_PRICE_SELECTOR_ALL } from './KpiMetricCard';

function getKpiGroupBy(
  params: Record<string, string | undefined>,
  key: string,
): SummaryGroupBy {
  const value = params[key];
  return value === 'region' ? 'region' : 'platform';
}

export default async function KpiCards({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  const filters = filtersFromParams(params);
  const nmvGroupBy = getKpiGroupBy(params, 'kpi_nmv_group_by');
  const unitsSoldGroupBy = getKpiGroupBy(params, 'kpi_units_sold_group_by');
  const uniqueShopsGroupBy = getKpiGroupBy(params, 'kpi_unique_shops_group_by');
  const uniqueProductsGroupBy = getKpiGroupBy(
    params,
    'kpi_unique_products_group_by',
  );
  const selectedPlatform = params.kpi_avg_price_platform;

  const [
    nmvSummary,
    unitsSoldSummary,
    uniqueShopsSummary,
    uniqueProductsSummary,
    avgPriceSummary,
    platforms,
  ] = await Promise.all([
    fetchSummaryMetric('nmv', filters, nmvGroupBy),
    fetchSummaryMetric('units_sold', filters, unitsSoldGroupBy),
    fetchSummaryMetric('unique_shops', filters, uniqueShopsGroupBy),
    fetchSummaryMetric('unique_products', filters, uniqueProductsGroupBy),
    fetchSummaryMetric('avg_price', {
      ...filters,
      platform:
        !selectedPlatform || selectedPlatform === AVG_PRICE_SELECTOR_ALL
          ? filters.platform
          : selectedPlatform,
    }),
    fetchPlatforms(),
  ]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <KpiMetricCard
        metric="nmv"
        summary={nmvSummary}
        selectedGroupBy={nmvGroupBy}
        groupByQueryKey="kpi_nmv_group_by"
      />

      <KpiMetricCard
        metric="units_sold"
        summary={unitsSoldSummary}
        selectedGroupBy={unitsSoldGroupBy}
        groupByQueryKey="kpi_units_sold_group_by"
      />

      <KpiMetricCard
        metric="unique_shops"
        summary={uniqueShopsSummary}
        selectedGroupBy={uniqueShopsGroupBy}
        groupByQueryKey="kpi_unique_shops_group_by"
      />

      <KpiMetricCard
        metric="unique_products"
        summary={uniqueProductsSummary}
        selectedGroupBy={uniqueProductsGroupBy}
        groupByQueryKey="kpi_unique_products_group_by"
      />

      <KpiMetricCard
        metric="avg_price"
        summary={avgPriceSummary}
        platforms={platforms}
        avgPricePlatform={selectedPlatform ?? AVG_PRICE_SELECTOR_ALL}
      />
    </div>
  );
}
