import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    num: 1,
    icon: '🏠',
    title: 'Dashboard',
    action: 'Approve Ramesh Patil\'s Working Capital Loan.',
    payoff: 'He already said Haan on SahayakAI\'s Hindi call.',
  },
  {
    num: 2,
    icon: '👤',
    title: 'Customer Detail',
    action: 'Click View on any customer card.',
    payoff: 'See JeevanScore breakdown and MirrorMind forecast.',
  },
  {
    num: 3,
    icon: '🛡',
    title: 'Scam Monitor',
    action: 'Open Scam Monitor in the sidebar.',
    payoff: 'Watch SahayakShield block live fraud attempts.',
  },
  {
    num: 4,
    icon: '📊',
    title: 'Analytics',
    action: 'Open Analytics for branch performance KPIs.',
    payoff: 'See activation uplift and scam savings totals.',
  },
];

export default function DemoGuideModal({ open, onClose }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="relative w-full max-w-lg rounded-xl bg-elevated border border-border shadow-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-display font-semibold text-lg">
              How to demo SahayakAI (60 seconds)
            </h2>
          </div>

          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-3">
                <span className="w-7 h-7 rounded-full bg-saffron/15 text-saffron flex items-center justify-center text-sm font-mono shrink-0">
                  {step.num}
                </span>
                <div>
                  <p className="text-sm font-medium">
                    {step.icon} {step.title}
                  </p>
                  <p className="text-xs text-text-primary mt-1">{step.action}</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{step.payoff}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-muted text-center sm:text-left">
              Built for SBI GFF 2026 · Pillar 03: Agentic AI · Team SahayakAI
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-saffron text-white text-sm font-medium hover:bg-saffron/90 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
