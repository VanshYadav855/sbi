import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoanApprovalModal from '../modals/LoanApprovalModal';
import { formatCurrency, getStatusColor } from '../../utils/format';

export default function ActionPanel({ customer }) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  if (!customer) return null;

  const isApproved = customer.status === 'APPROVED';
  const isSuppressed = customer.status === 'SUPPRESSED';

  return (
    <>
      <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
        <h3 className="font-display font-semibold text-sm">Officer Actions</h3>

        <div className={`inline-flex text-xs px-2.5 py-1 rounded border font-medium ${getStatusColor(customer.status)}`}>
          {customer.status.replace(/_/g, ' ')}
        </div>

        {!isSuppressed && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Product</span>
              <span className="font-medium">{customer.product}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Eligible</span>
              <span className="font-mono text-saffron">{formatCurrency(customer.eligibleAmount)}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2">
          {isApproved ? (
            <div className="text-center py-3 rounded-lg bg-success/10 border border-success/30 text-success text-sm font-medium">
              ✓ Loan Approved & Disbursed
            </div>
          ) : isSuppressed ? (
            <p className="text-xs text-muted text-center py-3">
              Customer suppressed — score below outreach threshold
            </p>
          ) : customer.status === 'PENDING_APPROVAL' ? (
            <>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="w-full py-2.5 rounded-lg bg-saffron text-white font-medium text-sm hover:bg-saffron/90 transition-colors"
              >
                Approve Loan
              </button>
              <button
                type="button"
                className="w-full py-2.5 rounded-lg border border-border text-muted text-sm hover:bg-elevated/60 transition-colors"
              >
                Hold for Review
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2.5 rounded-lg border border-border text-muted text-sm hover:bg-elevated/60 transition-colors"
            >
              Back to Queue
            </button>
          )}
        </div>
      </div>

      {modalOpen && (
        <LoanApprovalModal customer={customer} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
