import { useState, useId } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { useApp } from '../context/AppContext';
import DemoDataTag from '../components/DemoDataTag';
import { formatCurrency } from '../utils/format';

const PEAK_COLOR = '#F97316';
const TEAL_COLOR = '#0EA5E9';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function buildChartData(weeklyForecast, peakWeek) {
  const peak = peakWeek ?? weeklyForecast.indexOf(Math.max(...weeklyForecast)) + 1;
  return weeklyForecast.map((value, i) => ({
    week: `W${i + 1}`,
    value,
    isPeak: i + 1 === peak,
  }));
}

function ForecastAreaChart({ weeklyForecast, peakWeek }) {
  const baseGradId = useId().replace(/:/g, '');
  const peakGradId = useId().replace(/:/g, '');
  const chartData = buildChartData(weeklyForecast, peakWeek);

  return (
    <div className="h-[180px] w-full mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={peakGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PEAK_COLOR} stopOpacity={0.45} />
              <stop offset="100%" stopColor={PEAK_COLOR} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id={baseGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TEAL_COLOR} stopOpacity={0.25} />
              <stop offset="100%" stopColor={TEAL_COLOR} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="week"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0].payload;
              return (
                <div className="rounded-lg border border-border bg-elevated px-2 py-1 text-[10px] font-mono shadow-lg">
                  {row.week} · {formatCurrency(row.value)}
                  {row.isPeak && <span className="text-saffron ml-1">▲ Peak</span>}
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={TEAL_COLOR}
            strokeWidth={2}
            fill={`url(#${baseGradId})`}
            isAnimationActive={true}
            dot={(props) => {
              const { cx, cy, payload } = props;
              if (!payload?.isPeak || cx == null || cy == null) return null;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill={PEAK_COLOR}
                  stroke="#fff"
                  strokeWidth={2}
                />
              );
            }}
            activeDot={{ r: 4, fill: PEAK_COLOR }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomerForecastCard({ customer }) {
  const [whyOpen, setWhyOpen] = useState(false);
  const mm = customer.mirrorMind;
  const weeklyForecast = mm?.weeklyForecast ?? [];
  const peakWeek = mm?.surplusWeek ?? 6;
  const signals = (mm?.signals ?? customer.triggers ?? []).slice(0, 3);

  return (
    <motion.article
      variants={cardVariants}
      className="rounded-xl border border-border bg-surface p-5 hover:border-teal/30 transition-colors"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display font-semibold text-text-primary">{customer.name}</h3>
          <p className="text-xs text-muted mt-0.5">
            {customer.profile} · {customer.location}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-teal">{customer.jeevanScore}</span>
          {mm?.surplusAmount && (
            <span className="text-[10px] px-2 py-1 rounded-full bg-saffron/15 text-saffron border border-saffron/30 font-medium">
              Predicted surplus {formatCurrency(mm.surplusAmount)}
            </span>
          )}
        </div>
      </div>

      <ForecastAreaChart weeklyForecast={weeklyForecast} peakWeek={peakWeek} />

      <button
        type="button"
        onClick={() => setWhyOpen((v) => !v)}
        className="mt-4 flex w-full items-center justify-between gap-2 text-left text-xs font-medium text-teal hover:text-teal/80 transition-colors"
      >
        <span>Why this prediction</span>
        {whyOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {whyOpen && (
        <motion.ul
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 space-y-1.5 border-t border-border/60 pt-3"
        >
          {signals.map((signal) => (
            <li
              key={signal}
              className="text-[11px] text-muted flex items-start gap-2 before:content-['•'] before:text-saffron"
            >
              {signal}
            </li>
          ))}
        </motion.ul>
      )}
    </motion.article>
  );
}

export default function MirrorMind() {
  const { customerList } = useApp();
  const forecasts = customerList.filter((c) => c.status !== 'SUPPRESSED' && c.mirrorMind);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-text-primary">
          MirrorMind — Cash Flow Forecasts
        </h1>
        <p className="text-sm text-muted mt-1">
          8-week LSTM + Prophet projections · peak surplus windows highlighted in orange
        </p>
        <DemoDataTag />
      </div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {forecasts.map((customer) => (
          <CustomerForecastCard key={customer.id} customer={customer} />
        ))}
      </motion.div>
    </div>
  );
}
