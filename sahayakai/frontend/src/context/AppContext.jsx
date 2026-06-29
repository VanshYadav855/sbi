import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { customers as initialCustomers } from '../mock/customers';
import { scamFlags as initialScamFlags } from '../mock/scamFlags';
import { alertStats as initialStats } from '../mock/alerts';
import { formatCurrency } from '../utils/format';
import { useToast } from './ToastContext';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { showToast } = useToast();
  const [customerList, setCustomerList] = useState(initialCustomers);
  const [scamList, setScamList] = useState(initialScamFlags);
  const [stats, setStats] = useState(initialStats);
  const [newAlertPulse, setNewAlertPulse] = useState(false);

  const approveCustomer = useCallback(
    (customerId) => {
      const customer = customerList.find((c) => c.id === customerId);
      if (!customer || customer.status === 'APPROVED') return;

      setCustomerList((prev) =>
        prev.map((c) =>
          c.id === customerId
            ? { ...c, status: 'APPROVED', outreachStatus: 'LOAN_DISBURSED' }
            : c
        )
      );

      setStats((prev) => ({
        ...prev,
        disbursedToday: prev.disbursedToday + 1,
      }));

      showToast(
        `✓ Loan approved — ${customer.name} · ${formatCurrency(customer.eligibleAmount)}`,
        'success'
      );
    },
    [customerList, showToast]
  );

  const addSimulatedCustomer = useCallback((customer) => {
    setCustomerList((prev) => {
      if (prev.some((c) => c.id === customer.id)) return prev;
      return [customer, ...prev];
    });
    setStats((prev) => ({
      ...prev,
      totalAlerts: prev.totalAlerts + 1,
    }));
    setNewAlertPulse(true);
    setTimeout(() => setNewAlertPulse(false), 3000);
  }, []);

  const addSimulatedScam = useCallback(
    (scam) => {
      setScamList((prev) => [scam, ...prev]);
      setStats((prev) => ({
        ...prev,
        scamsBlockedToday: prev.scamsBlockedToday + 1,
      }));
      showToast(
        `🛡 Scam blocked — ${scam.targetCustomer} · ${scam.type}`,
        'danger'
      );
    },
    [showToast]
  );

  const getCustomerById = useCallback(
    (id) => customerList.find((c) => c.id === id),
    [customerList]
  );

  const getScamCountForCustomer = useCallback(
    (name) => scamList.filter((s) => s.targetCustomer === name).length,
    [scamList]
  );

  const getScamsForCustomer = useCallback(
    (name) => scamList.filter((s) => s.targetCustomer === name),
    [scamList]
  );

  const pendingApprovals = useMemo(
    () => customerList.filter((c) => c.status === 'PENDING_APPROVAL').length,
    [customerList]
  );

  const statsWithPending = useMemo(
    () => ({ ...stats, pendingApprovals }),
    [stats, pendingApprovals]
  );

  return (
    <AppContext.Provider
      value={{
        customerList,
        scamList,
        stats: statsWithPending,
        newAlertPulse,
        approveCustomer,
        addSimulatedCustomer,
        addSimulatedScam,
        getCustomerById,
        getScamCountForCustomer,
        getScamsForCustomer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
