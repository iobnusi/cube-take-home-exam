'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TopDataPoint } from '@/lib/types';

interface TopBarChartCardProps {
  title: string;
  subtitle: string;
  data: TopDataPoint[];
  valueFormat?: 'number' | 'currency';
}

function formatCompactValue(value: number, valueFormat: 'number' | 'currency') {
  const prefix = valueFormat === 'currency' ? '฿' : '';

  if (value >= 1_000_000_000) {
    return `${prefix}${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${prefix}${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${prefix}${(value / 1_000).toFixed(1)}K`;
  }

  return `${prefix}${value.toLocaleString()}`;
}

export default function TopBarChartCard({
  title,
  subtitle,
  data,
  valueFormat = 'number',
}: TopBarChartCardProps) {
  const chartData = data;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 16, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            horizontal={false}
          />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickFormatter={(value) =>
              formatCompactValue(Number(value), valueFormat)
            }
          />
          <YAxis
            type="category"
            dataKey="id"
            width={96}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#475569' }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(59, 130, 246, 0.06)' }}
            formatter={(value) => [
              formatCompactValue(Number(value), valueFormat),
              'Value',
            ]}
            contentStyle={{
              backgroundColor: '#0f172a',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 12px',
              fontSize: '12px',
              color: '#f8fafc',
            }}
            labelStyle={{ color: '#cbd5e1', marginBottom: '4px' }}
          />
          <Bar
            dataKey="value"
            fill="#3b82f6"
            radius={[0, 6, 6, 0]}
            barSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
