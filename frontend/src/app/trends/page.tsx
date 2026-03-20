import { Suspense } from 'react';
import TrendChart from '@/components/TrendChart';
import { filtersFromParams } from '@/lib/utils';
import { fetchTrends } from '@/lib/api';
import { TrendGroupBy } from '@/lib/types';
import {
  fetchL1Categories,
  fetchPlatforms,
  fetchRegions,
} from '@/lib/api/filters';
import FilterBar from '@/components/FilterBar';

function GridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-xl animate-pulse"
        >
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="h-3.5 w-28 bg-slate-100 rounded" />
            <div className="h-3 w-20 bg-slate-100 rounded mt-1.5" />
          </div>
          <div className="p-4 h-[252px] flex items-end gap-1.5">
            {Array.from({ length: 12 }).map((_, j) => (
              <div
                key={j}
                className="flex-1 bg-slate-100 rounded-t"
                style={{ height: `${30 + ((j * 17) % 70)}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

async function FilterBarContent() {
  const [l1Categories, platforms, regions] = await Promise.all([
    fetchL1Categories(),
    fetchPlatforms(),
    fetchRegions(),
  ]);
  return (
    <FilterBar
      l1Categories={l1Categories}
      platforms={platforms}
      regions={regions}
      disable={{
        dateRange: true,
      }}
    />
  );
}

async function TrendChartContent({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  const filters = filtersFromParams(params);
  const groupBy = params.groupBy as TrendGroupBy;

  const data = await fetchTrends(filters, groupBy);

  return <TrendChart data={data} />;
}

export default async function TrendsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  return (
    <>
      <FilterBarContent />
      <div className="p-6">
        <div className="mb-3">
          <h1 className="text-xl font-bold text-slate-900">Trends</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monthly metrics breakdown by dimension
          </p>
        </div>
        <Suspense key={JSON.stringify(params)} fallback={<GridSkeleton />}>
          <TrendChartContent params={params} />
        </Suspense>
      </div>
    </>
  );
}
