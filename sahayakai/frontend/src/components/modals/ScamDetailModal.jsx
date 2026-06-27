import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../../utils/format';
import { useToast } from '../../context/ToastContext';

export default function ScamDetailModal({ scam, onClose }) {
  const { showToast } = useToast();

  const timeline = [
    {
      step: 1,
      text: `Caller attempted ${scam.type.toLowerCase()} targeting ${scam.targetCustomer}`,
      detail: scam.callerNumber,
    },
    {
      step: 2,
      text: 'SahayakShield detection engine triggered',
      detail: scam.method,
    },
    {
      step: 3,
      text: `Intercept ${scam.status.toLowerCase()} — customer protected`,
      detail: scam.amountAttempted
        ? `Amount protected: ${formatCurrency(scam.amountAttempted)}`
        : 'No funds transferred',
    },
  ];

  const riskExplanation =
    scam.riskScore >= 90
      ? 'Critical risk — multiple fraud indicators matched including unverified caller identity and suspicious request pattern.'
      : scam.riskScore >= 75
        ? 'High risk — significant fraud signals detected. Immediate block recommended.'
        : 'Moderate risk — suspicious pattern detected. Flagged for monitoring.';

  const handleAction = (action) => {
    showToast(`${action} — ${scam.targetCustomer} · ${scam.id}`, 'success');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="relative w-full max-w-md rounded-xl bg-elevated border border-border shadow-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-display font-semibold text-lg">Scam Intercept Detail</h2>
            <p className="text-xs text-muted mt-1 font-mono">{scam.id}</p>
          </div>

          <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{scam.targetCustomer}</p>
                <p className="text-xs text-muted font-mono">{scam.accountNo}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded font-medium ${
                  scam.status === 'BLOCKED'
                    ? 'bg-danger/15 text-danger'
                    : 'bg-amber/15 text-amber'
                }`}
              >
                {scam.status}
              </span>
            </div>

            <div>
              <h3 className="text-xs text-muted uppercase tracking-wider mb-3">Timeline</h3>
              <div className="space-y-3">
                {timeline.map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-danger/15 text-danger flex items-center justify-center text-xs font-mono shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm">{item.text}</p>
                      <p className="text-xs text-muted mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-surface border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted">Risk Score</span>
                <span className="font-mono text-lg text-danger">{scam.riskScore}</span>
              </div>
              <p className="text-xs text-muted">{riskExplanation}</p>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleAction('Marked resolved')}
              className="flex-1 min-w-[120px] py-2 rounded-lg bg-success/15 text-success border border-success/30 text-xs font-medium hover:bg-success/25 transition-colors"
            >
              Mark Resolved
            </button>
            <button
              type="button"
              onClick={() => handleAction('Reported to SBI Fraud Team')}
              className="flex-1 min-w-[120px] py-2 rounded-lg bg-danger/15 text-danger border border-danger/30 text-xs font-medium hover:bg-danger/25 transition-colors"
            >
              Report to SBI Fraud Team
            </button>
            <button
              type="button"
              onClick={() => handleAction('Customer notified')}
              className="flex-1 min-w-[120px] py-2 rounded-lg border border-border text-xs text-muted hover:bg-surface transition-colors"
            >
              Notify Customer
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
