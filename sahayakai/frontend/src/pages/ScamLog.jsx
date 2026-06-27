import { useState, useMemo } from 'react';
import { ShieldOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/format';
import ScamDetailModal from '../components/modals/ScamDetailModal';

const FILTERS = ['All', 'BLOCKED', 'FLAGGED'];

function getTypeBadgeClass(type) {
  if (type.includes('Impersonation') || type.includes('OTP')) {
    return 'bg-danger/15 text-danger border-danger/30';
  }
  return 'bg-saffron/15 text-saffron border-saffron/30';
}

function getRiskColor(score) {
  if (score > 85) return 'text-danger';
  if (score >= 70) return 'text-amber';
  return 'text-yellow-400';
}

export default function ScamLog() {
  const { scamList } = useApp();
  const [selectedScam, setSelectedScam] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const blockedCount = scamList.filter((s) => s.status === 'BLOCKED').length;
  const flaggedCount = scamList.filter((s) => s.status === 'FLAGGED').length;
  const amountProtected = scamList.reduce((sum, s) => sum + (s.amountAttempted || 0), 0);
  const avgRiskScore = scamList.length
    ? Math.round(scamList.reduce((sum, s) => sum + s.riskScore, 0) / scamList.length)
    : 0;

  const filteredScams = useMemo(() => {
    const sorted = [...scamList].sort((a, b) => b.riskScore - a.riskScore);
    if (activeFilter === 'All') return sorted;
    return sorted.filter((s) => s.status === activeFilter);
  }, [scamList, activeFilter]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted">
          SahayakShield automatically intercepts suspicious calls and messages targeting SBI
          customers. No customer action needed — blocks happen in real time.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">🔴 Scams Blocked Today</p>
          <p className="font-mono text-2xl font-medium text-danger mt-1">{blockedCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">🟡 Flagged (Under Review)</p>
          <p className="font-mono text-2xl font-medium text-amber mt-1">{flaggedCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">💰 Total Amount Protected</p>
          <p className="font-mono text-2xl font-medium text-success mt-1">
            {formatCurrency(amountProtected)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">📊 Avg Risk Score</p>
          <p className="font-mono text-2xl font-medium text-text-primary mt-1">{avgRiskScore}</p>
        </div>
      </div>

      <p className="text-xs text-muted">
        How we detect scams: TRAI number verification · Zero-Ask Promise monitoring · UPI pattern
        analysis · Truecaller SBI badge verification
      </p>

      <div className="flex gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              activeFilter === filter
                ? 'border-saffron text-saffron bg-saffron/10'
                : 'border-border text-muted hover:text-text-primary hover:bg-elevated/40'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        {filteredScams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted">
            <ShieldOff size={40} className="mb-3 opacity-40" />
            <p className="text-sm">No scams matching this filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-elevated/40">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted">Time</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted">Account</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted">
                    Amount Attempted
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted">Method</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted">
                    Risk Score
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredScams.map((scam) => (
                  <tr key={scam.id} className="hover:bg-elevated/20 transition-colors">
                    <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">
                      {scam.attemptTime}
                    </td>
                    <td className="px-4 py-3 font-medium">{scam.targetCustomer}</td>
                    <td className="px-4 py-3 text-muted text-xs font-mono">{scam.accountNo}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border ${getTypeBadgeClass(scam.type)}`}
                      >
                        {scam.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-danger">
                      {scam.amountAttempted != null
                        ? formatCurrency(scam.amountAttempted)
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted italic max-w-[180px]">
                      {scam.method}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-xs ${getRiskColor(scam.riskScore)}`}>
                        {scam.riskScore}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          scam.status === 'BLOCKED'
                            ? 'bg-danger/15 text-danger'
                            : 'bg-amber/15 text-amber'
                        }`}
                      >
                        {scam.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setSelectedScam(scam)}
                        className="text-xs text-teal hover:text-teal/80 transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-muted text-center">
        SahayakShield · Zero-Ask Promise active · All outbound calls TRAI-verified
      </p>

      {selectedScam && (
        <ScamDetailModal scam={selectedScam} onClose={() => setSelectedScam(null)} />
      )}
    </div>
  );
}
