import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { useId } from 'react';

const PEAK_COLOR = '#F97316';

export default function ForecastSparkline({ weeklyForecast = [], height = 60, peakWeek }) {
  const gradId = useId().replace(/:/g, '');

  if (!weeklyForecast.length) {
    return <div className="w-[100px] h-[60px] bg-elevated/40 rounded" />;
  }

  const resolvedPeak = peakWeek ?? weeklyForecast.indexOf(Math.max(...weeklyForecast)) + 1;
  const chartData = weeklyForecast.map((value, i) => ({
    week: i + 1,
    value,
    isPeak: i + 1 === resolvedPeak,
  }));

  return (
    <div style={{ width: 100, height }} className="shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PEAK_COLOR} stopOpacity={0.35} />
              <stop offset="100%" stopColor={PEAK_COLOR} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={PEAK_COLOR}
            strokeWidth={1.5}
            fill={`url(#${gradId})`}
            isAnimationActive={false}
            dot={(props) => {
              const { cx, cy, payload } = props;
              if (!payload?.isPeak || cx == null || cy == null) return null;
              return (
                <circle cx={cx} cy={cy} r={3} fill={PEAK_COLOR} stroke="#fff" strokeWidth={1} />
              );
            }}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
