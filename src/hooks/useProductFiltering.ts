import { useMemo } from 'react';
import { Product } from '@/types/Product';

export type FilterState = {
  [key: string]: string[] | number[] | undefined;
};

interface UseProductFilteringProps {
  products: Product[];
  searchTerm: string;
  category: string;
  subcategory?: string;
  filters?: FilterState;
  sortBy: string;
  showOutOfStock?: boolean;
}

export const useProductFiltering = ({
  products,
  searchTerm,
  category,
  subcategory = '',
  filters = {},
  sortBy,
  showOutOfStock = false
}: UseProductFilteringProps) => {
  return useMemo(() => {
    let filtered = products.filter(product => {
      // Filter by search term
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by category
      const matchesCategory = category === 'all' || product.category === category;
      
      // Filter by subcategory if provided
      const matchesSubcategory = !subcategory || 
        (product.subcategories && product.subcategories.includes(subcategory));
      
      // Hide out of stock products if showOutOfStock is false
      const matchesStock = showOutOfStock || product.inStock;
      
      // Apply additional filters
      let matchesFilters = true;
      
      // Verificare filtre avansate
      if (filters && Object.keys(filters).length > 0) {
        for (const [key, values] of Object.entries(filters)) {
          // Skip empty filters
          if (!values || values.length === 0) continue;
          
          // Handle different filter types
          if (key === 'curvature' && values.length > 0) {
            // Filtrare după curbură (C, D, CC, etc.)
            const curvature = product.attributes?.curvature as string;
            if (curvature && (values as string[]).includes(curvature)) {
              continue;
            } else if (values.length > 0) {
              matchesFilters = false;
              break;
            }
          } 
          else if (key === 'length' && values.length === 2) {
            // Filtrare după lungime (interval)
            const length = product.attributes?.length;
            if (length !== undefined) {
              const numLength = parseFloat(length as string);
              const [min, max] = values as number[];
              if (numLength < min || numLength > max) {
                matchesFilters = false;
                break;
              }
            }
          } 
          else if (key === 'thickness' && values.length > 0) {
            // Filtrare după grosime (0.05, 0.07, etc.)
            const thickness = product.attributes?.thickness as string;
            if (thickness && (values as string[]).includes(thickness)) {
              continue;
            } else if (values.length > 0) {
              matchesFilters = false;
              break;
            }
          } 
          else if (key === 'brand' && values.length > 0) {
            // Filtrare după brand
            const brand = product.attributes?.brand as string;
            if (brand && (values as string[]).includes(brand)) {
              continue;
            } else if (values.length > 0) {
              matchesFilters = false;
              break;
            }
          } 
          else if (key === 'type' && values.length > 0) {
            // Filtrare după tip (benzi, evantaie, mix, etc.)
            const type = product.attributes?.type as string;
            if (type && (values as string[]).includes(type)) {
              continue;
            } else if (values.length > 0) {
              matchesFilters = false;
              break;
            }
          }
          // Filtre suplimentare pot fi adăugate aici
        }
      }
      
      return matchesSearch && matchesCategory && matchesSubcategory && matchesStock && matchesFilters;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => b.sales - a.sales);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return filtered;
  }, [products, searchTerm, category, sortBy]);
};