import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/Product';
import cloudShopService from '@/lib/CloudShopService';
import { useCategories } from '@/contexts/CategoriesContext';
import { useFirebaseProducts } from './useFirebaseProducts';

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
  
  // Get Firebase products for specific categories
  const { 
    geneProducts, 
    laminareProducts, 
    ingrijireProducts, 
    isLoading: isFirebaseLoading 
  } = useFirebaseProducts();
  
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to get products from Cloud Shop service
      const productsFromCloudShop = await cloudShopService.getProducts();
      
      // Combine CloudShop products with Firebase products
      const allProducts = [
        ...productsFromCloudShop,
        ...geneProducts,      // Gene products from Firebase
        ...laminareProducts,  // Laminare products from Firebase  
        ...ingrijireProducts  // Îngrijire Personală products from Firebase
      ];
      
      setProducts(allProducts);
    } catch (err) {
      console.error('Failed to load products from Cloud Shop', err);
      setError('Nu s-au putut încărca produsele. Vă rugăm încercați din nou mai târziu.');
      
      // Fallback: Use only Firebase products + local products
      try {
        const { products: localProducts } = await import('@/data/products');
        const allProducts = [
          ...localProducts,
          ...geneProducts,
          ...laminareProducts,
          ...ingrijireProducts
        ];
        setProducts(allProducts);
      } catch (localErr) {
        console.error('Failed to load local products fallback', localErr);
        // Use only Firebase products as last resort
        setProducts([...geneProducts, ...laminareProducts, ...ingrijireProducts]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [geneProducts, laminareProducts, ingrijireProducts]);
  
  // Load products on initial render and when Firebase products change
  useEffect(() => {
    if (!isFirebaseLoading) {
      loadProducts();
    }
  }, [loadProducts, isFirebaseLoading]);
  
  const refreshProducts = async () => {
    await loadProducts();
  };

  return {
    products,
    isLoading: isLoading || isFirebaseLoading,
    error,
    refreshProducts
  };
}
