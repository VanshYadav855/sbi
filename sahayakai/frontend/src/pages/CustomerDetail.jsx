import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Zap, ShieldCheck } from 'lucide-react';
import JeevanScoreGauge from '../components/dashboard/JeevanScoreGauge';
import MirrorMindForecastChart from '../components/MirrorMindForecastChart';
import { useApp } from '../context/AppContext';
import {
  formatCurrency,
  getAvatarColor,
  getStatusColor,
  getOutreachStatusDisplay,
} from '../utils/format';

const TRIGGER_WEIGHTS = {
  'EMI Freed': 28,
  'Harvest in 18 days': 31,
  'Revenue +35%': 32,
  'Marriage Detected': 38,
  'Gold Price Dip': 40,
  'New Baby Detected': 42,
  'Salary Hike': 43,
  'Harvest Season': 30,
  'MSP Announced': 32,
  'MSP Hike Detected': 44,
  'Crop Cycle Peak': 44,
  'Festival Season': 36,
  'Revenue Uptick': 38,
  'Retirement Signal': 38,
  'Provident Fund Maturity': 41,
  'New Employment': 45,
};

function getTriggerWeights(triggers, totalScore) {
  const known = triggers.map((t) => TRIGGER_WEIGHTS[t]);
  if (known.every((w) => w != null)) return triggers.map((t) => TRIGGER_WEIGHTS[t]);
  const base = Math.floor(totalScore / triggers.length);
  const remainder = totalScore - base * triggers.length;
  return triggers.map((_, i) => base + (i < remainder ? 1 : 0));
}

function buildOutreachTimeline(customer) {
  const steps = [
    {
      icon: '✓',
      text: `JeevanScore fired — ${customer.jeevanScore} (${customer.confidence})`,
      time: 'Today 09:14 AM',
      state: 'done',
    },
  ];

  if (customer.outreachChannel) {
    steps.push({
      icon: '✓',
      text: `${customer.outreachChannel} initiated`,
      time: 'Today 09:15 AM',
      state: 'done',
    });
  }

  if (customer.outreachStatus === 'OFFER_ACCEPTED' || customer.outreachStatus === 'LOAN_DISBURSED') {
    steps.push({
      icon: '✓',
      text: 'Customer said "Haan"',
      time: 'Today 09:16 AM',
      state: 'done',
    });
    steps.push({
      icon: '✓',
      text: 'YONO dual-channel confirmation received',
      time: 'Today 09:17 AM',
      state: 'done',
    });
  } else if (customer.outreachStatus === 'OFFER_SENT') {
    steps.push({
      icon: '⏳',
      text: 'Offer sent — awaiting response',
      time: 'Today 09:16 AM',
      state: 'pending',
    });
  } else if (customer.outreachStatus === 'AWAITING_RESPONSE') {
    steps.push({
      icon: '⏳',
      text: 'IVR call placed — awaiting callback',
      time: 'Today 09:16 AM',
      state: 'pending',
    });
  }

  if (customer.status === 'APPROVED') {
    steps.push({
      icon: '✓',
      text: 'Loan approved by officer',
      time: 'Today 10:02 AM',
      state: 'done',
    });
  } else if (customer.status === 'PENDING_APPROVAL') {
    steps.push({
      icon: '⏳',
      text: 'Awaiting officer approval',
      time: 'Now',
      state: 'waiting',
    });
  } else if (customer.status === 'MONITORING') {
    steps.push({
      icon: '—',
      text: 'Monitoring only, no outreach made',
      time: '',
      state: 'muted',
    });
  }

  return steps;
}

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCustomerById, getScamsForCustomer, approveCustomer } = useApp();
  const [expandedTriggers, setExpandedTriggers] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  const customer = getCustomerById(id);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-display text-xl text-text-primary mb-2">Customer not found</p>
        <p className="text-sm text-muted mb-6">No record matches ID &quot;{id}&quot;</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-lg bg-saffron text-white text-sm font-medium hover:bg-saffron/90"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const weights = getTriggerWeights(customer.triggers, customer.jeevanScore);
  const timeline = buildOutreachTimeline(customer);
  const customerScams = getScamsForCustomer(customer.name);
  const outreach = getOutreachStatusDisplay(customer.outreachStatus);
  const canApprove = customer.status === 'PENDING_APPROVAL';
  const showLoanCard =
    customer.recommendation && customer.status !== 'SUPPRESSED' && customer.status !== 'MONITORING';

  const handleApprove = () => {
    if (!confirmed) return;
    approveCustomer(customer.id);
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-surface border border-border">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-teal hover:text-teal/80 transition-colors shrink-0 mt-1"
          >
            ← Back to Dashboard
          </button>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded border font-medium shrink-0 ${getStatusColor(customer.status)}`}
        >
          {customer.status.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="flex items-center gap-4 px-1">
        <div
          className={`w-14 h-14 rounded-full border flex items-center justify-center text-lg font-mono font-medium shrink-0 ${getAvatarColor(customer.confidence)}`}
        >
          {customer.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-2xl">{customer.name}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-elevated border border-border text-muted">
              {customer.location}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-teal/10 text-teal border border-teal/20">
              {customer.language} 🔊
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-elevated border border-border text-muted font-mono">
              {customer.accountNo}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-elevated border border-border text-muted">
              Age {customer.age}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-elevated border border-border text-muted">
              {customer.profile}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left column */}
        <div className="w-[58%] space-y-5">
          {/* JeevanScore Deep Dive */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex flex-col items-center mb-4">
              <JeevanScoreGauge
                score={customer.jeevanScore}
                confidence={customer.confidence}
                size={160}
              />
            </div>

            <button
              type="button"
              onClick={() => setExpandedTriggers(!expandedTriggers)}
              className="w-full flex items-center justify-between text-sm font-medium py-2 border-t border-border"
            >
              Why this score?
              {expandedTriggers ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {expandedTriggers && (
              <div className="space-y-2 mt-2">
                {customer.triggers.map((trigger, i) => (
                  <div
                    key={trigger}
                    className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <Zap size={14} className="text-saffron shrink-0" />
                      <span>{trigger}</span>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-teal/10 text-teal border border-teal/20">
                      +{weights[i]} pts
                    </span>
                  </div>
                ))}
                <div className="pt-3 mt-2">
                  <div className="flex justify-between text-xs text-muted mb-1">
                    <span>Total score</span>
                    <span className="font-mono text-text-primary">{customer.jeevanScore} / 100</span>
                  </div>
                  <div className="h-2 rounded-full bg-elevated overflow-hidden">
                    <div
                      className="h-full rounded-full bg-saffron transition-all"
                      style={{ width: `${customer.jeevanScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted mt-2">
                    Score ≥ 90 → HIGH · Act Now
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* MirrorMind Forecast */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-display font-semibold text-sm text-teal">
              MirrorMind — Cash Flow Forecast
            </h3>
            <p className="text-[11px] text-muted mt-0.5 mb-4">
              LSTM + Prophet model · Updated daily
            </p>

            <MirrorMindForecastChart
              mirrorMind={customer.mirrorMind}
              height={200}
              showLabels
              suppressed={customer.status === 'SUPPRESSED'}
            />

            <div className="flex flex-wrap gap-2 mt-4">
              {customer.mirrorMind?.surplusAmount && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/20">
                  📈 Predicted surplus: {formatCurrency(customer.mirrorMind.surplusAmount)} in week{' '}
                  {customer.mirrorMind.surplusWeek}
                </span>
              )}
              {customer.mirrorMind?.cashGapRisk && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-teal/10 text-teal border border-teal/20">
                  📉 Cash gap risk: {customer.mirrorMind.cashGapRisk}
                </span>
              )}
              {customer.mirrorMind?.optimalWindow && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-saffron/10 text-saffron border border-saffron/20">
                  🎯 Optimal outreach window: {customer.mirrorMind.optimalWindow}
                </span>
              )}
            </div>

            <p className="text-sm font-mono text-teal mt-4">{customer.mirrorMindForecast}</p>
          </div>

          {/* Outreach Timeline */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-display font-semibold text-sm mb-4">Outreach Activity</h3>
            <div className="relative pl-6 border-l-2 border-border space-y-5">
              {timeline.map((step, i) => (
                <div key={i} className="relative">
                  <span
                    className={`absolute -left-[25px] w-3 h-3 rounded-full border-2 border-surface ${
                      step.state === 'done'
                        ? 'bg-success'
                        : step.state === 'waiting'
                          ? 'bg-amber animate-pulse-live'
                          : step.state === 'pending'
                            ? 'bg-amber'
                            : 'bg-muted'
                    }`}
                  />
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm">
                      <span className="mr-1.5">{step.icon}</span>
                      {step.text}
                    </p>
                    {step.time && (
                      <span className="text-[10px] text-muted whitespace-nowrap">{step.time}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-[42%] space-y-4">
          {/* Loan Recommendation */}
          <div className="rounded-xl border border-border bg-surface p-5">
            {showLoanCard ? (
              <>
                <p className="font-display font-semibold text-lg">{customer.product}</p>
                <p className="font-mono text-2xl text-saffron font-medium mt-1 mb-4">
                  {formatCurrency(customer.eligibleAmount)}
                </p>
                <div className="space-y-2 text-sm border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted">Outreach Channel</span>
                    <span className="text-right text-xs">{customer.outreachChannel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Customer Response</span>
                    <span className={outreach.color}>{outreach.label}</span>
                  </div>
                  <div className="flex justify-between text-success">
                    <span className="text-muted">TRAI Verified</span>
                    <span>✓ Yes</span>
                  </div>
                  <div className="flex justify-between text-success">
                    <span className="text-muted">Dual Channel</span>
                    <span>✓ YONO + Voice</span>
                  </div>
                </div>

                {canApprove && (
                  <div className="mt-5 space-y-3 border-t border-border pt-4">
                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                        className="mt-0.5 rounded border-border bg-surface text-saffron"
                      />
                      <span>I confirm this recommendation has been reviewed</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleApprove}
                      disabled={!confirmed}
                      className="w-full py-2.5 rounded-lg bg-saffron text-white font-medium text-sm hover:bg-saffron/90 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Approve & Disburse
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      className="w-full py-2.5 rounded-lg border border-border text-muted text-sm hover:bg-elevated/60"
                    >
                      Hold for Review
                    </button>
                  </div>
                )}

                {customer.status === 'APPROVED' && (
                  <div className="mt-4 py-3 rounded-lg bg-success/10 border border-success/30 text-success text-sm font-medium text-center">
                    ✓ Approved — Loan disbursed
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted py-4">
                No loan recommendation — score below action threshold
              </p>
            )}
          </div>

          {/* SahayakShield */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-display font-semibold text-sm mb-3">
              🛡 Shield Status for this customer
            </h3>
            {customerScams.length > 0 ? (
              <div className="space-y-2">
                {customerScams.map((scam) => (
                  <div
                    key={scam.id}
                    className="flex items-center justify-between text-xs py-2 border-b border-border/50 last:border-0"
                  >
                    <span>{scam.type}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded ${
                          scam.status === 'BLOCKED'
                            ? 'bg-danger/15 text-danger'
                            : 'bg-amber/15 text-amber'
                        }`}
                      >
                        {scam.status}
                      </span>
                      <span className="text-muted">{scam.attemptTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-success flex items-center gap-2">
                <ShieldCheck size={16} />
                ✓ No threats detected for this customer
              </p>
            )}
          </div>

          {/* Account Snapshot */}
          <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
            <h3 className="font-display font-semibold text-sm">Customer Account Snapshot</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Account</span>
                <span className="font-mono">{customer.accountNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Balance</span>
                <span className="font-mono">{formatCurrency(customer.balance)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">Profile</span>
                <span className="text-xs px-2 py-0.5 rounded bg-elevated border border-border">
                  {customer.profile}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Language</span>
                <span>{customer.language} 🔊</span>
              </div>
            </div>
            <p className="text-[10px] text-muted pt-2 border-t border-border">
              Data sourced from SBI core banking · Last synced: Today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
