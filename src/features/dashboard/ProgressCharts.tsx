import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { Card } from '@/components/Card';
import { useProgress } from '@/hooks/useProgress';
import { formatSteps } from '@/hooks/useAnimatedNumber';

function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d');
}

export function ProgressCharts() {
  const { cumulativeSeries, dailyBars, entriesSorted } = useProgress();

  if (entriesSorted.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <h3 className="mb-3 font-display text-sm font-semibold text-ink">Cumulative progress</h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cumulativeSeries} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cumulativeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9CB8A0" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#A8C5DA" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={formatShortDate}
                tick={{ fontSize: 10, fill: '#8a837c' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                tick={{ fontSize: 10, fill: '#8a837c' }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                formatter={(value: number) => [formatSteps(value), 'Total']}
                labelFormatter={formatShortDate}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#9CB8A0"
                strokeWidth={2}
                fill="url(#cumulativeFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="mb-3 font-display text-sm font-semibold text-ink">Last 7 days</h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyBars} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="date"
                tickFormatter={formatShortDate}
                tick={{ fontSize: 10, fill: '#8a837c' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#8a837c' }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                formatter={(value: number) => [formatSteps(value), 'Steps']}
                labelFormatter={formatShortDate}
              />
              <Bar dataKey="steps" fill="#D4A574" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
