import CustomerCard from './CustomerCard';
import { useAlertQueue } from '../../hooks/useAlertQueue';
import { CheckCircle } from 'lucide-react';

export default function AlertQueue() {
  const { sortedCustomers, pendingCount } = useAlertQueue();

  if (sortedCustomers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted">
        <CheckCircle size={48} className="text-success mb-4 opacity-60" />
        <p className="font-display text-lg">All clear — no pending recommendations</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedCustomers.map((customer, index) => (
        <CustomerCard key={customer.id} customer={customer} index={index} />
      ))}
    </div>
  );
}
