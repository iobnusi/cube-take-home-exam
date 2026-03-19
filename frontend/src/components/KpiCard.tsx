interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
}

export default function KpiCard({ label, value, icon, description }: KpiCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors duration-200 flex-shrink-0">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900 tabular-nums tracking-tight">{value}</p>
      {description && (
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      )}
    </div>
  );
}
