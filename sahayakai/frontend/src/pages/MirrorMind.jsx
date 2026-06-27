import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Brain,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Database,
  GitCompare,
  Grid3X3,
  LayoutList,
  Radio,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import MirrorMindBackground from '../components/MirrorMindBackground';
import ForecastBarChart from '../components/ForecastBarChart';
import JeevanScoreGauge from '../components/dashboard/JeevanScoreGauge';
import {
  formatCurrency,
  getAvatarColor,
  getCashGapRiskColor,
  getConfidenceColor,
  getStatusColor,
} from '../utils/format';

const INPUT_SIGNALS = [
  { icon: '📊', label: '12-month spending rhythm', tag: 'SBI Core', weight: 18 },
  { icon: '💰', label: 'Recurring income dates', tag: 'Salary Graph', weight: 14 },
  { icon: '📅', label: 'EMI completion timeline', tag: 'Loan Ledger', weight: 16 },
  { icon: '🌾', label: 'Crop harvest calendar', tag: 'Agmarknet', weight: 12 },
  { icon: '📢', label: 'MSP announcement timing', tag: 'Gov Portal', weight: 10 },
  { icon: '🎉', label: 'Festival demand windows', tag: 'Seasonality', weight: 11 },
  { icon: '📍', label: 'District mandi price trends', tag: 'e-NAM', weight: 9 },
];

const MODEL_STEPS = [
  { name: 'LSTM Encoder', desc: '12-mo transaction sequences' },
  { name: 'Prophet Layer', desc: 'Festival & harvest seasonality' },
  { name: 'Cohort Benchmark', desc: 'Peer-group normalization' },
  { name: 'Confidence Scorer', desc: '4-tier signal weighting' },
  { name: 'Weekly Recalibration', desc: 'Every Sunday 5:00 AM IST' },
];

const OUTPUT_SIGNALS = [
  { icon: '📈', label: 'Weekly cash flow projection', metric: '8-week horizon' },
  { icon: '⚠️', label: 'Cash gap risk level', metric: '4 tiers' },
  { icon: '🎯', label: 'Optimal outreach window', metric: 'Day-level precision' },
  { icon: '💡', label: 'Product recommendation', metric: 'JeevanScore-linked' },
  { icon: '🔢', label: 'Confidence score', metric: '0–100 scale' },
  { icon: '⏱️', label: 'Act now vs Monitor', metric: 'Officer alert' },
];

const TICKER_ITEMS = [
  'Recalibrated 8 customer models · Nagpur branch',
  'Agmarknet MSP update ingested · Kharif 2026',
  'Priya Sharma — cash gap risk elevated to HIGH',
  'Ramesh Patil — surplus window opens week 6',
  'LSTM batch inference completed · 142ms avg',
  'Prophet seasonality layer refreshed · festival calendar',
];

const FILTER_CHIPS = [
  { id: 'all', label: 'All' },
  { id: 'high-score', label: 'HIGH Score' },
  { id: 'said-haan', label: 'Said Haan' },
  { id: 'cash-gap-high', label: 'Cash Gap: High' },
  { id: 'pending', label: 'Pending' },
];

const SORT_OPTIONS = [
  { id: 'jeevan-desc', label: 'JeevanScore↓' },
  { id: 'score-asc', label: 'Score↑' },
  { id: 'surplus-desc', label: 'Surplus↓' },
  { id: 'name-asc', label: 'Name A-Z' },
];

const SUB_NAV = [
  { id: 'mm-overview', label: 'Overview' },
  { id: 'mm-forecasts', label: 'Active Forecasts' },
  { id: 'mm-validation', label: 'Validation' },
  { id: 'mm-benchmark', label: 'vs Alternatives' },
];

const SIGNAL_TOGGLES = [
  { id: 'emi', label: 'EMI Freed', points: 28, product: 'Working Capital Loan' },
  { id: 'harvest', label: 'Harvest Season', points: 25, product: 'Kisan Credit Card' },
  { id: 'salary', label: 'Salary Hike', points: 20, product: 'Personal Loan' },
  { id: 'festival', label: 'Festival Week', points: 15, product: 'Festive Personal Loan' },
  { id: 'msp', label: 'MSP Announced', points: 12, product: 'Kisan Vikas Patra' },
  { id: 'employment', label: 'New Employment', points: 20, product: 'Personal Loan' },
];

const VALIDATION_PHASES = [
  {
    phase: 'Phase 1',
    title: 'Hackathon Demo',
    desc: 'Model architecture demonstrated on synthetic + public Agmarknet/RBI data. No accuracy claim made — inputs and logic validated only.',
    detail:
      'Signal ingestion pipeline verified end-to-end. LSTM encoder + Prophet seasonality layer produce weekly cash-flow projections. Confidence tiers (SUPPRESS / LOW / MEDIUM / HIGH) gate officer outreach. Demo runs on 8 Nagpur-branch customers with public Agmarknet MSP and festival calendar overlays.',
    status: '● Active Now',
    statusClass: 'text-saffron bg-saffron/15 border-saffron/30',
    active: true,
  },
  {
    phase: 'Phase 2',
    title: 'Pilot (3–6 months)',
    desc: 'Backtested against 6 months of anonymised SBI transaction cohorts. Target: directional accuracy benchmarked against real cash events.',
    detail:
      'Planned cohort: 500 Nagpur-branch customers. Success metric: ≥70% directional accuracy on surplus/gap windows within ±1 week. Requires SBI Core Banking API access for anonymised transaction feeds.',
    status: 'Pending SBI Access',
    statusClass: 'text-amber bg-amber/15 border-amber/30',
    active: false,
  },
  {
    phase: 'Phase 3',
    title: 'Scale',
    desc: 'Live A/B validation vs. actual customer cash events. Reference benchmark: M-Pesa Fuliza ~78% 30-day accuracy after 6 months live.',
    detail:
      'Rollout to 50 branches. A/B test: MirrorMind-timed outreach vs. standard calendar-based campaigns. Primary KPI: conversion rate uplift and NPA delta on proactive offers.',
    status: 'Future',
    statusClass: 'text-muted bg-muted/10 border-muted/20',
    active: false,
  },
];

const EXPLORER_BASE_SCORE = 22;

function getConfidenceLabel(score) {
  if (score < 60) return 'SUPPRESS';
  if (score < 75) return 'LOW';
  if (score < 90) return 'MEDIUM';
  return 'HIGH';
}

function getUrgency(customer) {
  if (customer.status === 'SUPPRESSED') {
    return { label: 'MONITOR', className: 'bg-muted/15 text-muted border-muted/30' };
  }
  const mm = customer.mirrorMind;
  if (!mm) {
    return { label: 'MONITOR', className: 'bg-muted/15 text-muted border-muted/30' };
  }
  if (mm.cashGapRisk === 'High') {
    return { label: 'ACT NOW', className: 'bg-danger/20 text-danger border-danger/40 animate-pulse-live' };
  }
  if (mm.surplusWeek && mm.surplusWeek <= 3) {
    return { label: 'ACT NOW', className: 'bg-saffron/20 text-saffron border-saffron/40' };
  }
  if (mm.confidence >= 85 && mm.surplusWeek) {
    return { label: 'OPTIMAL', className: 'bg-success/15 text-success border-success/30' };
  }
  return { label: 'SCHEDULED', className: 'bg-teal/15 text-teal border-teal/30' };
}

function matchesFilters(customer, activeFilters) {
  if (activeFilters.includes('all') || activeFilters.length === 0) return true;

  return activeFilters.some((filter) => {
    if (filter === 'high-score') {
      return customer.confidence === 'HIGH' || customer.jeevanScore >= 75;
    }
    if (filter === 'said-haan') {
      return (
        customer.outreachStatus === 'OFFER_ACCEPTED' ||
        customer.outreachStatus === 'LOAN_DISBURSED'
      );
    }
    if (filter === 'cash-gap-high') {
      return customer.mirrorMind?.cashGapRisk === 'High';
    }
    if (filter === 'pending') {
      return customer.status === 'PENDING_APPROVAL';
    }
    return true;
  });
}

function sortCustomers(customers, sortBy) {
  const sorted = [...customers];
  switch (sortBy) {
    case 'jeevan-desc':
      return sorted.sort((a, b) => b.jeevanScore - a.jeevanScore);
    case 'score-asc':
      return sorted.sort((a, b) => (a.mirrorMind?.confidence ?? 0) - (b.mirrorMind?.confidence ?? 0));
    case 'surplus-desc':
      return sorted.sort(
        (a, b) => (b.mirrorMind?.surplusAmount ?? 0) - (a.mirrorMind?.surplusAmount ?? 0)
      );
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

function cellClass(value) {
  if (value.startsWith('✓')) return 'text-success';
  if (value.startsWith('✗')) return 'text-danger';
  if (value.startsWith('⚡')) return 'text-amber';
  return 'text-muted';
}

function useCountUp(target, duration = 1200, enabled = true) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return undefined;
    }

    let frameId;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration, enabled]);

  return value;
}

function SectionHeader({ eyebrow, title, subtitle, icon: Icon }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        {eyebrow && (
          <p className="font-mono text-[10px] text-teal tracking-[0.2em] uppercase mb-1.5">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display font-bold text-xl lg:text-2xl text-text-primary flex items-center gap-2">
          {Icon && <Icon size={22} className="text-teal shrink-0" />}
          {title}
        </h2>
        {subtitle && <p className="text-sm text-muted mt-1 max-w-2xl">{subtitle}</p>}
      </div>
    </div>
  );
}

function LiveStatCard({ label, value, numericValue, formatFn, sub, accent, icon: Icon }) {
  const count = useCountUp(numericValue ?? 0);
  const display =
    formatFn && numericValue != null ? formatFn(count) : numericValue != null ? count : value;

  const accents = {
    teal: 'border-teal/30 bg-teal/5 mirrormind-glow-teal',
    saffron: 'border-saffron/30 bg-saffron/5 mirrormind-glow-saffron',
    success: 'border-success/30 bg-success/5',
    danger: 'border-danger/30 bg-danger/5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mirrormind-glass rounded-xl p-4 border ${accents[accent]}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-muted uppercase tracking-wider font-mono">{label}</span>
        {Icon && <Icon size={16} className={accent === 'saffron' ? 'text-saffron' : 'text-teal'} />}
      </div>
      <p className="font-mono text-2xl lg:text-3xl font-bold text-text-primary">{display}</p>
      {sub && <p className="text-[11px] text-muted mt-1">{sub}</p>}
    </motion.div>
  );
}

function InputSignalRow({ signal }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className="p-2 rounded-lg hover:bg-elevated/40 transition-colors group space-y-1.5"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm text-muted group-hover:text-text-primary transition-colors">
          <span>{signal.icon}</span>
          <span className="text-xs">{signal.label}</span>
        </span>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-teal/10 text-teal border border-teal/20 shrink-0">
          {signal.tag}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-elevated/60 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal/80 to-teal/40 transition-all duration-1000 ease-out"
          style={{ width: visible ? `${signal.weight}%` : '0%' }}
        />
      </div>
    </li>
  );
}

function SignalExplorer() {
  const [expanded, setExpanded] = useState(true);
  const [activeToggles, setActiveToggles] = useState(new Set());

  const score = useMemo(() => {
    const bonus = SIGNAL_TOGGLES.filter((t) => activeToggles.has(t.id)).reduce(
      (sum, t) => sum + t.points,
      0
    );
    return Math.min(EXPLORER_BASE_SCORE + bonus, 100);
  }, [activeToggles]);

  const confidenceLabel = getConfidenceLabel(score);

  const productSuggestion = useMemo(() => {
    const active = SIGNAL_TOGGLES.filter((t) => activeToggles.has(t.id));
    if (active.length === 0) return 'Toggle signals to see product match';
    const top = [...active].sort((a, b) => b.points - a.points)[0];
    if (active.length >= 3) return `${top.product} + bundled offer`;
    return top.product;
  }, [activeToggles]);

  const toggleSignal = (id) => {
    setActiveToggles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="mirrormind-glass rounded-2xl border border-teal/20 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-elevated/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal/20 flex items-center justify-center">
            <Sparkles size={18} className="text-teal" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-text-primary">Signal Explorer</h3>
            <p className="text-[11px] text-muted mt-0.5">
              Toggle life-event signals · watch JeevanScore update live
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={18} className="text-muted shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-muted shrink-0" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 border-t border-border/50">
              <div className="flex flex-wrap gap-2 mt-4 mb-5">
                {SIGNAL_TOGGLES.map((toggle) => {
                  const on = activeToggles.has(toggle.id);
                  return (
                    <button
                      key={toggle.id}
                      type="button"
                      onClick={() => toggleSignal(toggle.id)}
                      className={`text-xs px-3 py-2 rounded-full border transition-all ${
                        on
                          ? 'bg-saffron/20 text-saffron border-saffron/40 shadow-[0_0_12px_rgba(249,115,22,0.15)]'
                          : 'bg-surface/50 text-muted border-border hover:border-teal/30 hover:text-text-primary'
                      }`}
                    >
                      {toggle.label}{' '}
                      <span className="font-mono text-[10px] opacity-80">+{toggle.points}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <JeevanScoreGauge score={score} confidence={confidenceLabel} size={120} />
                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <div>
                    <p className="text-[10px] font-mono text-muted uppercase tracking-wider mb-1">
                      Confidence tier
                    </p>
                    <span
                      className={`inline-flex text-xs font-body font-medium px-3 py-1 rounded-full border ${getConfidenceColor(confidenceLabel)}`}
                    >
                      {confidenceLabel}
                    </span>
                    <p className="text-[10px] text-muted mt-1.5 font-mono">
                      &lt;60 SUPPRESS · 60–74 LOW · 75–89 MEDIUM · 90+ HIGH
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-muted uppercase tracking-wider mb-1">
                      Product suggestion
                    </p>
                    <p className="text-sm text-saffron font-medium">💡 {productSuggestion}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ComparePanel({ customers, onClose }) {
  if (customers.length !== 2) return null;
  const [a, b] = customers;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl border border-border mirrormind-glass shadow-2xl"
      style={{ background: 'rgba(17, 24, 39, 0.95)' }}
    >
      <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-border/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <GitCompare size={18} className="text-teal" />
          <h3 className="font-display font-semibold text-text-primary">Forecast Comparison</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-elevated/60 text-muted hover:text-text-primary transition-colors"
          aria-label="Close comparison"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          <div className="mirrormind-glass rounded-xl p-4 border border-border/60">
            <p className="font-display font-semibold text-sm text-text-primary mb-1">{a.name}</p>
            <p className="text-[10px] text-muted mb-3">{a.profile}</p>
            <ForecastBarChart
              weeklyForecast={a.mirrorMind?.weeklyForecast ?? []}
              surplusWeek={a.mirrorMind?.surplusWeek}
              cashGapRisk={a.mirrorMind?.cashGapRisk}
              height={160}
              showLabels
              suppressed={a.status === 'SUPPRESSED'}
            />
          </div>
          <div className="hidden md:flex items-center justify-center px-2 self-center">
            <span className="font-display font-bold text-2xl text-muted/50">VS</span>
          </div>
          <div className="mirrormind-glass rounded-xl p-4 border border-border/60">
            <p className="font-display font-semibold text-sm text-text-primary mb-1">{b.name}</p>
            <p className="text-[10px] text-muted mb-3">{b.profile}</p>
            <ForecastBarChart
              weeklyForecast={b.mirrorMind?.weeklyForecast ?? []}
              surplusWeek={b.mirrorMind?.surplusWeek}
              cashGapRisk={b.mirrorMind?.cashGapRisk}
              height={160}
              showLabels
              suppressed={b.status === 'SUPPRESSED'}
            />
          </div>
        </div>

        <div className="mirrormind-glass rounded-xl overflow-hidden border border-border/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-elevated/40">
                <th className="text-left p-3 text-[10px] font-mono text-muted uppercase">Metric</th>
                <th className="text-left p-3 text-[10px] font-mono text-teal uppercase">{a.name.split(' ')[0]}</th>
                <th className="text-left p-3 text-[10px] font-mono text-saffron uppercase">{b.name.split(' ')[0]}</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Score', a.jeevanScore, b.jeevanScore],
                ['Surplus', formatCurrency(a.mirrorMind?.surplusAmount), formatCurrency(b.mirrorMind?.surplusAmount)],
                ['Risk', a.mirrorMind?.cashGapRisk ?? '—', b.mirrorMind?.cashGapRisk ?? '—'],
                ['Window', a.mirrorMind?.optimalWindow ?? '—', b.mirrorMind?.optimalWindow ?? '—'],
                ['Product', a.mirrorMind?.recommendation ?? '—', b.mirrorMind?.recommendation ?? '—'],
              ].map(([label, valA, valB]) => (
                <tr key={label} className="border-b border-border/50 last:border-0">
                  <td className="p-3 text-xs text-muted font-medium">{label}</td>
                  <td className="p-3 text-xs font-mono text-text-primary">{valA}</td>
                  <td className="p-3 text-xs font-mono text-text-primary">{valB}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function CustomerForecastCard({
  customer,
  index,
  viewMode,
  compareSelected,
  onCompareToggle,
  compareDisabled,
}) {
  const isSuppressed = customer.status === 'SUPPRESSED';
  const mm = customer.mirrorMind;
  const urgency = getUrgency(customer);
  const totalForecast = mm?.weeklyForecast?.reduce((a, b) => a + b, 0) ?? 0;
  const isCompareSelected = compareSelected.includes(customer.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`mirrormind-glass rounded-2xl overflow-hidden group hover:border-teal/30 transition-all duration-300 ${
        viewMode === 'list' ? 'flex flex-col lg:flex-row lg:items-stretch' : ''
      } ${
        isSuppressed ? 'opacity-50' : 'hover:shadow-[0_8px_40px_rgba(14,165,233,0.12)]'
      } ${urgency.label === 'ACT NOW' && !isSuppressed ? 'ring-1 ring-saffron/20' : ''} ${
        isCompareSelected ? 'ring-2 ring-teal/50' : ''
      }`}
    >
      {!isSuppressed && (
        <div
          className={`px-4 py-1 text-[10px] font-mono font-medium tracking-wider border-b ${urgency.className} ${
            viewMode === 'list' ? 'lg:w-full lg:shrink-0' : ''
          }`}
        >
          {urgency.label}
          {mm?.optimalWindow && urgency.label !== 'MONITOR' && (
            <span className="font-normal opacity-80 ml-2">· {mm.optimalWindow}</span>
          )}
        </div>
      )}

      <div className={`p-5 flex-1 ${viewMode === 'list' ? 'lg:flex lg:gap-6 lg:items-start' : ''}`}>
        <div className={`${viewMode === 'list' ? 'lg:flex-1 lg:min-w-0' : ''}`}>
          <div className="flex items-start gap-4 mb-4">
            <div className="relative shrink-0">
              <div
                className={`w-12 h-12 rounded-xl border flex items-center justify-center text-sm font-mono font-bold ${getAvatarColor(customer.confidence)}`}
              >
                {customer.avatar}
              </div>
              {mm?.confidence && (
                <span className="absolute -bottom-1 -right-1 text-[8px] font-mono bg-surface border border-border rounded px-1 text-teal">
                  {mm.confidence}%
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display font-semibold text-text-primary group-hover:text-teal transition-colors">
                  {customer.name}
                </h3>
                <span className="text-[10px] text-muted truncate">{customer.profile}</span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">{customer.location}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <JeevanScoreGauge score={customer.jeevanScore} confidence={customer.confidence} size={44} />
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-body ${getStatusColor(customer.status)}`}
                >
                  {customer.status.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-muted font-mono">{mm?.forecastHorizon}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onCompareToggle(customer.id)}
              disabled={compareDisabled && !isCompareSelected}
              className={`shrink-0 text-[10px] px-3 py-1.5 rounded-lg border transition-all ${
                isCompareSelected
                  ? 'bg-teal/20 text-teal border-teal/40'
                  : compareDisabled
                    ? 'opacity-40 cursor-not-allowed border-border text-muted'
                    : 'border-border text-muted hover:border-teal/30 hover:text-teal'
              }`}
            >
              {isCompareSelected ? 'Selected' : 'Compare'}
            </button>
          </div>

          {!isSuppressed && mm && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="rounded-lg bg-elevated/50 border border-border/60 px-2 py-1.5 text-center">
                <p className="text-[9px] text-muted uppercase">8-wk total</p>
                <p className="text-xs font-mono text-teal">{formatCurrency(totalForecast)}</p>
              </div>
              <div className="rounded-lg bg-elevated/50 border border-border/60 px-2 py-1.5 text-center">
                <p className="text-[9px] text-muted uppercase">Peak week</p>
                <p className="text-xs font-mono text-saffron">
                  {mm.surplusWeek ? `Wk ${mm.surplusWeek}` : '—'}
                </p>
              </div>
              <div className="rounded-lg bg-elevated/50 border border-border/60 px-2 py-1.5 text-center">
                <p className="text-[9px] text-muted uppercase">Gap risk</p>
                <p
                  className={`text-xs font-mono ${mm.cashGapRisk === 'High' ? 'text-danger' : 'text-text-primary'}`}
                >
                  {mm.cashGapRisk}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className={`${viewMode === 'list' ? 'lg:w-[340px] lg:shrink-0' : ''}`}>
          <ForecastBarChart
            weeklyForecast={mm?.weeklyForecast ?? []}
            surplusWeek={mm?.surplusWeek}
            cashGapRisk={mm?.cashGapRisk}
            height={viewMode === 'list' ? 200 : 280}
            showLabels
            suppressed={isSuppressed}
          />
        </div>

        <div className={`${viewMode === 'list' ? 'lg:flex-1 lg:min-w-0' : ''}`}>
          <div className="mt-4">
            <p className="text-[10px] font-mono text-teal/80 uppercase tracking-wider mb-2">
              Signals ingested
            </p>
            <div className="flex flex-wrap gap-1.5">
              {mm?.signals?.map((signal) => (
                <span
                  key={signal}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-elevated/80 text-muted border border-border/80 hover:border-teal/30 transition-colors"
                >
                  {signal}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-border/80">
            <span
              className={`px-2.5 py-1 rounded-lg border text-[10px] font-medium ${getCashGapRiskColor(mm?.cashGapRisk)}`}
            >
              {mm?.cashGapRisk} gap risk
            </span>

            {mm?.recommendation ? (
              <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                <span className="text-[11px] text-saffron font-medium truncate">
                  💡 {mm.recommendation}
                </span>
                {!isSuppressed && (
                  <Link
                    to={`/customer/${customer.id}`}
                    className="inline-flex items-center gap-0.5 text-[10px] text-teal hover:text-teal/80 whitespace-nowrap shrink-0 px-2 py-1 rounded-lg border border-teal/20 hover:bg-teal/10 transition-colors"
                  >
                    View <ChevronRight size={12} />
                  </Link>
                )}
              </div>
            ) : (
              !isSuppressed && (
                <Link
                  to={`/customer/${customer.id}`}
                  className="inline-flex items-center gap-0.5 text-[10px] text-teal hover:text-teal/80"
                >
                  View profile <ChevronRight size={12} />
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ValidationPhase({ item }) {
  const [open, setOpen] = useState(item.active);

  return (
    <div className="relative md:pl-16">
      <div
        className={`hidden md:flex absolute left-4 top-6 w-5 h-5 rounded-full border-2 items-center justify-center ${
          item.active
            ? 'border-saffron bg-saffron/20 shadow-[0_0_12px_rgba(249,115,22,0.4)]'
            : 'border-border bg-surface'
        }`}
      >
        {item.active && <span className="w-2 h-2 rounded-full bg-saffron animate-pulse-live" />}
      </div>
      <div
        className={`mirrormind-glass rounded-xl overflow-hidden ${
          item.active ? 'border-saffron/40 mirrormind-glow-saffron' : ''
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full p-5 text-left flex items-start gap-2 hover:bg-elevated/20 transition-colors"
        >
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-mono text-teal">{item.phase}</span>
              <h3 className="font-display font-semibold text-sm">{item.title}</h3>
              <span
                className={`ml-auto text-[10px] px-2 py-0.5 rounded-full border ${item.statusClass}`}
              >
                {item.status}
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
          </div>
          {open ? (
            <ChevronUp size={16} className="text-muted shrink-0 mt-1" />
          ) : (
            <ChevronDown size={16} className="text-muted shrink-0 mt-1" />
          )}
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="px-5 pb-5 text-xs text-muted/90 leading-relaxed border-t border-border/50 pt-3">
                {item.detail}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function MirrorMind() {
  const { customerList } = useApp();
  const [activeFilters, setActiveFilters] = useState(['all']);
  const [sortBy, setSortBy] = useState('jeevan-desc');
  const [viewMode, setViewMode] = useState('grid');
  const [compareSelected, setCompareSelected] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [activeSection, setActiveSection] = useState('mm-overview');

  useEffect(() => {
    const visible = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible.set(entry.target.id, entry.intersectionRatio);
        });
        let bestId = SUB_NAV[0].id;
        let bestRatio = 0;
        SUB_NAV.forEach(({ id }) => {
          const ratio = visible.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestRatio > 0) setActiveSection(bestId);
      },
      { rootMargin: '-120px 0px -50% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75] }
    );

    SUB_NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (compareSelected.length === 2) setShowCompare(true);
    else setShowCompare(false);
  }, [compareSelected]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const forecasts = useMemo(() => customerList.slice(0, 8), [customerList]);

  const stats = useMemo(() => {
    const active = forecasts.filter((c) => c.status !== 'SUPPRESSED');
    const confidences = active.map((c) => c.mirrorMind?.confidence).filter(Boolean);
    const avgConf = confidences.length
      ? Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length)
      : 0;
    const totalSurplus = active.reduce((sum, c) => sum + (c.mirrorMind?.surplusAmount ?? 0), 0);
    const actNow = forecasts.filter((c) => getUrgency(c).label === 'ACT NOW').length;
    const highRisk = forecasts.filter((c) => c.mirrorMind?.cashGapRisk === 'High').length;
    return { avgConf, totalSurplus, actNow, highRisk, activeCount: active.length };
  }, [forecasts]);

  const riskDistribution = useMemo(() => {
    const tiers = { 'Very Low': 0, Low: 0, Medium: 0, High: 0 };
    forecasts.forEach((c) => {
      const r = c.mirrorMind?.cashGapRisk;
      if (r && tiers[r] !== undefined) tiers[r]++;
    });
    return tiers;
  }, [forecasts]);

  const filtered = useMemo(() => {
    const matched = forecasts.filter((c) => matchesFilters(c, activeFilters));
    return sortCustomers(matched, sortBy);
  }, [forecasts, activeFilters, sortBy]);

  const compareCustomers = useMemo(
    () => forecasts.filter((c) => compareSelected.includes(c.id)),
    [forecasts, compareSelected]
  );

  const toggleFilter = (id) => {
    if (id === 'all') {
      setActiveFilters(['all']);
      return;
    }
    setActiveFilters((prev) => {
      const withoutAll = prev.filter((f) => f !== 'all');
      const next = withoutAll.includes(id)
        ? withoutAll.filter((f) => f !== id)
        : [...withoutAll, id];
      return next.length === 0 ? ['all'] : next;
    });
  };

  const handleCompareToggle = (id) => {
    setCompareSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  return (
    <div
      className="relative min-h-full -m-6 mirrormind-page"
      style={{ background: '#0B0F1A' }}
    >
      <MirrorMindBackground />

      <div className="relative z-[1] p-6 space-y-12">
        <div id="mm-overview" className="scroll-mt-24 space-y-6">
          <header className="relative overflow-hidden rounded-2xl mirrormind-glass mirrormind-grid-bg mirrormind-scan">
            <div className="absolute inset-0 bg-gradient-to-br from-teal/10 via-transparent to-saffron/10 pointer-events-none" />
            <div className="relative px-6 py-10 lg:py-14 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal/30 bg-teal/10 mb-5">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse-live" />
                <span className="font-mono text-[10px] text-teal tracking-[0.2em] uppercase">
                  Live · Nagpur Branch · Engine v2.4
                </span>
              </div>

              <p className="font-mono text-[11px] text-teal/80 tracking-[0.25em] uppercase mb-3">
                MIRRORMIND ENGINE · LSTM + PROPHET · 60–90 DAY HORIZON
              </p>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[56px] leading-[1.1] mb-4">
                <span className="mirrormind-gradient-text">Cash Flow Intelligence</span>
              </h1>

              <p className="text-muted max-w-2xl mx-auto text-sm lg:text-base leading-relaxed">
                MirrorMind reads <strong className="text-text-primary font-normal">12 months</strong>{' '}
                of transaction history, life events, and local economic signals to forecast when
                each customer will need money — and when they&apos;ll have it.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {[
                  { icon: Zap, text: '60–90 day forecast horizon' },
                  { icon: Activity, text: 'Weekly recalibration' },
                  { icon: Target, text: 'Cohort-benchmarked accuracy' },
                ].map(({ icon: Icon, text }) => (
                  <span
                    key={text}
                    className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full border border-border/80 bg-surface/50 text-muted"
                  >
                    <Icon size={13} className="text-teal" />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-3 px-6 pb-6">
              <LiveStatCard
                label="Active Forecasts"
                numericValue={forecasts.length}
                sub="Nagpur branch cohort"
                accent="teal"
                icon={Brain}
              />
              <LiveStatCard
                label="Avg Confidence"
                numericValue={stats.avgConf}
                formatFn={(n) => `${n}%`}
                sub="Model certainty score"
                accent="teal"
                icon={Sparkles}
              />
              <LiveStatCard
                label="Surplus Identified"
                numericValue={stats.totalSurplus}
                formatFn={formatCurrency}
                sub="Across peak windows"
                accent="saffron"
                icon={TrendingUp}
              />
              <LiveStatCard
                label="Act-Now Windows"
                numericValue={stats.actNow}
                sub={`${stats.highRisk} high cash-gap risk`}
                accent="danger"
                icon={Clock}
              />
            </div>
          </header>

          <SignalExplorer />

          <nav
            className="sticky top-0 z-20 flex items-center gap-1 px-4 py-2 rounded-xl border border-border backdrop-blur-md scroll-mt-14"
            style={{ background: 'rgba(11, 15, 26, 0.95)' }}
          >
            {SUB_NAV.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className={`relative px-4 py-2 text-sm font-body transition-colors ${
                  activeSection === id ? 'text-saffron' : 'text-muted hover:text-text-primary'
                }`}
              >
                {label}
                {activeSection === id && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-saffron rounded-full" />
                )}
              </button>
            ))}
          </nav>

          <div className="overflow-hidden rounded-xl border border-border/60 bg-surface/40 backdrop-blur-sm py-2">
            <div className="flex animate-ticker whitespace-nowrap">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span key={i} className="inline-flex items-center mx-6 text-[11px] text-muted font-mono">
                  <Radio size={10} className="text-teal mr-2 shrink-0" />
                  {item}
                  <span className="mx-6 text-border">|</span>
                </span>
              ))}
            </div>
          </div>

          <section>
            <SectionHeader
              eyebrow="Architecture"
              title="How MirrorMind Works"
              subtitle="Seven signal sources feed a dual-model pipeline — LSTM for sequences, Prophet for seasonality — producing actionable cash-flow intelligence per customer."
              icon={Database}
            />

            <div className="grid lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 items-stretch">
              <div className="mirrormind-glass rounded-2xl p-5 mirrormind-glow-teal">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-teal/20 flex items-center justify-center">
                    <Database size={16} className="text-teal" />
                  </div>
                  <h3 className="font-display font-semibold text-teal">What goes in</h3>
                </div>
                <ul className="space-y-2">
                  {INPUT_SIGNALS.map((signal) => (
                    <InputSignalRow key={signal.label} signal={signal} />
                  ))}
                </ul>
              </div>

              <div className="hidden lg:flex items-center justify-center text-teal/40">
                <ArrowRight size={24} />
              </div>

              <div className="mirrormind-glass rounded-2xl p-5 border-saffron/30 mirrormind-glow-saffron lg:-translate-y-1">
                <div className="flex items-center gap-2 mb-4 justify-center">
                  <div className="w-8 h-8 rounded-lg bg-saffron/20 flex items-center justify-center">
                    <Brain size={16} className="text-saffron" />
                  </div>
                  <h3 className="font-display font-semibold text-saffron">MirrorMind Model</h3>
                </div>

                <div className="flex justify-center mb-5">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-saffron/30 to-saffron/5 border-2 border-saffron flex items-center justify-center animate-mirror-pulse">
                      <span className="font-display font-bold text-3xl text-saffron">M</span>
                    </div>
                    <div className="absolute inset-0 rounded-full border border-saffron/20 animate-ping opacity-20" />
                  </div>
                </div>

                <div className="space-y-2">
                  {MODEL_STEPS.map((step, i) => (
                    <div
                      key={step.name}
                      className="flex items-start gap-2 p-2 rounded-lg bg-elevated/30 border border-border/50"
                    >
                      <span className="text-[10px] font-mono text-saffron/70 mt-0.5 w-4">{i + 1}</span>
                      <div>
                        <p className="text-xs font-medium text-text-primary">{step.name}</p>
                        <p className="text-[10px] text-muted">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden lg:flex items-center justify-center text-success/40">
                <ArrowRight size={24} />
              </div>

              <div className="mirrormind-glass rounded-2xl p-5 border-success/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                    <Target size={16} className="text-success" />
                  </div>
                  <h3 className="font-display font-semibold text-success">What comes out</h3>
                </div>
                <ul className="space-y-2">
                  {OUTPUT_SIGNALS.map(({ icon, label, metric }) => (
                    <li
                      key={label}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-elevated/40 transition-colors"
                    >
                      <span className="flex items-center gap-2 text-xs text-muted">
                        <span>{icon}</span>
                        {label}
                      </span>
                      <span className="text-[9px] font-mono text-success/80 bg-success/10 px-1.5 py-0.5 rounded border border-success/20">
                        {metric}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        <section id="mm-forecasts" className="scroll-mt-24">
          <SectionHeader
            eyebrow="Live Dashboard"
            title="Active Customer Forecasts"
            subtitle="8 customers · Nagpur Branch · Last recalibrated Today 5:00 PM IST"
            icon={Activity}
          />

          <div className="mirrormind-glass rounded-xl p-4 mb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted font-mono uppercase tracking-wider">
                Branch cash-gap risk distribution
              </p>
              <span className="text-[10px] text-teal flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-live" />
                Live
              </span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
              {[
                { key: 'Very Low', color: 'bg-success', count: riskDistribution['Very Low'] },
                { key: 'Low', color: 'bg-teal', count: riskDistribution.Low },
                { key: 'Medium', color: 'bg-amber', count: riskDistribution.Medium },
                { key: 'High', color: 'bg-danger', count: riskDistribution.High },
              ].map(
                ({ key, color, count }) =>
                  count > 0 && (
                    <div
                      key={key}
                      className={`${color} transition-all`}
                      style={{ flex: count }}
                      title={`${key}: ${count}`}
                    />
                  )
              )}
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              {Object.entries(riskDistribution).map(([tier, count]) => (
                <span key={tier} className="text-[10px] text-muted">
                  <span className="font-mono text-text-primary">{count}</span> {tier}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="flex items-center gap-1 p-1 rounded-lg border border-border/60 bg-surface/40">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-teal/20 text-teal' : 'text-muted hover:text-text-primary'
                }`}
                aria-label="Grid view"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-teal/20 text-teal' : 'text-muted hover:text-text-primary'
                }`}
                aria-label="List view"
              >
                <LayoutList size={16} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 flex-1">
              {FILTER_CHIPS.map((f) => {
                const active =
                  f.id === 'all' ? activeFilters.includes('all') : activeFilters.includes(f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFilter(f.id)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      active
                        ? 'bg-teal/20 text-teal border-teal/40 shadow-[0_0_12px_rgba(14,165,233,0.2)]'
                        : 'bg-surface/50 text-muted border-border hover:border-teal/30 hover:text-text-primary'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-border bg-surface/60 text-text-primary font-mono"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  Sort: {opt.label}
                </option>
              ))}
            </select>

            <span className="text-xs text-muted font-mono whitespace-nowrap">
              Showing {filtered.length} of {forecasts.length}
            </span>
          </div>

          {compareSelected.length > 0 && (
            <p className="text-[11px] text-teal font-mono mb-3">
              {compareSelected.length}/2 selected for comparison
              {compareSelected.length === 2 && ' — panel open below'}
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="mirrormind-glass rounded-xl p-12 text-center text-muted">
              No customers match this filter.
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid lg:grid-cols-2 gap-5' : 'flex flex-col gap-4'}>
              {filtered.map((customer, i) => (
                <CustomerForecastCard
                  key={customer.id}
                  customer={customer}
                  index={i}
                  viewMode={viewMode}
                  compareSelected={compareSelected}
                  onCompareToggle={handleCompareToggle}
                  compareDisabled={compareSelected.length >= 2}
                />
              ))}
            </div>
          )}
        </section>

        <section id="mm-validation" className="scroll-mt-24">
          <SectionHeader
            eyebrow="Intellectual Honesty"
            title="How We Validate MirrorMind"
            subtitle="We don't claim production accuracy in Phase 1 — we demonstrate architecture and signal logic. Real benchmarks come with SBI transaction data."
          />

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-saffron via-teal to-muted hidden md:block" />
            <div className="space-y-4">
              {VALIDATION_PHASES.map((item) => (
                <ValidationPhase key={item.phase} item={item} />
              ))}
            </div>
          </div>

          <p className="text-xs text-muted italic mt-5 max-w-3xl border-l-2 border-teal/30 pl-4 md:ml-16">
            MirrorMind does not claim production accuracy. Phase 1 validates the architecture. Real
            accuracy will be established in Phase 2 with SBI transaction data.
          </p>
        </section>

        <section id="mm-benchmark" className="scroll-mt-24">
          <SectionHeader
            eyebrow="Competitive Edge"
            title="Why MirrorMind vs. Alternatives"
            subtitle="Purpose-built for Indian banking — not a generic chatbot wrapper."
          />

          <div className="mirrormind-glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-elevated/60">
                  <th className="text-left p-4 font-display font-medium text-muted text-xs uppercase tracking-wider">
                    Capability
                  </th>
                  <th className="text-left p-4 font-display font-medium text-muted text-xs uppercase tracking-wider">
                    SBI / YONO
                  </th>
                  <th className="text-left p-4 font-display font-medium text-muted text-xs uppercase tracking-wider">
                    Generic AI
                  </th>
                  <th className="text-left p-4 font-display font-medium text-teal text-xs uppercase tracking-wider bg-teal/5">
                    MirrorMind ✦
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    cap: 'Cash flow forecasting',
                    sbi: '✗ Not available',
                    ai: '✗ Not available',
                    mm: '✓ 60-90 days',
                  },
                  {
                    cap: 'Life event detection',
                    sbi: '✗ None',
                    ai: '⚡ Basic triggers',
                    mm: '✓ 6 life events',
                  },
                  {
                    cap: 'Local economic signals',
                    sbi: '✗ None',
                    ai: '✗ None',
                    mm: '✓ Agmarknet + MSP',
                  },
                  {
                    cap: 'Proactive outreach timing',
                    sbi: '✗ Generic schedule',
                    ai: '⚡ Rule-based',
                    mm: '✓ Optimal window',
                  },
                  {
                    cap: 'Indian language support',
                    sbi: '⚡ Hindi + English',
                    ai: '⚡ English primary',
                    mm: '✓ 22 languages',
                  },
                  {
                    cap: 'Confidence scoring',
                    sbi: '✗ None',
                    ai: '✗ None',
                    mm: '✓ 4-tier system',
                  },
                ].map((row) => (
                  <tr
                    key={row.cap}
                    className="border-b border-border/60 last:border-0 hover:bg-elevated/20 transition-colors"
                  >
                    <td className="p-4 font-medium text-text-primary">{row.cap}</td>
                    <td className={`p-4 text-xs ${cellClass(row.sbi)}`}>{row.sbi}</td>
                    <td className={`p-4 text-xs ${cellClass(row.ai)}`}>{row.ai}</td>
                    <td className={`p-4 text-xs font-semibold bg-teal/5 ${cellClass(row.mm)}`}>
                      {row.mm}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 mirrormind-glass rounded-xl p-4 border-teal/20">
            <div>
              <p className="font-display font-semibold text-sm text-text-primary">
                Ready to act on a forecast?
              </p>
              <p className="text-xs text-muted mt-0.5">
                Jump to the alert queue to approve outreach for high-confidence windows.
              </p>
            </div>
            <Link
              to="/alert-queue"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-saffron to-orange-500 text-white text-sm font-medium shadow-lg shadow-saffron/25 hover:shadow-saffron/40 hover:scale-[1.02] transition-all"
            >
              Open Alert Queue <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showCompare && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => {
                setShowCompare(false);
                setCompareSelected([]);
              }}
            />
            <ComparePanel
              customers={compareCustomers}
              onClose={() => {
                setShowCompare(false);
                setCompareSelected([]);
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
