import React from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Tipurile de filtre
export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface RangeFilterOption {
  min: number;
  max: number;
  step: number;
  unit?: string;
}

export interface FilterGroup {
  id: string;
  name: string;
  type: 'checkbox' | 'radio' | 'range';
  options: FilterOption[] | RangeFilterOption;
  expanded?: boolean;
}

export interface FilterState {
  [key: string]: string[] | number[] | undefined;
}

interface ProductFiltersProps {
  filters: FilterGroup[];
  activeFilters: FilterState;
  onFilterChange: (groupId: string, values: string[] | number[] | undefined) => void;
  className?: string;
}

export function ProductFilters({ 
  filters, 
  activeFilters, 
  onFilterChange, 
  className 
}: ProductFiltersProps) {
  // Funcție pentru a formata valorile de tip range
  const formatRangeValue = (value: number, unit: string = '') => {
    return `${value}${unit}`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Accordion type="multiple" className="w-full" defaultValue={
        filters.filter(filter => filter.expanded).map(filter => filter.id)
      }>
        {filters.map((group) => (
          <AccordionItem value={group.id} key={group.id}>
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              {group.name}
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              {group.type === 'checkbox' && (
                <div className="space-y-2">
                  {(group.options as FilterOption[]).map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`filter-${group.id}-${option.id}`}
                        checked={(activeFilters[group.id] as string[] || []).includes(option.id)}
                        onCheckedChange={(checked) => {
                          const currentValues = [...(activeFilters[group.id] as string[] || [])];
                          if (checked) {
                            onFilterChange(group.id, [...currentValues, option.id]);
                          } else {
                            onFilterChange(
                              group.id, 
                              currentValues.filter(value => value !== option.id)
                            );
                          }
                        }}
                      />
                      <Label 
                        htmlFor={`filter-${group.id}-${option.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {option.label}
                        {option.count !== undefined && (
                          <span className="text-muted-foreground ml-1 text-xs">
                            ({option.count})
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {group.type === 'radio' && (
                <div className="space-y-2">
                  {(group.options as FilterOption[]).map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`filter-${group.id}-${option.id}`}
                        checked={(activeFilters[group.id] as string[])?.[0] === option.id}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onFilterChange(group.id, [option.id]);
                          } else {
                            onFilterChange(group.id, []);
                          }
                        }}
                      />
                      <Label 
                        htmlFor={`filter-${group.id}-${option.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {option.label}
                        {option.count !== undefined && (
                          <span className="text-muted-foreground ml-1 text-xs">
                            ({option.count})
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {group.type === 'range' && (
                <div className="space-y-4 px-1">
                  {(() => {
                    const rangeOption = group.options as RangeFilterOption;
                    const values = (activeFilters[group.id] as number[]) || [rangeOption.min, rangeOption.max];
                    
                    return (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span>{formatRangeValue(values[0], rangeOption.unit)}</span>
                          <span>{formatRangeValue(values[1], rangeOption.unit)}</span>
                        </div>
                        <Slider
                          min={rangeOption.min}
                          max={rangeOption.max}
                          step={rangeOption.step}
                          value={values}
                          onValueChange={(newValues) => {
                            onFilterChange(group.id, newValues);
                          }}
                        />
                      </>
                    );
                  })()}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default ProductFilters;
