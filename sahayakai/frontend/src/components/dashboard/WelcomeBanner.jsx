import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'sahayakai-banner-dismissed';

const pipelineSteps = [
  { emoji: '🔍', label: 'Observe', color: 'bg-teal/15 text-teal border-teal/30' },
  { emoji: '🧠', label: 'Understand', color: 'bg-teal/15 text-teal border-teal/30' },
  { emoji: '📈', label: 'Predict', color: 'bg-saffron/15 text-saffron border-saffron/30' },
  { emoji: '✅', label: 'Act', color: 'bg-success/15 text-success border-success/30' },
  { emoji: '🛡', label: 'Protect', color: 'bg-danger/15 text-danger border-danger/30' },
];

export default function WelcomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(STORAGE_KEY) !== 'true');
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="mb-6 glass-panel rounded-2xl border-l-4 border-l-teal p-4 lg:p-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-teal/5 via-transparent to-saffron/5 pointer-events-none" />
      <div className="relative flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {pipelineSteps.map((step, i) => (
            <span key={step.label} className="flex items-center gap-1.5">
              <span
                className={`text-[10px] px-2 py-1 rounded-full border font-medium whitespace-nowrap ${step.color}`}
              >
                {step.emoji} {step.label}
              </span>
              {i < pipelineSteps.length - 1 && (
                <span className="text-muted text-xs hidden sm:inline">→</span>
              )}
            </span>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary leading-snug">
            SahayakAI detects life events in customer data and recommends the right financial
            product — before the customer even asks.
          </p>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Your job as Branch Officer: review AI recommendations below and click Approve to
            disburse. SahayakShield runs in the background blocking scams automatically.
          </p>
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="self-start lg:self-center p-1.5 rounded-lg text-muted hover:text-text-primary hover:bg-elevated/60 transition-colors shrink-0"
          aria-label="Dismiss banner"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
