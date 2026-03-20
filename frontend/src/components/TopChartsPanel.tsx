'use client';

import type {
  TopDataPoint,
  TopProductsRankBy,
  TopShopsRankBy,
} from '@/lib/types';
import TopBarChartCard from './TopBarChartCard';

export default function TopChartsPanel({
  topProducts,
  topShops,
  topProductsRankBy,
  topShopsRankBy,
}: {
  topProducts: TopDataPoint[];
  topShops: TopDataPoint[];
  topProductsRankBy: TopProductsRankBy;
  topShopsRankBy: TopShopsRankBy;
}) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <TopBarChartCard
        title="Top 10 Products"
        subtitle="Top product IDs for the selected top-chart filters."
        data={topProducts}
        valueFormat={topProductsRankBy === 'nmv' ? 'currency' : 'number'}
        rankBy={topProductsRankBy}
        rankByQueryKey="top_products_rank_by"
        rankByOptions={[
          { label: 'NMV', value: 'nmv' },
          { label: 'Units Sold', value: 'units_sold' },
        ]}
      />
      <TopBarChartCard
        title="Top 10 Shops"
        subtitle="Top shop IDs for the selected top-chart filters."
        data={topShops}
        valueFormat={topShopsRankBy === 'nmv' ? 'currency' : 'number'}
        rankBy={topShopsRankBy}
        rankByQueryKey="top_shops_rank_by"
        rankByOptions={[
          { label: 'NMV', value: 'nmv' },
          { label: 'Units Sold', value: 'units_sold' },
          { label: 'Product Count', value: 'product_count' },
        ]}
      />
    </div>
  );
}
