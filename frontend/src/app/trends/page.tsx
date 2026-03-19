import { Suspense } from "react";
import FilterBar from "@/components/FilterBar";
import TrendChart from "@/components/TrendChart";

function ChartSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl animate-pulse">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="h-4 w-32 bg-slate-100 rounded" />
        <div className="h-3 w-24 bg-slate-100 rounded mt-1.5" />
      </div>
      <div className="p-5 h-80 flex items-end gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-slate-100 rounded-t"
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function PageContent() {
  return (
    <>
      <FilterBar />
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Trends</h1>
          <p className="text-sm text-slate-500 mt-0.5">Monthly NMV breakdown by dimension</p>
        </div>
        <Suspense fallback={<ChartSkeleton />}>
          <TrendChart />
        </Suspense>
      </div>
    </>
  );
}

export default function TrendsPage() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}
