import { Link } from 'react-router-dom';
import AlertQueue from '../components/dashboard/AlertQueue';
import DemoDataTag from '../components/DemoDataTag';
import { useAutoAdvance } from '../hooks/useAutoAdvance';

export default function AlertQueuePage() {
  useAutoAdvance();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-display font-bold text-2xl text-text-primary">
              AI Recommendation Queue
            </h2>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              SahayakAI called these customers in their language with a relevant offer. Those who
              said &apos;Haan&apos; (Yes) are ready for your approval. Review and approve below.
            </p>
            <DemoDataTag />
          </div>
          <Link
            to="/"
            className="text-xs text-teal hover:text-teal/80 border border-teal/30 rounded-lg px-3 py-1.5 bg-teal/5 transition-colors shrink-0"
          >
            ← Back to Dashboard
          </Link>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-[11px] text-muted">
          <span className="px-2 py-0.5 rounded-full bg-saffron/10 text-saffron border border-saffron/20">
            🟠 HIGH (90+) — act now
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber/10 text-amber border border-amber/20">
            🟡 MEDIUM (75-89) — review
          </span>
          <span className="px-2 py-0.5 rounded-full bg-danger/10 text-danger border border-danger/20">
            🔴 LOW (60-74) — monitor
          </span>
          <span className="px-2 py-0.5 rounded-full bg-elevated text-muted border border-border">
            ⚫ SUPPRESS — no outreach
          </span>
        </div>
      </div>
      <AlertQueue />
    </div>
  );
}
