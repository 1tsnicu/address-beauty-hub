// Funcție pentru extragere semantică din denumirea produsului
function extractProductDetails(name: string) {
  // Curbură
  const curvature = (name.match(/\b(C|CC|D|DD|L|LC|LD)\b/) || [])[1] || null;
  // Lungime (extrage doar cifra, fără 'mm')
  const lengthMatch = name.match(/(\d{1,2}(?:\.\d)?)mm/);
  const length = lengthMatch ? lengthMatch[1] : null;
  // Grosime (extrage doar cifra, fără 'mm')
  const thickness = (name.match(/(0\.05|0\.07|0\.10|0\.12|0\.15)/) || [])[1] || null;
  // Brand
  const brand = ['Address Beauty', 'Luxe Glam', 'Glam Lash', 'Bella Lash'].find(b => name.includes(b)) || null;
  // Tip
  const type = ['Benzi', 'Evantaie', 'mix', 'Volum', 'Natural'].find(t => name.toLowerCase().includes(t.toLowerCase())) || null;
  return { curvature, length, thickness, brand, type };
}
import React, { useState, useEffect } from 'react';
import { useCategories } from '@/contexts/CategoriesContext';
import { Search, RefreshCw, Cloud } from 'lucide-react';
import { useProductFiltering, FilterState } from '@/hooks/useProductFiltering';
import ProductCard from './ProductCard';
import { Button } from './ui/button';
import PaginationControls from './PaginationControls';
import ProductsPerPageSelector from './ProductsPerPageSelector';
import { toast } from 'sonner';

interface SemanticFilterState {
  curvature?: string[];
  length?: string[];
  thickness?: string[];
  brand?: string[];
  type?: string[];
}

interface ProductGridProps {
  searchTerm?: string;
  category?: string;
  subcategory?: string;
  sortBy?: string;
  filters?: SemanticFilterState;
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
  // Fetch produse din toate tabelele relevante din Supabase
  const { categories } = useCategories();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Mapare: tabel -> categorie și subcategorie conform structurii magazinului
      const tableCategoryMap = {
        gene: { category: 'Gene', subcategory: 'Gene fir cu fir / bande' },
        adezive: { category: 'Gene', subcategory: 'Adezive' },
        preparate: { category: 'Gene', subcategory: 'Preparate pentru aplicare și îngrijire' },
        'ingrijire-personala': { category: 'Gene', subcategory: 'Preparate pentru aplicare și îngrijire' },
        accesorii: { category: 'Gene', subcategory: 'Consumabile & accesorii' },
        consumabile: { category: 'Gene', subcategory: 'Consumabile & accesorii' },
        ustensile: { category: 'Gene', subcategory: 'Ustensile profesionale' },
        laminare: { category: 'Laminare', subcategory: 'Soluții pentru laminare' },
        // Poți adăuga aici și restul tabelelor când le ai
      };
      const tables = Object.keys(tableCategoryMap);
      const allProducts: any[] = [];
      for (const table of tables) {
        // @ts-ignore
        const { data, error } = await window.supabase.from(table).select('*');
        if (error) throw new Error(error.message);
        if (data && Array.isArray(data) && data.length > 0) {
          data.forEach((prod: any) => {
            const details = extractProductDetails(prod.name);
            allProducts.push({
              id: prod.id,
              name: prod.name,
              price: prod.sale_price ?? 0,
              originalPrice: prod.sale_price ?? null,
              image: prod.image_url ?? '/placeholder.svg',
              rating: 0,
              reviews: 0,
              inStock: (prod.store_stock ?? prod.total_stock ?? 0) > 0,
              stockQuantity: prod.store_stock ?? prod.total_stock ?? 0,
              isNew: false,
              category: tableCategoryMap[table]?.category ?? '',
              subcategory: tableCategoryMap[table]?.subcategory ?? '',
              discount: prod.discount ?? 0,
              description: prod.sku ? `SKU: ${prod.sku}` : '',
              specifications: {},
              variants: [],
              attributes: {},
              ...details,
            });
          });
        } else {
          // Debug: dacă nu există date, loghează ce vine din Supabase
          console.warn(`Tabela ${table} nu are date sau structura e greșită:`, data);
        }
      }
      setProducts(allProducts);
    } catch (err: any) {
      setError(err.message || 'Eroare la încărcarea produselor');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
    // eslint-disable-next-line
  }, []);
  // ...existing code...
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Add a key to force re-filtering when category changes
  const filterKey = `${category}-${subcategory}-${searchTerm}`;
  
  // DEBUG: Afișează toate produsele fără filtrare
  // Filtrare după categorie și subcategorie selectată
  // Filtrare semantică pe baza filtrelor extrase
  const filteredAndSortedProducts = products.filter(product => {
  // Filtrare după searchTerm (caută în nume, brand, tip, descriere)
  if (searchTerm && searchTerm.trim() !== '') {
    const term = searchTerm.trim().toLowerCase();
    const inName = product.name?.toLowerCase().includes(term);
    const inBrand = product.brand?.toLowerCase().includes(term);
    const inType = product.type?.toLowerCase().includes(term);
    const inDesc = product.description?.toLowerCase().includes(term);
    if (!inName && !inBrand && !inType && !inDesc) return false;
  }
  // Filtrare semantică (ex: activeFilters)
  if (filters?.curvature && (filters.curvature as string[]).length > 0 && !(filters.curvature as string[]).includes(product.curvature)) return false;
  // Filtrare lungime pe interval numeric
  if (filters?.length && Array.isArray(filters.length) && filters.length.length === 2) {
    const [min, max] = filters.length.map(Number);
    const prodLength = Number(product.length);
    if (isNaN(prodLength) || prodLength < min || prodLength > max) return false;
  }
  if (filters?.thickness && (filters.thickness as string[]).length > 0 && !(filters.thickness as string[]).includes(product.thickness)) return false;
  if (filters?.brand && (filters.brand as string[]).length > 0 && !(filters.brand as string[]).includes(product.brand)) return false;
  if (filters?.type && (filters.type as string[]).length > 0 && !(filters.type as string[]).includes(product.type)) return false;
  // Filtrare după subcategorie (id din context)
  // Eliminat filtrarea după subcategorie
  // Filtrare după categorie (id din context)
  if (category && category !== 'all') {
    const catName = categories.find(c => c.id === category)?.name ?? category;
    if (catName === 'Laminarea' || catName === 'Laminare') {
      if (product.category !== 'Laminare') return false;
    } else {
      if (product.category !== catName) return false;
    }
  }
  return true;
});

// Sortare după sortBy
const sortedProducts = (() => {
  switch (sortBy) {
    case 'price-low':
      return [...filteredAndSortedProducts].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    case 'price-high':
      return [...filteredAndSortedProducts].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    case 'popular':
      return [...filteredAndSortedProducts].sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));
    case 'newest':
    default:
      return [...filteredAndSortedProducts].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  }
})();
  
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
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Acum folosim componentul PaginationControls pentru afișarea paginației

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {sortedProducts.length === 0 
            ? 'Niciun produs găsit' 
            : sortedProducts.length === 1 
              ? '1 produs găsit'
              : `${sortedProducts.length} produse găsite`
          }
          {sortedProducts.length > 0 && (
            <span className="ml-2">
              (Afișare {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, sortedProducts.length)} din {sortedProducts.length})
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
          <div key={product.category + '-' + product.id} className="h-full">
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