import { useEffect, useRef } from 'react';
import { simulatedCustomer } from '../mock/customers';
import { simulatedScamFlag } from '../mock/scamFlags';
import { useApp } from '../context/AppContext';

export function useAutoAdvance() {
  const { addSimulatedCustomer, addSimulatedScam } = useApp();
  const triggered = useRef({ customer: false, scam: false });

  useEffect(() => {
    const customerTimer = setTimeout(() => {
      if (!triggered.current.customer) {
        triggered.current.customer = true;
        addSimulatedCustomer({ ...simulatedCustomer, isNew: true });
      }
    }, 30000);

    const scamTimer = setTimeout(() => {
      if (!triggered.current.scam) {
        triggered.current.scam = true;
        addSimulatedScam({ ...simulatedScamFlag, isNew: true });
      }
    }, 45000);

    return () => {
      clearTimeout(customerTimer);
      clearTimeout(scamTimer);
    };
  }, [addSimulatedCustomer, addSimulatedScam]);
}
