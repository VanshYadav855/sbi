import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Bell, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import DemoGuideModal from '../modals/DemoGuideModal';

function StatPill({ emoji, count, label, colorClass, pulseKey }) {
  return (
    <motion.div
      key={pulseKey}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs font-body whitespace-nowrap ${colorClass}`}
    >
      <span>{emoji}</span>
      <span className="font-mono font-medium">{count}</span>
      <span className="text-muted hidden lg:inline">{label}</span>
    </motion.div>
  );
}

export default function TopBar() {
  const location = useLocation();
  const { id } = useParams();
  const { stats, getCustomerById } = useApp();
  const { theme, setTheme } = useTheme();
  const [guideOpen, setGuideOpen] = useState(false);

  const getTitle = () => {
    if (location.pathname.startsWith('/customer/')) {
      const customer = id ? getCustomerById(id) : null;
      return customer ? `Customer Detail — ${customer.name}` : 'Customer Detail';
    }
    if (location.pathname === '/alert-queue') return 'Alert Queue — Approvals';
    if (location.pathname === '/scam-log') return 'Scam Monitor — SahayakShield';
    if (location.pathname === '/analytics') return 'Analytics';
    if (location.pathname === '/customers') return 'All Customers';
    if (location.pathname === '/mirrormind') return 'MirrorMind — Cash Flow Intelligence';
    return 'Dashboard';
  };

  return (
    <>
      <header className="topbar-glass sticky top-0 z-30 h-14 border-b border-border flex items-center px-6 gap-4">
        <h2 className="font-display font-semibold text-lg text-text-primary min-w-[140px] truncate">
          {getTitle()}
        </h2>

        <div className="flex-1 flex items-center justify-center gap-2 flex-wrap">
          <StatPill
            emoji="🟠"
            count={stats.pendingApprovals}
            label="Pending Approvals"
            colorClass="text-saffron"
            pulseKey={`pending-${stats.pendingApprovals}`}
          />
          <StatPill
            emoji="🔴"
            count={stats.scamsBlockedToday}
            label="Scams Blocked Today"
            colorClass="text-danger"
            pulseKey={`scams-${stats.scamsBlockedToday}`}
          />
          <StatPill
            emoji="🟢"
            count={stats.offersAccepted}
            label="Offers Accepted"
            colorClass="text-success"
            pulseKey={`offers-${stats.offersAccepted}`}
          />
          <StatPill
            emoji="🔵"
            count={stats.disbursedToday}
            label="Disbursed Today"
            colorClass="text-teal"
            pulseKey={`disbursed-${stats.disbursedToday}`}
          />
        </div>

        <div className="flex items-center gap-2 min-w-[200px] justify-end">
          <div className="flex items-center gap-2 text-xs font-body hidden sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success animate-pulse-live" />
            </span>
            <span className="text-success font-medium">Live</span>
          </div>

          <div
            className="flex items-center rounded-lg border border-border p-0.5 bg-elevated/40"
            role="group"
            aria-label="Theme"
          >
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-md transition-colors ${
                theme === 'dark'
                  ? 'bg-surface text-teal shadow-sm'
                  : 'text-muted hover:text-text-primary'
              }`}
              aria-label="Dark mode"
              aria-pressed={theme === 'dark'}
            >
              <Moon size={14} />
            </button>
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-md transition-colors ${
                theme === 'light'
                  ? 'bg-surface text-saffron shadow-sm'
                  : 'text-muted hover:text-text-primary'
              }`}
              aria-label="Light mode"
              aria-pressed={theme === 'light'}
            >
              <Sun size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="px-2.5 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-text-primary hover:bg-elevated/60 transition-colors whitespace-nowrap hidden md:inline-flex"
          >
            📖 Demo Guide
          </button>

          <button
            type="button"
            className="p-2 rounded-lg hover:bg-elevated/60 text-muted hover:text-text-primary transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
        </div>
      </header>

      <DemoGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </>
  );
}
