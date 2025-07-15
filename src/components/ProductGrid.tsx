import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Cloud } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useProductFiltering, FilterState } from '@/hooks/useProductFiltering';
import ProductCard from './ProductCard';
import { Button } from './ui/button';
import PaginationControls from './PaginationControls';
import ProductsPerPageSelector from './ProductsPerPageSelector';
import { toast } from 'sonner';

interface ProductGridProps {
  searchTerm?: string;
  category?: string;
  subcategory?: string;
  sortBy?: string;
  filters?: FilterState;
  showOutOfStock?: boolean;
  currentPage?: number;
  productsPerPage?: number;
  onPageChange?: (page: number) => void;
  onProductsPerPageChange?: (value: number) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  searchTerm = '', 
  category = 'all', 
  subcategory = '',
  sortBy = 'newest',
  filters = {},
  showOutOfStock = false,
  currentPage = 1,
  productsPerPage = 12,
  onPageChange = () => {},
  onProductsPerPageChange = () => {}
}) => {
  const { products, isLoading, error, refreshProducts } = useProducts();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Add a key to force re-filtering when category changes
  const filterKey = `${category}-${subcategory}-${searchTerm}`;
  
  const filteredAndSortedProducts = useProductFiltering({
    products,
    searchTerm,
    category,
    subcategory,
    sortBy,
    filters,
    showOutOfStock
  });
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshProducts();
      toast.success('Produsele au fost actualizate');
    } catch (error) {
      toast.error('Nu s-au putut actualiza produsele');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse bg-muted rounded-lg h-72"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive text-lg mb-4">{error}</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Încearcă din nou
        </Button>
      </div>
    );
  }

  if (filteredAndSortedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground text-lg">Nu au fost găsite produse</p>
        <p className="text-sm text-muted-foreground mt-2">Încearcă să modifici criteriile de căutare</p>
      </div>
    );
  }

  // Calculăm produsele pentru pagina curentă
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);

  // Acum folosim componentul PaginationControls pentru afișarea paginației

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredAndSortedProducts.length === 0 
            ? 'Niciun produs găsit' 
            : filteredAndSortedProducts.length === 1 
              ? '1 produs găsit'
              : `${filteredAndSortedProducts.length} produse găsite`
          }
          {filteredAndSortedProducts.length > 0 && (
            <span className="ml-2">
              (Afișare {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredAndSortedProducts.length)} din {filteredAndSortedProducts.length})
            </span>
          )}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Cloud className="h-3 w-3" /> Stoc sincronizat cu Cloud Shop
          </span>
          <Button 
            onClick={handleRefresh} 
            variant="ghost" 
            size="sm" 
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <div key={product.id} className="h-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 my-8">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
        
        <ProductsPerPageSelector
          value={productsPerPage}
          onChange={onProductsPerPageChange}
          options={[12, 24, 36, 48]}
        />
      </div>
    </div>
  );
};

export default ProductGrid;