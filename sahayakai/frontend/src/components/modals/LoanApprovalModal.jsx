import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JeevanScoreGauge from '../dashboard/JeevanScoreGauge';
import { formatCurrency } from '../../utils/format';
import { useApp } from '../../context/AppContext';

export default function LoanApprovalModal({ customer, onClose }) {
  const { approveCustomer } = useApp();
  const [confirmed, setConfirmed] = useState(false);
  const [notes, setNotes] = useState('');

  const handleApprove = () => {
    if (!confirmed) return;
    approveCustomer(customer.id);
    onClose();
  };

  const confidenceText = {
    HIGH: 'HIGH confidence based on 3 life events and local economic signals',
    MEDIUM: 'MEDIUM confidence based on 2 life events and regional patterns',
    LOW: 'LOW confidence — review recommended before approval',
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
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-elevated border border-border shadow-2xl"
        >
          <div className="sticky top-0 bg-elevated px-6 py-4 border-b border-border z-10">
            <h2 className="font-display font-semibold text-lg">
              Loan Approval — {customer.name}
            </h2>
          </div>

          <div className="p-6 space-y-6">
            <section>
              <h3 className="text-xs font-body font-medium text-muted uppercase tracking-wider mb-3">
                AI Summary
              </h3>
              <div className="flex items-center gap-6">
                <JeevanScoreGauge
                  score={customer.jeevanScore}
                  confidence={customer.confidence}
                  size={160}
                />
                <div className="flex-1 space-y-2">
                  <p className="text-xs text-muted">Life Event Triggers</p>
                  <ul className="space-y-1">
                    {customer.triggers.map((t) => (
                      <li key={t} className="text-sm flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-teal" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-sm text-teal mt-3 font-mono">{customer.mirrorMindForecast}</p>
              <p className="text-xs text-muted mt-2">
                SahayakAI recommends this with{' '}
                {confidenceText[customer.confidence] || confidenceText.MEDIUM}.
              </p>
            </section>

            <section>
              <h3 className="text-xs font-body font-medium text-muted uppercase tracking-wider mb-3">
                Loan Details
              </h3>
              <div className="space-y-2 text-sm bg-surface rounded-lg p-4 border border-border">
                <div className="flex justify-between">
                  <span className="text-muted">Product</span>
                  <span>{customer.product}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Eligible Amount</span>
                  <span className="font-mono text-saffron">
                    {formatCurrency(customer.eligibleAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Outreach</span>
                  <span className="text-right text-xs">
                    {customer.outreachChannel?.replace(/\([^)]*\)/, '')?.trim()} ·{' '}
                    {customer.language} · Customer confirmed &quot;Haan&quot;
                  </span>
                </div>
                <div className="flex justify-between text-success">
                  <span className="text-muted">Channel Verified</span>
                  <span>✓ TRAI-registered number</span>
                </div>
                <div className="flex justify-between text-success">
                  <span className="text-muted">Dual Channel</span>
                  <span>✓ YONO push + voice match</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-body font-medium text-muted uppercase tracking-wider mb-3">
                Officer Action
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Officer notes (optional)"
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-muted focus:outline-none focus:border-teal/50 resize-none"
              />
              <label className="flex items-center gap-2 mt-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="rounded border-border bg-surface text-saffron focus:ring-saffron"
                />
                <span>I confirm this recommendation has been reviewed</span>
              </label>
            </section>
          </div>

          <div className="sticky bottom-0 bg-elevated px-6 py-4 border-t border-border flex gap-3">
            <button
              type="button"
              onClick={handleApprove}
              disabled={!confirmed}
              className="flex-1 py-3 rounded-lg bg-saffron text-white font-medium hover:bg-saffron/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Approve & Disburse
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-border text-muted hover:bg-surface transition-colors"
            >
              Hold for Review
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
