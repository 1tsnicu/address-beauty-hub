import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface ProductsPerPageSelectorProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
  className?: string;
}

const ProductsPerPageSelector: React.FC<ProductsPerPageSelectorProps> = ({
  value,
  onChange,
  options = [12, 24, 36, 48],
  className
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground whitespace-nowrap">Produse pe pagină:</span>
      <Select 
        value={value.toString()} 
        onValueChange={(val) => onChange(parseInt(val))}
      >
        <SelectTrigger className="w-16 h-8">
          <SelectValue placeholder={value} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductsPerPageSelector;
