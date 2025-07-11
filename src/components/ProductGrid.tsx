import React from 'react';
import { Search } from 'lucide-react';
import { products } from '@/data/products';
import { useProductFiltering } from '@/hooks/useProductFiltering';
import ProductCard from './ProductCard';

interface ProductGridProps {
  searchTerm?: string;
  category?: string;
  sortBy?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  searchTerm = '', 
  category = 'all', 
  sortBy = 'newest' 
}) => {
  const filteredAndSortedProducts = useProductFiltering({
    products,
    searchTerm,
    category,
    sortBy
  });

  if (filteredAndSortedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground text-lg">Nu au fost găsite produse</p>
        <p className="text-sm text-muted-foreground mt-2">Încearcă să modifici criteriile de căutare</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredAndSortedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;