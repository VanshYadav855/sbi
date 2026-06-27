import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

const STATUS_ORDER = {
  PENDING_APPROVAL: 0,
  MONITORING: 1,
  APPROVED: 2,
  SUPPRESSED: 3,
};

function getStatusRank(status) {
  return STATUS_ORDER[status] ?? 2;
}

export function useAlertQueue() {
  const { customerList } = useApp();

  const sortedCustomers = useMemo(() => {
    return [...customerList].sort((a, b) => {
      const statusDiff = getStatusRank(a.status) - getStatusRank(b.status);
      if (statusDiff !== 0) return statusDiff;

      if (a.status === 'PENDING_APPROVAL' && b.status === 'PENDING_APPROVAL') {
        return b.jeevanScore - a.jeevanScore;
      }

      return b.jeevanScore - a.jeevanScore;
    });
  }, [customerList]);

  const pendingCount = useMemo(
    () => customerList.filter((c) => c.status === 'PENDING_APPROVAL').length,
    [customerList]
  );

  return { sortedCustomers, pendingCount };
}
