export function formatCurrency(amount) {
  if (amount == null) return '—';
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function getConfidenceColor(confidence) {
  switch (confidence) {
    case 'HIGH':
      return 'text-saffron bg-saffron/15 border-saffron/30';
    case 'MEDIUM':
      return 'text-amber bg-amber/15 border-amber/30';
    case 'LOW':
      return 'text-danger/80 bg-danger/10 border-danger/20';
    case 'SUPPRESS':
      return 'text-muted bg-muted/10 border-muted/20';
    default:
      return 'text-muted bg-muted/10 border-muted/20';
  }
}

export function getAvatarColor(confidence) {
  switch (confidence) {
    case 'HIGH':
      return 'bg-saffron/20 text-saffron border-saffron/40';
    case 'MEDIUM':
      return 'bg-amber/20 text-amber border-amber/40';
    case 'LOW':
      return 'bg-muted/20 text-muted border-muted/40';
    case 'SUPPRESS':
      return 'bg-muted/10 text-muted border-muted/30';
    default:
      return 'bg-teal/20 text-teal border-teal/40';
  }
}

export function getStatusColor(status) {
  switch (status) {
    case 'PENDING_APPROVAL':
      return 'text-saffron bg-saffron/15 border-saffron/30';
    case 'APPROVED':
      return 'text-success bg-success/15 border-success/30';
    case 'MONITORING':
      return 'text-amber bg-amber/15 border-amber/30';
    case 'SUPPRESSED':
      return 'text-muted bg-muted/10 border-muted/20';
    default:
      return 'text-muted bg-muted/10 border-muted/20';
  }
}

export function getOutreachStatusDisplay(status) {
  switch (status) {
    case 'OFFER_ACCEPTED':
      return { label: 'Customer said Haan', color: 'text-success', dot: 'bg-success' };
    case 'OFFER_SENT':
      return { label: 'Offer Sent', color: 'text-amber', dot: 'bg-amber' };
    case 'AWAITING_RESPONSE':
      return { label: 'Awaiting Response', color: 'text-muted', dot: 'bg-muted' };
    case 'LOAN_DISBURSED':
      return { label: 'Loan Disbursed', color: 'text-success', dot: 'bg-success' };
    case 'NO_OUTREACH':
      return { label: 'Suppressed (score <60)', color: 'text-muted', dot: 'bg-muted' };
    default:
      return { label: status, color: 'text-muted', dot: 'bg-muted' };
  }
}

export function getTriggerExplanation(trigger) {
  const explanations = {
    'EMI Freed': 'Previous EMI obligation cleared — surplus cash flow detected',
    'Harvest in 18 days': 'Crop harvest window approaching — seasonal income expected',
    'Revenue +35%': 'Business account inflow increased 35% over 90 days',
    'Marriage Detected': 'Life event signal from spending pattern and social graph',
    'Gold Price Dip': 'Gold market dip — optimal window for gold-backed lending',
    'New Baby Detected': 'Healthcare and childcare spending pattern identified',
    'Salary Hike': 'Regular salary credit increased — income stability confirmed',
    'Harvest Season': 'Agricultural calendar indicates harvest period',
    'MSP Announced': 'Minimum Support Price update affects crop income forecast',
    'MSP Hike Detected': 'Government MSP increase for customer crop category',
    'Crop Cycle Peak': 'Peak productivity window in crop cycle',
    'Festival Season': 'Festival-driven consumer spending spike expected',
    'Revenue Uptick': 'Shop revenue trending upward pre-festival',
    'Retirement Signal': 'Age and employment pattern suggest retirement transition',
    'Provident Fund Maturity': 'PF maturity detected — lump sum incoming',
    'New Employment': 'New salary credits from verified employer detected',
  };
  return explanations[trigger] || 'Signal detected by SahayakAI life-event engine';
}

/** Score buckets: HIGH 90+, MEDIUM 74-89, LOW 60-73, SUPPRESS <60 */
export function getScoreBucket(customer) {
  const { jeevanScore, status } = customer;
  if (status === 'SUPPRESSED' || jeevanScore < 60) return 'suppress';
  if (jeevanScore >= 90) return 'high';
  if (jeevanScore >= 74) return 'medium';
  if (jeevanScore >= 60) return 'low';
  return 'suppress';
}

export function getCashGapRiskColor(risk) {
  switch (risk) {
    case 'Very Low':
      return 'text-success bg-success/15 border-success/30';
    case 'Low':
      return 'text-teal bg-teal/15 border-teal/30';
    case 'Medium':
      return 'text-amber bg-amber/15 border-amber/30';
    case 'High':
      return 'text-danger bg-danger/15 border-danger/30';
    default:
      return 'text-muted bg-muted/10 border-muted/20';
  }
}

export function getOutreachContextLine(status, channel) {
  const channelShort = channel?.replace(/\([^)]*\)/, '').trim() || 'channel';
  switch (status) {
    case 'OFFER_ACCEPTED':
    case 'LOAN_DISBURSED':
      return {
        prefix: '🗣 Customer responded:',
        text: 'Said Haan (Yes)',
        color: 'text-success',
        dot: 'bg-success',
      };
    case 'OFFER_SENT':
      return {
        prefix: '📤 Outreach:',
        text: `Offer sent via ${channelShort}`,
        color: 'text-amber',
        dot: 'bg-amber',
      };
    case 'AWAITING_RESPONSE':
      return {
        prefix: '⏳ Outreach:',
        text: 'Awaiting customer response',
        color: 'text-muted',
        dot: 'bg-muted',
      };
    case 'NO_OUTREACH':
      return {
        prefix: '⚫ Outreach:',
        text: 'Suppressed (score <60)',
        color: 'text-muted',
        dot: 'bg-muted',
      };
    default:
      return {
        prefix: '📤 Outreach:',
        text: status?.replace(/_/g, ' ') || 'Unknown',
        color: 'text-muted',
        dot: 'bg-muted',
      };
  }
}
