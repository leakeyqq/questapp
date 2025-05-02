'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface CurrencyContextType {
  currency: 'cUSD' | 'USD';
  isMinipay: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  isMinipay: false,
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [isMinipay, setIsMinipay] = useState(false);

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      // const detected = (window.ethereum as any)?.isMiniPay === true;
      setIsMinipay(true);
    }else{
      setIsMinipay(false);

    }
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency: isMinipay ? 'cUSD' : 'USD', isMinipay }}>
      {children}
    </CurrencyContext.Provider>
  );
};
