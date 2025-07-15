import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/Product';
import { NormalizedRealProduct } from '@/types/RealProduct';
import { 
  GeneProductService, 
  LaminareProductService, 
  IngrijirePersonalaProductService,
  AdeziveProductService,
  ConsumabileProductService,
  UstensileProductService
} from '@/lib/categoryProductServices';

interface UseFirebaseProductsResult {
  // Gene subcategories
  geneProducts: Product[];          // Gene fir cu fir / bande
  adeziveProducts: Product[];       // Adezive
  ingrijireProducts: Product[];     // Preparate pentru aplicare și îngrijire  
  consumabileProducts: Product[];   // Consumabile & accesorii
  ustensileProducts: Product[];     // Ustensile profesionale
  ledProducts: Product[];           // Tehnologie LED (static for now)
  
  // Laminare subcategories  
  laminareProducts: Product[];      // All laminare products
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

// Global counter to ensure truly unique IDs
let globalIdCounter = 0;

// Function to convert NormalizedRealProduct to Product
const convertToProduct = (realProduct: NormalizedRealProduct, category: string): Product => {
  // Only set originalPrice if there's an actual discount
  const hasDiscount = realProduct.discount && realProduct.discount > 0;
  const originalPrice = hasDiscount ? realProduct.originalPrice : null;
  
  // Create absolutely unique ID using global counter + category + timestamp
  globalIdCounter++;
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000);
  
  let categoryBase: number;
  switch (category) {
    case 'lashes-individual':
      categoryBase = 200000; // Gene fir cu fir / bande
      break;
    case 'lashes-adhesives':
      categoryBase = 210000; // Adezive
      break;
    case 'lashes-care':
      categoryBase = 220000; // Preparate pentru aplicare și îngrijire
      break;
    case 'lashes-consumables':
      categoryBase = 230000; // Consumabile & accesorii
      break;
    case 'lashes-tools':
      categoryBase = 240000; // Ustensile profesionale
      break;
    case 'lashes-led':
      categoryBase = 250000; // Tehnologie LED
      break;
    case 'lamination':
      categoryBase = 300000; // Laminare products
      break;
    case 'cosmetics':
      categoryBase = 400000; // Îngrijire Personală
      break;
    default:
      categoryBase = 500000;
  }
  
  // Combine category base + global counter + random suffix
  const uniqueId = categoryBase + (globalIdCounter * 1000) + randomSuffix;
  
  // Map subcategory to main category for filtering
  const getMainCategory = (subcategory: string): string => {
    if (subcategory.startsWith('lashes-')) return 'lashes';
    if (subcategory.startsWith('brows-')) return 'brows';
    if (subcategory.startsWith('lamination')) return 'lamination';
    if (subcategory === 'cosmetics') return 'cosmetics';
    return subcategory;
  };

  const mainCategory = getMainCategory(category);
  
  return {
    id: uniqueId,
    name: realProduct.name || '',
    description: realProduct.description || '',
    price: realProduct.price?.mdl || 0, // Use MDL price instead of EUR
    originalPrice: originalPrice, // Only set if there's a real discount
    image: realProduct.image || '/placeholder.svg',
    category: mainCategory, // Main category for filtering
    subcategories: [category], // Subcategory for detailed filtering
    inStock: realProduct.inStock || false,
    stockQuantity: realProduct.stockQuantity || 0,
    rating: 4.5, // Default rating
    reviews: 0, // Default reviews
    isNew: false, // Default value
    sales: 0, // Default sales
    attributes: {
      type: realProduct.specifications?.type || '',
      color: realProduct.specifications?.color || '',
      thickness: realProduct.specifications?.thickness || '',
      curl: realProduct.specifications?.curl || '',
      length: realProduct.specifications?.length || '',
      code: realProduct.code,
      ...realProduct.specifications
    },
    specifications: {
      code: realProduct.code,
      thickness: realProduct.specifications?.thickness || '',
      curl: realProduct.specifications?.curl || '',
      length: realProduct.specifications?.length || '',
      color: realProduct.specifications?.color || '',
      type: realProduct.specifications?.type || ''
    }
  };
};

export function useFirebaseProducts(): UseFirebaseProductsResult {
  // Gene subcategory states
  const [geneProducts, setGeneProducts] = useState<Product[]>([]);
  const [adeziveProducts, setAdeziveProducts] = useState<Product[]>([]);
  const [ingrijireProducts, setIngrijireProducts] = useState<Product[]>([]);
  const [consumabileProducts, setConsumabileProducts] = useState<Product[]>([]);
  const [ustensileProducts, setUstensileProducts] = useState<Product[]>([]);
  const [ledProducts, setLedProducts] = useState<Product[]>([]); // Static for now
  
  // Laminare products
  const [laminareProducts, setLaminareProducts] = useState<Product[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load products from each Firebase collection
      const [geneData, adeziveData, ingrijireData, consumabileData, ustensileData, laminareData] = await Promise.all([
        GeneProductService.getAllGeneProducts().catch(() => []),
        AdeziveProductService.getAllAdeziveProducts().catch(() => []),
        IngrijirePersonalaProductService.getAllIngrijirePersonalaProducts().catch(() => []),
        ConsumabileProductService.getAllConsumabileProducts().catch(() => []),
        UstensileProductService.getAllUstensileProducts().catch(() => []),
        LaminareProductService.getAllLaminareProducts().catch(() => [])
      ]);

      // Convert to Product format with appropriate categories
      const convertedGeneProducts = geneData.map(p => convertToProduct(p, 'lashes-individual'));
      const convertedAdeziveProducts = adeziveData.map(p => convertToProduct(p, 'lashes-adhesives'));
      const convertedIngrijireProducts = ingrijireData.map(p => convertToProduct(p, 'lashes-care'));
      const convertedConsumabileProducts = consumabileData.map(p => convertToProduct(p, 'lashes-consumables'));
      const convertedUstensileProducts = ustensileData.map(p => convertToProduct(p, 'lashes-tools'));
      const convertedLaminareProducts = laminareData.map(p => convertToProduct(p, 'lamination'));

      setGeneProducts(convertedGeneProducts);
      setAdeziveProducts(convertedAdeziveProducts);
      setIngrijireProducts(convertedIngrijireProducts);
      setConsumabileProducts(convertedConsumabileProducts);
      setUstensileProducts(convertedUstensileProducts);
      setLaminareProducts(convertedLaminareProducts);
      
      // LED products - static for now, will be implemented later
      setLedProducts([]);

      // Debug logging
      console.log('🔥 Firebase Products Loaded:');
      console.log('Gene products:', convertedGeneProducts.length);
      console.log('Adezive products:', convertedAdeziveProducts.length);
      console.log('Ingrijire products:', convertedIngrijireProducts.length);
      console.log('Consumabile products:', convertedConsumabileProducts.length);
      console.log('Ustensile products:', convertedUstensileProducts.length);
      console.log('Laminare products:', convertedLaminareProducts.length);
      console.log('Sample gene product:', convertedGeneProducts[0]);
      console.log('Sample adezive product:', convertedAdeziveProducts[0]);

    } catch (err) {
      console.error('Failed to load Firebase products:', err);
      setError('Nu s-au putut încărca produsele din Firebase.');
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
    geneProducts,
    adeziveProducts,
    ingrijireProducts,
    consumabileProducts,
    ustensileProducts,
    ledProducts,
    laminareProducts,
    isLoading,
    error,
    refreshProducts
  };
}
