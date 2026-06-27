import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import JeevanScoreGauge from '../components/dashboard/JeevanScoreGauge';
import { getAvatarColor, getStatusColor } from '../utils/format';

export default function Customers() {
  const { customerList } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-xl text-text-primary">
          All Customers — Nagpur Branch · {customerList.length} accounts monitored by SahayakAI
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {customerList.map((customer) => (
          <div
            key={customer.id}
            className="rounded-xl border border-border bg-surface p-4 hover:border-teal/40 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-mono font-medium shrink-0 ${getAvatarColor(customer.confidence)}`}
              >
                {customer.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-sm truncate">{customer.name}</h3>
                <p className="text-xs text-muted truncate">{customer.location}</p>
                <div className="flex items-center justify-between mt-3">
                  <JeevanScoreGauge
                    score={customer.jeevanScore}
                    confidence={customer.confidence}
                    size={52}
                  />
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border font-medium ${getStatusColor(customer.status)}`}
                  >
                    {customer.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <Link
                  to={`/customer/${customer.id}`}
                  className="inline-block mt-3 text-xs text-teal hover:text-teal/80 transition-colors"
                >
                  View Detail →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
