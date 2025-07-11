import { useMemo } from 'react';
import { Product } from '@/types/Product';

interface UseProductFilteringProps {
  products: Product[];
  searchTerm: string;
  category: string;
  sortBy: string;
}

export const useProductFiltering = ({
  products,
  searchTerm,
  category,
  sortBy
}: UseProductFilteringProps) => {
  return useMemo(() => {
    let filtered = products.filter(product => {
      // Filter by search term
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by category
      const matchesCategory = category === 'all' || product.category === category;
      
      // Hide out of stock products
      const isInStock = product.inStock;
      
      return matchesSearch && matchesCategory && isInStock;
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