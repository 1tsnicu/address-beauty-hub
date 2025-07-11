import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrency } from '@/contexts/CurrencyContext';

const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select value={currency} onValueChange={(value: 'LEI' | 'RON' | 'EUR') => setCurrency(value)}>
      <SelectTrigger className="w-20">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="LEI">LEI</SelectItem>
        <SelectItem value="RON">RON</SelectItem>
        <SelectItem value="EUR">EUR</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;