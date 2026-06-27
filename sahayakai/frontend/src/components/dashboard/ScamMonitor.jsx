import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import ScamDetailModal from '../modals/ScamDetailModal';

export default function ScamMonitor() {
  const { scamList, stats } = useApp();
  const [selectedScam, setSelectedScam] = useState(null);

  return (
    <>
      <div className="card-vibrant rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-gradient-to-r from-danger/10 to-transparent">
          <h3 className="font-display font-semibold text-sm">
            🛡 SahayakShield — Scam Monitor
          </h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-danger/15 text-danger border border-danger/30 font-mono">
            {stats.scamsBlockedToday} blocked today
          </span>
        </div>

        <div className="max-h-[420px] overflow-y-auto divide-y divide-border">
          {scamList.map((scam, index) => (
            <motion.div
              key={scam.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 border-l-4 ${
                scam.status === 'BLOCKED' ? 'border-l-danger' : 'border-l-amber'
              } ${scam.isNew ? 'animate-border-flash bg-danger/5' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {scam.targetCustomer}
                  </p>
                  <p className="text-[11px] text-muted font-mono">{scam.accountNo}</p>
                  <p className="text-[10px] text-muted mt-0.5">{scam.attemptTime}</p>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-medium shrink-0 ${
                    scam.status === 'BLOCKED'
                      ? 'bg-danger/15 text-danger border border-danger/30'
                      : 'bg-amber/15 text-amber border border-amber/30'
                  }`}
                >
                  {scam.status}
                </span>
              </div>

              <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded bg-elevated text-text-primary border border-border">
                {scam.type}
              </span>

              {scam.amountAttempted != null && (
                <p className="text-xs text-muted mt-1.5">
                  Attempted: <span className="font-mono text-danger">{formatCurrency(scam.amountAttempted)}</span>
                </p>
              )}

              <p className="text-[10px] text-muted italic mt-1.5">{scam.method}</p>

              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-danger/10 text-danger">
                  Risk: {scam.riskScore}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedScam(scam)}
                  className="text-[11px] text-teal hover:text-teal/80 transition-colors"
                >
                  Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedScam && (
        <ScamDetailModal scam={selectedScam} onClose={() => setSelectedScam(null)} />
      )}
    </>
  );
}
