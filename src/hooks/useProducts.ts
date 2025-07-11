import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/Product';
import cloudShopService from '@/lib/CloudShopService';
import { useCategories } from '@/contexts/CategoriesContext';

interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { categories } = useCategories();
  
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to get products from Cloud Shop service
      const productsFromCloudShop = await cloudShopService.getProducts();
      setProducts(productsFromCloudShop);
    } catch (err) {
      console.error('Failed to load products from Cloud Shop', err);
      setError('Nu s-au putut încărca produsele. Vă rugăm încercați din nou mai târziu.');
      
      // Fallback to local products if Cloud Shop fails
      try {
        const { products: localProducts } = await import('@/data/products');
        setProducts(localProducts);
      } catch (localErr) {
        console.error('Failed to load local products fallback', localErr);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Load products on initial render
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  
  const refreshProducts = async () => {
    await loadProducts();
  };
  
  return {
    products,
    isLoading,
    error,
    refreshProducts,
  };
}
