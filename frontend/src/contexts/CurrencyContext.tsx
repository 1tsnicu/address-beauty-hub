import React, { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'LEI' | 'RON' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (price: number) => number;
  formatPrice: (price: number) => string;
  getCurrencySymbol: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rates (mock data - in real app would come from API)
// Base currency: LEI (Moldovan Leu)
const exchangeRates = {
  LEI: 1, // Moldovan Leu (MDL) - base currency
  RON: 0.25, // Romanian Leu - 1 MDL ≈ 0.25 RON
  EUR: 0.05, // Euro - 1 MDL ≈ 0.05 EUR
};

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('LEI');

  const convertPrice = (price: number): number => {
    return price * exchangeRates[currency];
  };

  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price);
    switch (currency) {
      case 'LEI':
        return `${convertedPrice.toFixed(2)} LEI`; // Moldovan Leu
      case 'RON':
        return `${convertedPrice.toFixed(2)} RON`; // Romanian Leu
      case 'EUR':
        return `€${convertedPrice.toFixed(2)}`;
      default:
        return `${convertedPrice.toFixed(2)} LEI`;
    }
  };

  const getCurrencySymbol = (): string => {
    switch (currency) {
      case 'LEI':
        return 'LEI'; // Moldovan Leu
      case 'RON':
        return 'RON'; // Romanian Leu
      case 'EUR':
        return '€';
      default:
        return 'LEI';
    }
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      convertPrice,
      formatPrice,
      getCurrencySymbol,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};