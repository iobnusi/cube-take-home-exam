'use client';

import type { TopDataPoint } from '@/lib/types';
import TopBarChartCard from './TopBarChartCard';

export default function TopChartsPanel({
  topProducts,
  topShops,
}: {
  topProducts: TopDataPoint[];
  topShops: TopDataPoint[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <TopBarChartCard
        title="Top 10 Products"
        subtitle="Highest product IDs ranked by NMV for the selected top-chart filters."
        data={topProducts}
        valueFormat="currency"
      />
      <TopBarChartCard
        title="Top 10 Shops"
        subtitle="Highest shop IDs ranked by NMV for the selected top-chart filters."
        data={topShops}
        valueFormat="currency"
      />
    </div>
  );
}
