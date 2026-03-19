import { Suspense } from "react";
import FilterBar from "@/components/FilterBar";
import SalesTable from "@/components/SalesTable";

function TableSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden animate-pulse">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="h-4 w-28 bg-slate-100 rounded" />
        <div className="h-3 w-36 bg-slate-100 rounded mt-1.5" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {Array.from({ length: 8 }).map((_, i) => (
                <th key={i} className="px-3 py-2.5">
                  <div className="h-3 bg-slate-200 rounded w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i} className="border-b border-slate-50">
                {Array.from({ length: 8 }).map((_, j) => (
                  <td key={j} className="px-3 py-2.5">
                    <div className="h-3 bg-slate-100 rounded w-full max-w-20" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
          <h1 className="text-xl font-bold text-slate-900">Records</h1>
          <p className="text-sm text-slate-500 mt-0.5">Full sales transaction records with pagination</p>
        </div>
        <Suspense fallback={<TableSkeleton />}>
          <SalesTable />
        </Suspense>
      </div>
    </>
  );
}

export default function RecordsPage() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}
