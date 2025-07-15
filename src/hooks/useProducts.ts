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
    adeziveProducts,
    ingrijireProducts,
    consumabileProducts,
    ustensileProducts,
    ledProducts,
    laminareProducts, 
    isLoading: isFirebaseLoading 
  } = useFirebaseProducts();
  
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    // Clear existing products first to prevent mixing
    setProducts([]);
    
    try {
      // Try to get products from Cloud Shop service
      const productsFromCloudShop = await cloudShopService.getProducts();
      
      // Combine CloudShop products with Firebase products
      const allProducts = [
        ...productsFromCloudShop,
        ...geneProducts,         // Gene fir cu fir / bande
        ...adeziveProducts,      // Adezive 
        ...ingrijireProducts,    // Preparate pentru aplicare și îngrijire
        ...consumabileProducts,  // Consumabile & accesorii
        ...ustensileProducts,    // Ustensile profesionale
        ...ledProducts,          // Tehnologie LED
        ...laminareProducts      // Laminare products
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
          ...adeziveProducts,
          ...ingrijireProducts,
          ...consumabileProducts,
          ...ustensileProducts,
          ...ledProducts,
          ...laminareProducts
        ];
        setProducts(allProducts);
      } catch (localErr) {
        console.error('Failed to load local products fallback', localErr);
        // Use only Firebase products as last resort
        setProducts([
          ...geneProducts, 
          ...adeziveProducts,
          ...ingrijireProducts,
          ...consumabileProducts,
          ...ustensileProducts,
          ...ledProducts,
          ...laminareProducts
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [geneProducts, adeziveProducts, ingrijireProducts, consumabileProducts, ustensileProducts, ledProducts, laminareProducts]);
  
  // Load products on initial render and when Firebase products change
  useEffect(() => {
    // Only reload if Firebase is not loading and we have some data
    if (!isFirebaseLoading && (geneProducts.length > 0 || laminareProducts.length > 0 || ingrijireProducts.length > 0)) {
      loadProducts();
    } else if (!isFirebaseLoading) {
      // If no Firebase products but not loading, still try to load CloudShop products
      loadProducts();
    }
  }, [loadProducts, isFirebaseLoading, geneProducts.length, laminareProducts.length, ingrijireProducts.length]);
  
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
