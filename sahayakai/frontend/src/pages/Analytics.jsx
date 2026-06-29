import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import DemoDataTag from '../components/DemoDataTag';
import ForecastSparkline from '../components/ForecastSparkline';
import { formatCurrency, getScoreBucket } from '../utils/format';

function getPipelineStatusPill(status) {
  switch (status) {
    case 'PENDING_APPROVAL':
      return 'text-saffron bg-saffron/15 border-saffron/30';
    case 'APPROVED':
      return 'text-success bg-success/15 border-success/30';
    case 'MONITORING':
      return 'text-teal bg-teal/15 border-teal/30';
    case 'SUPPRESSED':
      return 'text-muted bg-muted/10 border-muted/20';
    default:
      return 'text-muted bg-muted/10 border-muted/20';
  }
}

function KpiValue({ value }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`font-mono text-3xl font-medium ${
        value.includes('×') || value.startsWith('~') ? 'text-saffron' : 'text-teal'
      }`}
    >
      {value}
    </motion.span>
  );
}

const kpis = [
  {
    value: '2–3×',
    label: 'Digital Product Activation Rate',
    sub: 'vs passive base',
    means: 'Customers are activating products they previously ignored',
    trend: '↑',
  },
  {
    value: '+35%',
    label: 'Cross-Sell Conversion',
    sub: 'contextual vs generic',
    means: 'Contextual offers convert 35% better than generic SMS blasts',
    trend: '↑',
  },
  {
    value: '+40%',
    label: 'Monthly Active Engagement',
    sub: 'voice-first driver',
    means: 'Voice-first access drives more monthly engagement than app-only',
    trend: '↑',
  },
  {
    value: '~60%',
    label: 'Proactive Scam Interceptions',
    sub: 'of flagged transfers',
    means: 'Of suspicious transfers flagged, 60% are now auto-intercepted',
    trend: '↑',
  },
];

const scamTypeBars = [
  { label: 'Impersonation', pct: 40 },
  { label: 'Phishing', pct: 30 },
  { label: 'OTP Fishing', pct: 20 },
  { label: 'Fake Loan', pct: 10 },
];

export default function Analytics() {
  const { customerList, scamList } = useApp();

  const scoreDistribution = useMemo(() => {
    const buckets = [
      { label: 'HIGH (90+)', key: 'high', color: 'bg-saffron', count: 0 },
      { label: 'MEDIUM (74-89)', key: 'medium', color: 'bg-amber', count: 0 },
      { label: 'LOW (60-73)', key: 'low', color: 'bg-danger/70', count: 0 },
      { label: 'SUPPRESS (<60)', key: 'suppress', color: 'bg-muted', count: 0 },
    ];
    customerList.forEach((c) => {
      const bucket = getScoreBucket(c);
      const idx = buckets.findIndex((b) => b.key === bucket);
      if (idx >= 0) buckets[idx].count++;
    });
    const max = Math.max(...buckets.map((b) => b.count), 1);
    return buckets.map((b) => ({ ...b, width: (b.count / max) * 100 }));
  }, [customerList]);

  const outreachBreakdown = useMemo(() => {
    const counts = {
      accepted: 0,
      sent: 0,
      awaiting: 0,
      suppressed: 0,
    };
    customerList.forEach((c) => {
      if (c.outreachStatus === 'OFFER_ACCEPTED' || c.outreachStatus === 'LOAN_DISBURSED') {
        counts.accepted++;
      } else if (c.outreachStatus === 'OFFER_SENT') counts.sent++;
      else if (c.outreachStatus === 'AWAITING_RESPONSE') counts.awaiting++;
      else if (c.outreachStatus === 'NO_OUTREACH') counts.suppressed++;
    });
    const total = customerList.length || 1;
    return [
      { label: 'Offer Accepted', count: counts.accepted, color: '#22C55E', pct: (counts.accepted / total) * 100 },
      { label: 'Offer Sent', count: counts.sent, color: '#F59E0B', pct: (counts.sent / total) * 100 },
      { label: 'Awaiting Response', count: counts.awaiting, color: '#0EA5E9', pct: (counts.awaiting / total) * 100 },
      { label: 'Suppressed', count: counts.suppressed, color: '#64748B', pct: (counts.suppressed / total) * 100 },
    ];
  }, [customerList]);

  const conicGradient = outreachBreakdown
    .reduce(
      (acc, seg, i, arr) => {
        const start = arr.slice(0, i).reduce((s, x) => s + x.pct, 0);
        acc.push(`${seg.color} ${start}% ${start + seg.pct}%`);
        return acc;
      },
      []
    )
    .join(', ');

  const pipelineCustomers = customerList.filter((c) => c.status !== 'SUPPRESSED');
  const amountProtected = scamList.reduce((s, x) => s + (x.amountAttempted || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-bold text-2xl">Analytics — SahayakAI Performance</h1>
        <p className="text-sm text-muted mt-1">
          Branch: Nagpur · Officer: Amit Oberoi · June 2026
        </p>
        <DemoDataTag />
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <div className="flex items-start justify-between">
              <KpiValue value={kpi.value} />
              <span className="text-success text-sm flex items-center gap-0.5">
                <TrendingUp size={14} />
                {kpi.trend}
              </span>
            </div>
            <p className="text-sm font-medium text-text-primary mt-2">{kpi.label}</p>
            <p className="text-xs text-muted mt-0.5">{kpi.sub}</p>
            <p className="text-[11px] text-muted/80 mt-2 leading-relaxed italic">{kpi.means}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="font-display font-semibold text-sm mb-4">JeevanScore Distribution</h3>
          <div className="space-y-3">
            {scoreDistribution.map((bucket) => (
              <div key={bucket.key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted">{bucket.label}</span>
                  <span className="font-mono">{bucket.count} customers</span>
                </div>
                <div className="h-3 rounded bg-elevated overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${bucket.width}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full rounded ${bucket.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="font-display font-semibold text-sm mb-4">Outreach Status Breakdown</h3>
          <div className="flex flex-col items-center">
            <div
              className="w-36 h-36 rounded-full"
              style={{
                background: `conic-gradient(${conicGradient})`,
              }}
            />
            <div className="w-20 h-20 rounded-full bg-surface -mt-[7.5rem] mb-8 flex items-center justify-center">
              <span className="text-xs text-muted font-mono">{customerList.length} total</span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full mt-2">
              {outreachBreakdown.map((seg) => (
                <div key={seg.label} className="flex items-center gap-2 text-xs">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-muted">{seg.label}:</span>
                  <span className="font-mono">{seg.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-display font-semibold text-sm">
            Active Cash Flow Windows — All Customers
          </h3>
          <p className="text-xs text-muted mt-1">
            MirrorMind forecasts each customer&apos;s cash flow 60–90 days ahead. The optimal window
            is when SahayakAI places the outreach call.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-elevated/40">
                <th className="text-left px-4 py-3 text-xs text-muted">Customer</th>
                <th className="text-left px-4 py-3 text-xs text-muted">Score</th>
                <th className="text-left px-4 py-3 text-xs text-muted">Forecast</th>
                <th className="text-left px-4 py-3 text-xs text-muted">Optimal Window</th>
                <th className="text-left px-4 py-3 text-xs text-muted">Recommended Product</th>
                <th className="text-left px-4 py-3 text-xs text-muted">Trend</th>
                <th className="text-left px-4 py-3 text-xs text-muted">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pipelineCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-elevated/20">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 font-mono">{c.jeevanScore}</td>
                  <td className="px-4 py-3 text-xs text-muted max-w-[200px]">
                    {c.mirrorMindForecast}
                  </td>
                  <td className="px-4 py-3 text-xs">Next 12 days</td>
                  <td className="px-4 py-3 text-xs">{c.product || '—'}</td>
                  <td className="px-4 py-3">
                    <ForecastSparkline
                      weeklyForecast={c.mirrorMind?.weeklyForecast}
                      peakWeek={c.mirrorMind?.surplusWeek}
                      height={60}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getPipelineStatusPill(c.status)}`}
                    >
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SahayakShield summary */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="font-display font-semibold text-sm mb-4">🛡 SahayakShield — This Week</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg bg-elevated/50 p-4 border border-border">
            <p className="text-xs text-muted">Scam Attempts Intercepted</p>
            <p className="font-mono text-xl text-danger mt-1">{scamList.length}</p>
          </div>
          <div className="rounded-lg bg-elevated/50 p-4 border border-border">
            <p className="text-xs text-muted">Amount Protected</p>
            <p className="font-mono text-xl text-success mt-1">{formatCurrency(amountProtected)}</p>
          </div>
          <div className="rounded-lg bg-elevated/50 p-4 border border-border">
            <p className="text-xs text-muted">Avg Detection Time</p>
            <p className="font-mono text-xl text-teal mt-1">&lt;2 seconds</p>
          </div>
        </div>
        <p className="text-xs text-muted mb-3">Scam types intercepted this week</p>
        <div className="space-y-2">
          {scamTypeBars.map((bar) => (
            <div key={bar.label} className="flex items-center gap-3">
              <span className="text-xs text-muted w-24 shrink-0">{bar.label}</span>
              <div className="flex-1 h-2 rounded bg-elevated overflow-hidden">
                <div
                  className="h-full rounded bg-danger/70"
                  style={{ width: `${bar.pct}%` }}
                />
              </div>
              <span className="text-xs font-mono text-muted w-10">{bar.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted italic text-center pb-4">
        * All projections are directional estimates based on comparable fintech deployments.
        Actual results depend on SBI implementation scope and rollout phasing.
      </p>
    </div>
  );
}
