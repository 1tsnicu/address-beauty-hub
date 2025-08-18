import React from 'react';
import { cn } from '@/lib/utils';

interface VariantChipProps {
  value: string;
  isSelected: boolean;
  isEnabled: boolean;
  onClick: () => void;
  label?: string;
}

export const VariantChip: React.FC<VariantChipProps> = ({
  value,
  isSelected,
  isEnabled,
  onClick,
  label
}) => {
  return (
    <button
      type="button"
      onClick={isEnabled ? onClick : undefined}
      disabled={!isEnabled}
      className={cn(
        // Stiluri de bază
        "inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200",
        "border-2 min-w-[60px] h-8",
        
        // Stări
        {
          // Selectat și activat
          "bg-primary text-primary-foreground border-primary shadow-md transform scale-105": 
            isSelected && isEnabled,
          
          // Nu este selectat dar este activat
          "bg-background text-foreground border-border hover:border-primary/50 hover:bg-accent": 
            !isSelected && isEnabled,
          
          // Dezactivat
          "bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-50": 
            !isEnabled,
        }
      )}
      title={isEnabled ? `Selectează ${label || value}` : 'Opțiune indisponibilă'}
    >
      {value}
    </button>
  );
};

interface VariantChipGroupProps {
  title: string;
  values: string[];
  selectedValue?: string;
  enabledValues: string[];
  onValueChange: (value: string) => void;
  className?: string;
}

export const VariantChipGroup: React.FC<VariantChipGroupProps> = ({
  title,
  values,
  selectedValue,
  enabledValues,
  onValueChange,
  className
}) => {
  if (values.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      <h4 className="font-medium text-sm text-foreground uppercase tracking-wide">
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => {
          const isSelected = selectedValue === value;
          const isEnabled = enabledValues.includes(value);
          
          return (
            <VariantChip
              key={value}
              value={value}
              isSelected={isSelected}
              isEnabled={isEnabled}
              onClick={() => {
                if (isSelected) {
                  // Dacă este deja selectat, îl deselectăm
                  onValueChange('');
                } else {
                  // Altfel îl selectăm
                  onValueChange(value);
                }
              }}
              label={`${title}: ${value}`}
            />
          );
        })}
      </div>
    </div>
  );
};
