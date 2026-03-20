import { Suspense } from 'react';
import FilterBar from '@/components/FilterBar';
import FilterBarSkeleton from '@/components/FilterBarSkeleton';
import KpiCards from '@/components/KpiCards';
import {
  fetchL1Categories,
  fetchPlatforms,
  fetchRegions,
} from '@/lib/api/filters';

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

function ChartPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
          Coming soon
        </div>
      </div>
      <div className="mt-5 h-56 rounded-xl bg-slate-50 ring-1 ring-slate-200/70" />
    </div>
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
      />
    </div>
  );
}

function PageContent() {
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Suspense fallback={<KpiSkeleton />}>
              <KpiCards />
            </Suspense>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              Top Charts
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Filter and compare the upcoming top products and top shops views.
            </p>
          </div>

          <div className="space-y-4">
            <Suspense fallback={<FilterBarSkeleton />}>
              <TopChartsFilterBarContent />
            </Suspense>

            <div className="grid grid-cols-1 gap-4">
              <ChartPlaceholder
                title="Top Products"
                description="Reserved chart space for the upcoming top products bar chart."
              />
              <ChartPlaceholder
                title="Top Shops"
                description="Reserved chart space for the upcoming top shops bar chart."
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}
