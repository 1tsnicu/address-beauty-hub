import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  id: string;
  name: string;
  href?: string;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  onNavigate?: (id: string) => void;
  className?: string;
}

export function BreadcrumbNavigation({ items, onNavigate, className }: BreadcrumbNavigationProps) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm", className)}>
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.id} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />}
              
              {isLast ? (
                <span className="font-medium">{item.name}</span>
              ) : (
                <button
                  onClick={() => onNavigate?.(item.id)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default BreadcrumbNavigation;
