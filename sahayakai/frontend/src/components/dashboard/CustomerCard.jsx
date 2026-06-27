import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Radio } from 'lucide-react';
import JeevanScoreGauge from './JeevanScoreGauge';
import MirrorMindForecastChart from '../MirrorMindForecastChart';
import LoanApprovalModal from '../modals/LoanApprovalModal';
import {
  formatCurrency,
  getAvatarColor,
  getOutreachContextLine,
} from '../../utils/format';

function getChannelIcon(channel) {
  if (!channel) return null;
  if (channel.includes('WhatsApp')) return MessageCircle;
  if (channel.includes('IVR')) return Radio;
  return Phone;
}

export default function CustomerCard({ customer, index }) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [mirrorExpanded, setMirrorExpanded] = useState(false);
  const isSuppressed = customer.status === 'SUPPRESSED';
  const mm = customer.mirrorMind;
  const outreach = getOutreachContextLine(customer.outreachStatus, customer.outreachChannel);
  const ChannelIcon = getChannelIcon(customer.outreachChannel);

  return (
    <>
      <motion.div
        layout
        initial={
          customer.isNew ? { opacity: 0, y: -30 } : { opacity: 0, y: 20 }
        }
        animate={{ opacity: isSuppressed ? 0.4 : 1, y: 0 }}
        transition={
          customer.isNew
            ? { type: 'spring', stiffness: 300, damping: 25 }
            : { delay: index * 0.1, duration: 0.4 }
        }
        className={`card-vibrant rounded-xl p-4 transition-all hover:border-teal/50 hover:scale-[1.005] ${
          customer.isNew
            ? 'border-l-4 border-l-success shadow-[0_0_24px_rgba(34,197,94,0.2)]'
            : ''
        } ${isSuppressed ? 'opacity-40' : ''}`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-mono font-medium shrink-0 ${getAvatarColor(customer.confidence)}`}
          >
            {customer.avatar}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display font-semibold text-text-primary">{customer.name}</h3>
                <p className="text-xs text-muted">{customer.location}</p>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] px-2 py-0.5 rounded-full bg-teal/10 text-teal border border-teal/20">
                  {customer.language} 🔊
                </span>
              </div>
              <div className="flex flex-col items-center shrink-0">
                <span className="text-[10px] text-muted mb-0.5">AI Confidence Score</span>
                <JeevanScoreGauge
                  score={customer.jeevanScore}
                  confidence={customer.confidence}
                  size={60}
                />
              </div>
            </div>

            <p className="text-[10px] text-muted mt-3 mb-1">
              Why SahayakAI flagged this customer:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {customer.triggers.map((trigger) => (
                <span
                  key={trigger}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-teal/10 text-teal border border-teal/20 font-body"
                >
                  {trigger}
                </span>
              ))}
            </div>

            {/* MirrorMind forecast */}
            <div className={`mt-3 pt-3 border-t border-border ${isSuppressed ? 'opacity-60' : ''}`}>
              {isSuppressed ? (
                <p className="text-[10px] text-muted italic">
                  MirrorMind: Insufficient signal data — monitoring only
                </p>
              ) : mirrorExpanded ? (
                <div>
                  <MirrorMindForecastChart mirrorMind={mm} height={200} />
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {mm?.signals?.map((signal) => (
                      <span
                        key={signal}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-elevated text-muted border border-border max-w-full truncate"
                        title={signal}
                      >
                        {signal.length > 30 ? `${signal.slice(0, 30)}…` : signal}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 gap-2">
                    <p className="text-[10px] text-teal">
                      ⏱ Optimal outreach window: {mm?.optimalWindow || '—'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setMirrorExpanded(false)}
                      className="text-[10px] text-teal hover:text-teal/80 shrink-0"
                    >
                      ▲ Collapse
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] text-muted truncate">
                    📈 MirrorMind: {mm?.forecastHorizon} forecast
                    {mm?.surplusWeek != null && ` · Surplus in week ${mm.surplusWeek}`}
                    {mm?.cashGapRisk && ` · Risk: ${mm.cashGapRisk}`}
                  </p>
                  <button
                    type="button"
                    onClick={() => setMirrorExpanded(true)}
                    className="text-[10px] text-teal hover:text-teal/80 shrink-0"
                  >
                    ▼ Expand
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-border">
              {isSuppressed ? (
                <p className="text-xs text-muted italic">
                  Score below threshold — no outreach made
                </p>
              ) : (
                <>
                  <div className="text-xs bg-elevated/60 px-3 py-2 rounded-lg border border-border">
                    <span className="text-teal/80 text-[10px]">AI Recommends: </span>
                    <span className="font-medium">{customer.recommendation}</span>
                    {customer.eligibleAmount && (
                      <span className="text-saffron font-mono ml-1">
                        · {formatCurrency(customer.eligibleAmount)} eligible
                      </span>
                    )}
                  </div>

                  <div className={`flex items-center gap-1.5 text-xs ${outreach.color}`}>
                    {ChannelIcon && <ChannelIcon size={12} />}
                    <span className={`w-1.5 h-1.5 rounded-full ${outreach.dot}`} />
                    <span className="text-muted">{outreach.prefix}</span>
                    <span>{outreach.text}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {customer.status === 'APPROVED' ? (
                      <span className="text-xs px-3 py-1.5 rounded-lg bg-success/15 text-success border border-success/30 font-medium">
                        ✓ Approved
                      </span>
                    ) : customer.status === 'PENDING_APPROVAL' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setModalOpen(true)}
                          className="px-4 py-1.5 rounded-lg bg-saffron text-white text-xs font-medium hover:bg-saffron/90 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate('/customer/' + customer.id)}
                          className="px-4 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-text-primary hover:bg-elevated/60 transition-colors"
                        >
                          View
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => navigate('/customer/' + customer.id)}
                        className="px-4 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-text-primary hover:bg-elevated/60 transition-colors"
                      >
                        View
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {modalOpen && (
        <LoanApprovalModal customer={customer} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
