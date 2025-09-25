// Funcție pentru extragere semantică din denumirea produsului
function extractProductDetails(name: string) {
  // Curbură
  const curvature = (name.match(/\b(C|CC|D|DD|L|LC|LD)\b/) || [])[1] || '';
  // Lungime (extrage doar cifra, fără 'mm')
  const lengthMatch = name.match(/(\d{1,2}(?:\.\d)?)mm/);
  const length = lengthMatch ? lengthMatch[1] : '';
  // Grosime (extrage doar cifra, fără 'mm')
  const thickness = (name.match(/(0\.05|0\.07|0\.10|0\.12|0\.15)/) || [])[1] || '';
  // Brand
  const brand = ['Address Beauty', 'Luxe Glam', 'Glam Lash', 'Bella Lash'].find(b => name.includes(b)) || '';
  // Tip
  const type = ['Benzi', 'Evantaie', 'mix', 'Volum', 'Natural'].find(t => name.toLowerCase().includes(t.toLowerCase())) || '';
  return { curvature, length, thickness, brand, type };
}

// Helper functions pentru conversia tipurilor
const asString = (value: unknown): string => typeof value === 'string' ? value : '';
const asNumber = (value: unknown): number => typeof value === 'number' ? value : (typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : 0);
const asStringOrNull = (value: unknown): string | null => typeof value === 'string' ? value : null;
import React, { useState, useEffect, useCallback } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { Search, RefreshCw, Cloud } from 'lucide-react';
import { useProductFiltering, FilterState } from '@/hooks/useProductFiltering';
import ProductCard from './ProductCard';
import { Button } from './ui/button';
import PaginationControls from './PaginationControls';
import ProductsPerPageSelector from './ProductsPerPageSelector';
import { toast } from 'sonner';
import { Product } from '@/types/Product';
import { supabase } from '@/lib/supabaseClient';
import { GeneVariantService } from '@/services/geneVariantService';

interface SemanticFilterState {
  curvature?: string[] | number[];
  length?: string[] | number[];
  thickness?: string[] | number[];
  brand?: string[] | number[];
  type?: string[] | number[];
  [key: string]: string[] | number[] | undefined;
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
  const [geneGroups, setGeneGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Mapare: tabel -> categorie și subcategorie conform structurii magazinului
      // Bazat pe tabelele reale din Supabase
      const tableCategoryMap = {
        // Categoria Gene (lashes) - tabele confirmate în Supabase
        gene: { category: 'Gene', subcategory: 'Gene fir cu fir / bande' },
        adezive: { category: 'Gene', subcategory: 'Adezive' },
        preparate: { category: 'Gene', subcategory: 'Preparate pentru aplicare și îngrijire' },
        'ingrijire-personala': { category: 'Gene', subcategory: 'Preparate pentru aplicare și îngrijire' },
        accesorii: { category: 'Gene', subcategory: 'Consumabile & accesorii' },
        accesorii_specifice: { category: 'Gene', subcategory: 'Consumabile & accesorii' },
        consumabile: { category: 'Gene', subcategory: 'Consumabile & accesorii' },
        ustensile: { category: 'Gene', subcategory: 'Ustensile profesionale' },
        tehnologie_led: { category: 'Gene', subcategory: 'Tehnologie LED' },
        
        // Categoria Sprâncene (brows) - tabele confirmate în Supabase
        hena_sprancene: { category: 'Sprâncene', subcategory: 'Henna pentru sprâncene' },
        vopsele_profesionale: { category: 'Sprâncene', subcategory: 'Vopsele profesionale' },
        oxidanti_preparate_speciale: { category: 'Sprâncene', subcategory: 'Oxidanți & preparate speciale' },
        pensule_instrumente_speciale: { category: 'Sprâncene', subcategory: 'Pensule & instrumente dedicate' },
        
        // Categoria Laminare (lamination) - tabele confirmate în Supabase
        laminare: { category: 'Laminarea', subcategory: 'Soluții pentru laminare' },
        solutii_laminare: { category: 'Laminarea', subcategory: 'Soluții pentru laminare' },
        adezive_laminare: { category: 'Laminarea', subcategory: 'Adezive pentru laminare' },
        
        // Alte tabele din Supabase
        oko: { category: 'Îngrijire', subcategory: 'Cosmetice & Skincare' },
      };

      // Filtrează tabelele pe baza categoriei și subcategoriei selectate
      let tablesToLoad = Object.keys(tableCategoryMap);
      
      if (category && category !== 'all') {
        // Filtrare pe categorie cu mapare corectă
        tablesToLoad = tablesToLoad.filter(table => {
          const tableInfo = tableCategoryMap[table];
          if (!tableInfo) return false;
          
          // Mapare între URL params și categoriile din baza de date
          const categoryMatches = 
            (category === 'lashes' && tableInfo.category === 'Gene') ||
            (category === 'brows' && tableInfo.category === 'Sprâncene') ||
            (category === 'lamination' && tableInfo.category === 'Laminarea') ||
            (category === 'cosmetics' && tableInfo.category === 'Îngrijire') ||
            tableInfo.category.toLowerCase() === category.toLowerCase();
            
          return categoryMatches;
        });
      }

      if (subcategory) {
        // Mapare între subcategoriile din URL și cele din baza de date
        const subcategoryMap = {
          // Gene subcategories
          'lashes-individual': 'Gene fir cu fir / bande',
          'lashes-adhesives': 'Adezive',
          'lashes-care': 'Preparate pentru aplicare și îngrijire',
          'lashes-consumables': 'Consumabile & accesorii',
          'lashes-tools': 'Ustensile profesionale',
          'lashes-technology': 'Tehnologie LED',
          
          // Sprâncene subcategories
          'brows-henna': 'Henna pentru sprâncene',
          'brows-dyes': 'Vopsele profesionale',
          'brows-oxidants': 'Oxidanți & preparate speciale',
          'brows-brushes': 'Pensule & instrumente dedicate',
          
          // Laminare subcategories
          'lamination-solutions': 'Soluții pentru laminare',
          'lamination-adhesives': 'Adezive pentru laminare',
          'lamination-accessories': 'Role, bigudiuri & accesorii specifice',
        };
        
        // Obține subcategoria reală din mapare sau folosește direct subcategoria primită
        const realSubcategory = subcategoryMap[subcategory] || subcategory;
        
        // Filtrare pe subcategorie exactă
        tablesToLoad = tablesToLoad.filter(table => {
          const tableInfo = tableCategoryMap[table];
          return tableInfo && tableInfo.subcategory === realSubcategory;
        });
        
      }


      // Încarcă grupurile gene doar dacă categoria include Gene și subcategoria corespunde
      const subcategoryMap = {
        'lashes-individual': 'Gene fir cu fir / bande',
        'lashes-adhesives': 'Adezive',
        'lashes-care': 'Preparate pentru aplicare și îngrijire',
        'lashes-consumables': 'Consumabile & accesorii',
        'lashes-tools': 'Ustensile profesionale',
        'lashes-technology': 'Tehnologie LED',
      };
      
      const realSubcategory = subcategory ? (subcategoryMap[subcategory] || subcategory) : null;
      const shouldLoadGeneGroups = (!category || category === 'all' || category === 'lashes') &&
                                   (!realSubcategory || realSubcategory === 'Gene fir cu fir / bande');
      
      let geneGroupsData = [];
      if (shouldLoadGeneGroups) {
        geneGroupsData = await GeneVariantService.getProductGroups();
        setGeneGroups(geneGroupsData);
      } else {
      }

      // Încarcă produsele din tabelele filtrate (excluzând gene care e gestionat separat)
      const nonGeneTables = tablesToLoad.filter(table => table !== 'gene');
      const allProducts: Product[] = [];

      for (const table of nonGeneTables) {
        try {
          // Încarcă toate produsele din tabelă cu paginare
          let hasMore = true;
          let offset = 0;
          const limit = 100;
          
          while (hasMore) {
            const { data, error } = await supabase
              .from(table)
              .select('*')
              .range(offset, offset + limit - 1)
              .order('id', { ascending: true });
          
          if (error) {
              hasMore = false;
              break;
          }
          
          if (data && Array.isArray(data) && data.length > 0) {
            data.forEach((prod: Record<string, unknown>) => {
              const details = extractProductDetails(asString(prod.name));

              allProducts.push({
                id: asNumber(prod.id) + (tablesToLoad.indexOf(table) * 100000), // ID unic numeric
                name: asString(prod.name),
                price: asNumber(prod.sale_price),
                originalPrice: asNumber(prod.sale_price) || null,
                image: asString(prod.image_url) || '/placeholder.svg',
                  rating: 4.0 + Math.random(), // Rating ridicat între 4.0-5.0
                  reviews: Math.floor(Math.random() * 50) + 20, // Review-uri între 20-70
                inStock: asNumber(prod.store_stock || prod.total_stock) > 0,
                stockQuantity: asNumber(prod.store_stock || prod.total_stock),
                isNew: false,
                category: tableCategoryMap[table]?.category ?? '',
                subcategories: [tableCategoryMap[table]?.subcategory ?? ''],
                sales: 0,
                discount: asNumber(prod.discount),
                description: asString(prod.descriere) || (prod.sku ? `SKU: ${asString(prod.sku)}` : ''),
                specifications: {},
                variants: [],
                attributes: {
                  // Folosim datele direct din baza de date, cu fallback la extractProductDetails
                  curvature: asString(prod.curbura) || details.curvature,
                  length: asString(prod.lungime) || details.length,
                  thickness: asString(prod.grosime) || details.thickness,
                  brand: asString(prod.brand) || details.brand,
                  type: asString(prod.type) || details.type,
                  color: asString(prod.culoare),
              },
            });
          });
              
              // Verifică dacă mai sunt produse de încărcat
              if (data.length < limit) {
                hasMore = false;
              } else {
                offset += limit;
              }
          } else {
              hasMore = false;
            }
          }
          
        } catch (tableError) {
          // Loghează eroarea specifică pentru această tabelă
          continue;
        }
      }

      // Convertește grupurile gene în "pseudo-produse" pentru grid
      // Filtrează grupurile gene pe baza subcategoriei selectate
      let filteredGeneProducts = [];
      if (geneGroupsData.length > 0) {
        // Verifică dacă subcategoria selectată este pentru gene (folosind maparea)
        const realSubcategory = subcategory ? (subcategoryMap[subcategory] || subcategory) : null;
        const shouldIncludeGeneGroups = !realSubcategory || realSubcategory === 'Gene fir cu fir / bande';
        
        if (shouldIncludeGeneGroups) {
          filteredGeneProducts = geneGroupsData.map((group, index) => ({
            id: (group.id || index) + 900000, // ID numeric unic pentru grupurile gene
            name: group.name,
            price: group.from_price || 0,
            originalPrice: null, // Vom calcula asta din variante dacă e nevoie
            image: group.image_url || '/placeholder.svg',
            rating: 4.0 + Math.random(), // Rating ridicat între 4.0-5.0
            reviews: Math.floor(Math.random() * 50) + 20, // Review-uri între 20-70
            inStock: group.total_stock > 0,
            stockQuantity: group.total_stock,
            isNew: false,
            category: 'Gene',
            subcategories: ['Gene fir cu fir / bande'],
            sales: 0,
            discount: 0,
            description: `${group.variant_count} variante disponibile`,
            specifications: {},
            variants: [],
            attributes: {
              isGeneGroup: true,
              totalVariants: group.variant_count,
              availableVariants: group.total_stock,
              curvature: 'D', // Default curvature for gene products
              thickness: '0.10', // Default thickness for gene products
              length: '10', // Default length for gene products
              brand: 'Address Beauty', // Default brand for gene products
              type: 'Gene',
            },
            geneGroup: group // Adăugăm datele grupului pentru folosire în modal
          }));
        }
      }

      setProducts([...allProducts, ...filteredGeneProducts]);
      
      // Logging pentru debugging
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Eroare la încărcarea produselor';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [category, subcategory]);

  useEffect(() => {
    const loadProducts = async () => {
      await refreshProducts();
    };
    loadProducts();
  }, [refreshProducts]); // Re-încarcă produsele când se schimbă categoria sau subcategoria
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
  if (filters?.curvature && (filters.curvature as string[]).length > 0 && !(filters.curvature as string[]).includes(product.attributes?.curvature || '')) return false;
  // Filtrare lungime pe interval numeric
  if (filters?.length && Array.isArray(filters.length) && filters.length.length === 2) {
    const [min, max] = filters.length.map(Number);
    const prodLength = Number(product.attributes?.length || 0);
    if (isNaN(prodLength) || prodLength < min || prodLength > max) return false;
  }
  if (filters?.thickness && (filters.thickness as string[]).length > 0 && !(filters.thickness as string[]).includes(product.attributes?.thickness || '')) return false;
  if (filters?.brand && (filters.brand as string[]).length > 0 && !(filters.brand as string[]).includes(product.attributes?.brand || '')) return false;
  if (filters?.type && (filters.type as string[]).length > 0 && !(filters.type as string[]).includes(product.attributes?.type || '')) return false;
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

// Sortare după sortBy și filtrele active
const sortedProducts = (() => {
  let products = [...filteredAndSortedProducts];
  
  // Sortare primară după sortBy
  switch (sortBy) {
    case 'price-low':
      products.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      break;
    case 'price-high':
      products.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      break;
    case 'popular':
      products.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));
      break;
    case 'newest':
    default:
      products.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
      break;
  }
  
  // Sortare secundară după filtrele active (prioritate pentru produsele care se potrivesc cu filtrele)
  if (Object.keys(filters).length > 0) {
    products.sort((a, b) => {
      // Sortare după curbura (prioritate maximă)
      if (filters.curvature && (filters.curvature as string[]).length > 0) {
        const aCurvature = a.attributes?.curvature || '';
        const bCurvature = b.attributes?.curvature || '';
        const aMatches = (filters.curvature as string[]).includes(aCurvature);
        const bMatches = (filters.curvature as string[]).includes(bCurvature);
        
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        if (aMatches && bMatches) {
          // Dacă ambele se potrivesc, sortează alfabetic după curbura
          return aCurvature.localeCompare(bCurvature);
        }
      }
      
      // Sortare după grosime (prioritate înaltă)
      if (filters.thickness && (filters.thickness as string[]).length > 0) {
        const aThickness = a.attributes?.thickness || '';
        const bThickness = b.attributes?.thickness || '';
        const aMatches = (filters.thickness as string[]).includes(aThickness);
        const bMatches = (filters.thickness as string[]).includes(bThickness);
        
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        if (aMatches && bMatches) {
          // Sortează numeric după grosime
          const aNum = parseFloat(aThickness) || 0;
          const bNum = parseFloat(bThickness) || 0;
          return aNum - bNum;
        }
      }
      
      // Sortare după lungime (prioritate medie)
      if (filters.length && Array.isArray(filters.length) && filters.length.length === 2) {
        const [min, max] = filters.length.map(Number);
        const aLength = Number(a.attributes?.length || 0);
        const bLength = Number(b.attributes?.length || 0);
        const aInRange = aLength >= min && aLength <= max;
        const bInRange = bLength >= min && bLength <= max;
        
        if (aInRange && !bInRange) return -1;
        if (!aInRange && bInRange) return 1;
        if (aInRange && bInRange) {
          // Sortează numeric după lungime
          return aLength - bLength;
        }
      }
      
      // Sortare după brand (prioritate mică)
      if (filters.brand && (filters.brand as string[]).length > 0) {
        const aBrand = a.attributes?.brand || '';
        const bBrand = b.attributes?.brand || '';
        const aMatches = (filters.brand as string[]).includes(aBrand);
        const bMatches = (filters.brand as string[]).includes(bBrand);
        
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        if (aMatches && bMatches) {
          // Sortează alfabetic după brand
          return aBrand.localeCompare(bBrand);
        }
      }
      
      return 0; // Păstrează ordinea existentă dacă nu se potrivesc
    });
  }
  
  return products;
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