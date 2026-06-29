import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Bell, Shield, TrendingUp, Users, Zap } from 'lucide-react';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import ScamMonitor from '../components/dashboard/ScamMonitor';
import DemoDataTag from '../components/DemoDataTag';
import { useApp } from '../context/AppContext';
import { useAlertQueue } from '../hooks/useAlertQueue';
import { formatCurrency } from '../utils/format';

const forecastSignals = [
  'Ramesh Patil — +₹42,000 surplus in week 6 (Working Capital)',
  'Mohammed Rafi — Festival spend spike in 9 days (Overdraft)',
  'Lakshmi Devi — Income +40% next 45 days (KCC increase)',
];

const statCards = (stats) => [
  {
    label: 'Pending Approvals',
    value: stats.pendingApprovals,
    icon: Bell,
    gradient: 'from-saffron/20 to-saffron/5',
    border: 'border-saffron/30',
    text: 'text-saffron',
    link: '/alert-queue',
  },
  {
    label: 'Scams Blocked',
    value: stats.scamsBlockedToday,
    icon: Shield,
    gradient: 'from-danger/20 to-danger/5',
    border: 'border-danger/30',
    text: 'text-danger',
    link: '/scam-log',
  },
  {
    label: 'Offers Accepted',
    value: stats.offersAccepted,
    icon: TrendingUp,
    gradient: 'from-success/20 to-success/5',
    border: 'border-success/30',
    text: 'text-success',
    link: '/analytics',
  },
  {
    label: 'Disbursed Today',
    value: stats.disbursedToday,
    icon: Zap,
    gradient: 'from-teal/20 to-teal/5',
    border: 'border-teal/30',
    text: 'text-teal',
    link: '/analytics',
  },
];

export default function Dashboard() {
  const { stats } = useApp();
  const { sortedCustomers, pendingCount } = useAlertQueue();
  const topPending = sortedCustomers
    .filter((c) => c.status === 'PENDING_APPROVAL')
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <WelcomeBanner />
      <DemoDataTag className="mt-0" />

      {/* Hero */}
      <div className="glass-panel rounded-2xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal/10 via-transparent to-saffron/10 pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-xs font-medium text-teal uppercase tracking-wider mb-1">
              Nagpur Branch · Live
            </p>
            <h1 className="font-display font-bold text-2xl lg:text-3xl text-text-primary">
              Good morning, Amit 👋
            </h1>
            <p className="text-sm text-muted mt-2 max-w-xl">
              SahayakAI is actively monitoring {sortedCustomers.length} customers. You have{' '}
              <span className="text-saffron font-semibold">{pendingCount} approvals</span> waiting
              and SahayakShield is protecting your branch in real time.
            </p>
          </div>
          <Link
            to="/alert-queue"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-saffron to-orange-500 text-white font-medium text-sm shadow-lg shadow-saffron/25 hover:shadow-saffron/40 hover:scale-[1.02] transition-all shrink-0"
          >
            Open Alert Queue
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards(stats).map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={card.link}
                className={`card-vibrant block rounded-xl border ${card.border} bg-gradient-to-br ${card.gradient} p-4 hover:scale-[1.02] transition-transform`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon size={18} className={card.text} />
                  <span className={`font-mono text-2xl font-bold ${card.text}`}>{card.value}</span>
                </div>
                <p className="text-xs text-muted">{card.label}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Priority preview */}
        <div className="lg:w-[58%] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2">
              <Users size={18} className="text-teal" />
              Today&apos;s Priorities
            </h2>
            <Link
              to="/alert-queue"
              className="text-xs text-teal hover:text-teal/80 flex items-center gap-1"
            >
              View full queue <ArrowRight size={12} />
            </Link>
          </div>

          {topPending.length === 0 ? (
            <div className="card-vibrant rounded-xl p-8 text-center text-muted">
              <p className="text-success font-medium">✓ All clear — no pending approvals</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topPending.map((c, i) => (
                <Link
                  key={c.id}
                  to={`/customer/${c.id}`}
                  className="card-vibrant flex items-center gap-4 rounded-xl p-4 hover:border-teal/40 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-saffron/20 border border-saffron/40 flex items-center justify-center text-xs font-mono text-saffron shrink-0">
                    {c.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm group-hover:text-teal transition-colors">
                      {c.name}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {c.recommendation} · {formatCurrency(c.eligibleAmount)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-lg font-bold text-saffron">{c.jeevanScore}</p>
                    <p className="text-[10px] text-muted">JeevanScore</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="lg:w-[42%] space-y-4">
          <ScamMonitor />

          <div className="card-vibrant rounded-xl p-4">
            <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse-live" />
              MirrorMind — Forecast Signals
            </h3>
            <ul className="space-y-2">
              {forecastSignals.map((signal) => (
                <li
                  key={signal}
                  className="text-xs text-muted flex items-start gap-2 pl-1 border-l-2 border-teal/40 py-1"
                >
                  {signal}
                </li>
              ))}
            </ul>
            <Link
              to="/mirrormind"
              className="mt-3 inline-flex items-center gap-1 text-xs text-teal hover:text-teal/80"
            >
              View Full MirrorMind <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
