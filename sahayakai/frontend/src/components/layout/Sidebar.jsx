import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Bell,
  Shield,
  Users,
  BarChart2,
  TrendingUp,
  Settings,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/alert-queue', icon: Bell, label: 'Alert Queue', badge: true },
  { to: '/scam-log', icon: Shield, label: 'Scam Monitor' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/mirrormind', icon: TrendingUp, label: 'MirrorMind', newBadge: true },
  { to: null, icon: Settings, label: 'Settings', disabled: true, tooltip: 'Coming Soon' },
];

const activeClass =
  'bg-gradient-to-r from-saffron/15 to-transparent text-text-primary border-l-[3px] border-saffron pl-[9px] shadow-sm';
const inactiveClass =
  'text-muted hover:text-text-primary hover:bg-elevated/50 border-l-[3px] border-transparent pl-[9px]';

export default function Sidebar() {
  const { stats, newAlertPulse } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('sbi_auth');
    navigate('/login');
  };

  return (
    <aside className="sidebar-glass fixed left-0 top-0 h-screen w-[240px] border-r border-border flex flex-col z-40">
      <div className="px-5 py-6 border-b border-border">
        <h1 className="font-display font-bold text-xl logo-gradient tracking-tight">
          SahayakAI
        </h1>
        <p className="text-xs text-muted mt-0.5 font-body">SBI Internal · Nagpur</p>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.disabled) {
            return (
              <div
                key={item.label}
                title={item.tooltip || 'Coming Soon'}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted/50 cursor-not-allowed opacity-50"
              >
                <Icon size={18} />
                <span className="text-sm font-body">{item.label}</span>
                <span className="ml-auto text-[10px] bg-elevated px-1.5 py-0.5 rounded text-muted">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all relative ${
                  isActive ? activeClass : inactiveClass
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-saffron' : ''} />
                  <span>{item.label}</span>
                  {item.newBadge && (
                    <span className="ml-auto text-[9px] font-medium px-1.5 py-0.5 rounded bg-saffron/20 text-saffron border border-saffron/30">
                      NEW
                    </span>
                  )}
                  {item.badge && stats.pendingApprovals > 0 && (
                    <span
                      className={`ml-auto min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[11px] font-mono font-medium rounded-full bg-gradient-to-r from-danger to-red-600 text-white shadow-sm ${
                        newAlertPulse ? 'animate-pulse-badge' : ''
                      }`}
                    >
                      {stats.pendingApprovals}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-xl glass-panel">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal/30 to-teal/10 border border-teal/40 flex items-center justify-center text-xs font-mono font-medium text-teal">
            AO
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">Amit Oberoi</p>
            <p className="text-[11px] text-muted truncate">Branch Officer · Nagpur</p>
            <p className="text-[11px] text-success flex items-center gap-1 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-success animate-pulse-live" />
              Online
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 w-full text-center text-[11px] text-muted hover:text-danger transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
