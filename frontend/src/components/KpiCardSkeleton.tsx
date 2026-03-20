export default function KpiCardSkeleton({
  hasChart = true,
}: {
  hasChart?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3 w-20 rounded bg-slate-100" />
          <div className="h-3 w-28 rounded bg-slate-100" />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden h-7 w-24 rounded-full bg-slate-100 sm:block" />
          <div className="h-9 w-9 rounded-xl bg-slate-100" />
        </div>
      </div>

      <div className="mt-5">
        <div className="h-8 w-32 rounded bg-slate-100" />
        <div className="mt-3 h-3 w-24 rounded bg-slate-100 sm:hidden" />
      </div>

      {hasChart ? (
        <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="h-24 w-24 rounded-full bg-slate-100" />
            <div className="grid w-full gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 rounded-xl bg-white px-2.5 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-100" />
                    <div className="h-3 w-20 rounded bg-slate-100" />
                  </div>
                  <div className="h-3 w-8 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 h-28 rounded-2xl bg-slate-50/80" />
      )}
    </div>
  );
}
