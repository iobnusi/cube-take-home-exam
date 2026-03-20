export default function TopChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse"
        >
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-slate-100" />
            <div className="h-3 w-48 rounded bg-slate-100" />
          </div>
          <div className="mt-5 h-72 rounded-xl bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
