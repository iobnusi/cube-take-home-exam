export default function FilterBarSkeleton() {
  return (
    <div className="px-6 py-3 bg-white border-b border-slate-200 space-y-2 animate-pulse">
      {/* Row 1: filter icon + dropdowns + date inputs */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 mr-1">
          <div className="w-[13px] h-[13px] bg-slate-200 rounded" />
          <div className="w-10 h-3 bg-slate-200 rounded" />
        </div>

        <div className="h-8 w-32 bg-slate-100 border border-slate-200 rounded-lg" />
        <div className="h-8 w-32 bg-slate-100 border border-slate-200 rounded-lg" />
        <div className="h-8 w-28 bg-slate-100 border border-slate-200 rounded-lg" />
        <div className="h-8 w-32 bg-slate-100 border border-slate-200 rounded-lg" />

        <div className="flex items-center gap-1.5">
          <div className="w-7 h-3 bg-slate-200 rounded" />
          <div className="h-8 w-32 bg-slate-100 border border-slate-200 rounded-lg" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-3 bg-slate-200 rounded" />
          <div className="h-8 w-32 bg-slate-100 border border-slate-200 rounded-lg" />
        </div>
      </div>

      {/* Row 2: category dropdowns */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-16 h-3 bg-slate-200 rounded mr-1" />
        <div className="h-8 w-28 bg-slate-100 border border-slate-200 rounded-lg" />
        <div className="h-8 w-28 bg-slate-100 border border-slate-200 rounded-lg" />
        <div className="h-8 w-28 bg-slate-100 border border-slate-200 rounded-lg" />
        <div className="h-8 w-28 bg-slate-100 border border-slate-200 rounded-lg" />
      </div>
    </div>
  );
}
