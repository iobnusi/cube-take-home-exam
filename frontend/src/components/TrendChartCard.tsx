import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
  '#84cc16',
];

interface TrendChartCardProps {
  title: string;
  subtitle: string;
  chartData: Record<string, string | number>[];
  groups: string[];
  formatValue: (v: number) => string;
}

export default function TrendChartCard({
  title,
  subtitle,
  chartData,
  groups,
  formatValue,
}: TrendChartCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl">
      <div className="px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>
      <div className="p-4">
        <div className="h-55 min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatValue}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                width={56}
              />
              <Tooltip
                formatter={(value) => [formatValue(Number(value)), '']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                cursor={{ fill: 'rgba(0,0,0,0.04)' }}
              />
              <Legend
                iconType="circle"
                iconSize={7}
                wrapperStyle={{
                  fontSize: '11px',
                  color: '#64748b',
                  paddingTop: '8px',
                }}
              />
              {groups.map((group, i) => (
                <Bar
                  key={group}
                  dataKey={group}
                  fill={COLORS[i % COLORS.length]}
                  radius={[3, 3, 0, 0]}
                  maxBarSize={28}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
