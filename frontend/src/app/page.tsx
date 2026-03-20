import { Suspense } from 'react';
import FilterBar from '@/components/FilterBar';
import KpiCards from '@/components/KpiCards';

function KpiSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="h-3 w-20 bg-slate-100 rounded" />
            <div className="w-8 h-8 bg-slate-100 rounded-lg" />
          </div>
          <div className="h-8 w-28 bg-slate-100 rounded" />
          <div className="h-3 w-32 bg-slate-100 rounded mt-2" />
        </div>
      ))}
    </>
  );
}

function PageContent() {
  return (
    <>
      {/* <FilterBar /> */}
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Summary of key sales metrics
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <Suspense fallback={<KpiSkeleton />}>
            <KpiCards />
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}
