import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Filter, SlidersHorizontal, CloudCog, RefreshCw, 
  ChevronRight, XCircle, LayoutGrid 
} from 'lucide-react';
import ProductGrid from './ProductGrid';
import LoyaltyStatusBanner from './LoyaltyStatusBanner';
import CategoryNavigation from './CategoryNavigation';
import BreadcrumbNavigation from './BreadcrumbNavigation';
import ProductFilters, { FilterGroup, FilterState, FilterOption } from './ProductFilters';
import BackToTopButton from './BackToTopButton';
import { toast } from 'sonner';

const OnlineStore = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { categories, isLoading: isCategoriesLoading, refreshCategories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [isConnectingToCloudShop, setIsConnectingToCloudShop] = useState(false);
  const [cloudShopConnected, setCloudShopConnected] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12); // Numărul de produse pe pagină


  // Reset filters and page when category or subcategory changes
  useEffect(() => {
    setActiveFilters({});
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory]);

  // Filter the categories to only show active ones
  const activeCategories = categories.filter(cat => cat.active);

  // Configurare filtre pentru produse
  const productFilters: FilterGroup[] = [
    {
      id: 'curvature',
      name: 'Curbură',
      type: 'checkbox',
      options: [
        { id: 'C', label: 'C' },
        { id: 'CC', label: 'CC' },
        { id: 'D', label: 'D' },
        { id: 'DD', label: 'DD' },
        { id: 'L', label: 'L' },
        { id: 'LC', label: 'LC' },
        { id: 'LD', label: 'LD' },
      ],
      expanded: true
    },
    {
      id: 'length',
      name: 'Lungime',
      type: 'range',
      options: {
        min: 6,
        max: 15,
        step: 0.5,
        unit: 'mm'
      }
    },
    {
      id: 'thickness',
      name: 'Grosime',
      type: 'checkbox',
      options: [
        { id: '0.05', label: '0.05 mm' },
        { id: '0.07', label: '0.07 mm' },
        { id: '0.10', label: '0.10 mm' },
        { id: '0.12', label: '0.12 mm' },
        { id: '0.15', label: '0.15 mm' },
      ]
    },
    {
      id: 'brand',
      name: 'Brand',
      type: 'checkbox',
      options: [
        { id: 'addressbeauty', label: 'Address Beauty' },
        { id: 'luxeglam', label: 'Luxe Glam' },
        { id: 'glamlash', label: 'Glam Lash' },
        { id: 'bellalash', label: 'Bella Lash' },
      ]
    },
    {
      id: 'type',
      name: 'Tip',
      type: 'checkbox',
      options: [
        { id: 'strips', label: 'Benzi' },
        { id: 'fans', label: 'Evantaie' },
        { id: 'mix', label: 'Mix' },
        { id: 'volume', label: 'Volum' },
        { id: 'natural', label: 'Natural' },
      ]
    }
  ];

  // Opțiuni de sortare
  const sortOptions = [
    { value: 'newest', label: 'Noutăți' },
    { value: 'price-low', label: 'Preț crescător' },
    { value: 'price-high', label: 'Preț descrescător' },
    { value: 'popular', label: 'Cele mai vândute' },
  ];

  // Resetarea filtrelor
  const handleResetFilters = () => {
    setActiveFilters({});
    setCurrentPage(1);
  };

  // Actualizare filtru
  const handleFilterChange = (groupId: string, values: string[] | number[] | undefined) => {
    setActiveFilters(prev => ({
      ...prev,
      [groupId]: values
    }));
    setCurrentPage(1); // Resetăm la prima pagină când se schimbă filtrele
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6">
            Magazin Online
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Descoperă produse profesionale pentru gene false de cea mai înaltă calitate
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Caută produse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Loyalty Banner - Only shown to authenticated users */}
      {isAuthenticated && (
        <section className="py-4">
          <div className="container mx-auto px-4">
            <LoyaltyStatusBanner />
          </div>
        </section>
      )}

      {/* Filters and Categories */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">


            {/* Categories - Main categories only */}
            <div className="flex flex-wrap gap-2">
              {isCategoriesLoading ? (
                <div className="animate-pulse flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-20 bg-muted rounded-full"></div>
                  ))}
                </div>
              ) : (
                activeCategories
                  .filter(category => !category.parentId)
                  .map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedSubcategory('');
                      }}
                      className="rounded-full mb-1"
                    >
                      {category.name}
                    </Button>
                  ))
              )}
            </div>

            {/* Sort and Filter */}
            <div className="flex gap-2 items-center">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid with Category Navigation */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Category Title - Titlul categoriei curente */}
          {selectedCategory !== 'all' && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {selectedSubcategory 
                  ? activeCategories.find(c => c.id === selectedSubcategory)?.name 
                  : activeCategories.find(c => c.id === selectedCategory)?.name}
              </h2>
              {selectedCategory !== 'all' && selectedSubcategory && (
                <p className="text-muted-foreground">
                  {activeCategories.find(c => c.id === selectedSubcategory)?.description || 
                   activeCategories.find(c => c.id === selectedCategory)?.description}
                </p>
              )}
            </div>
          )}
          
          <div className="lg:flex gap-8">
            {/* Mobile filters toggle */}
            <div className="lg:hidden mb-4">
              <Button 
                variant="outline" 
                className="w-full justify-between" 
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <span className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" /> 
                  Categorii și filtre
                </span>
                <ChevronRight className={`h-4 w-4 transition-transform ${showMobileFilters ? 'rotate-90' : ''}`} />
              </Button>
            </div>
            
            {/* Category Navigation Sidebar */}
            <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block lg:w-64 flex-shrink-0`}>
              <div className="sticky top-20">
                <h3 className="font-medium text-lg mb-4">Categorii</h3>
                
                {/* Breadcrumb navigation */}
                <BreadcrumbNavigation 
                  className="mb-4"
                  items={[
                    { id: 'all', name: 'Toate produsele' },
                    ...(selectedCategory !== 'all' 
                      ? [{ 
                          id: selectedCategory, 
                          name: activeCategories.find(c => c.id === selectedCategory)?.name || 'Categorie' 
                        }] 
                      : []),
                    ...(selectedSubcategory 
                      ? [{ 
                          id: selectedSubcategory, 
                          name: activeCategories.find(c => c.id === selectedSubcategory)?.name || 'Subcategorie' 
                        }] 
                      : [])
                  ]}
                  onNavigate={(id) => {
                    if (id === 'all') {
                      setSelectedCategory('all');
                      setSelectedSubcategory('');
                    } else if (id === selectedCategory) {
                      setSelectedSubcategory('');
                    }
                  }}
                />
                
                <CategoryNavigation 
                  selectedCategory={selectedCategory}
                  selectedSubcategory={selectedSubcategory}
                  onSelectCategory={(categoryId, subcategoryId) => {
                    setSelectedCategory(categoryId);
                    setSelectedSubcategory(subcategoryId || '');
                  }} 
                />
                
                <div className="mt-8 border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Filtre</h3>
                    {Object.keys(activeFilters).length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleResetFilters} 
                        className="h-8 px-2 text-xs"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reset
                      </Button>
                    )}
                  </div>
                  
                  <ProductFilters 
                    filters={productFilters}
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                  />
                  
                  {/* Opțiune pentru afișarea produselor care nu sunt în stoc */}
                  <div className="flex items-center space-x-2 mt-6 pt-4 border-t">
                    <Switch 
                      id="show-out-of-stock"
                      checked={showOutOfStock} 
                      onCheckedChange={setShowOutOfStock}
                    />
                    <Label 
                      htmlFor="show-out-of-stock" 
                      className="text-sm cursor-pointer"
                    >
                      Arată produse indisponibile
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="flex-1">
              {/* Breadcrumb for larger screens */}
              <div className="hidden lg:block mb-6">
                <BreadcrumbNavigation 
                  items={[
                    { id: 'all', name: 'Toate produsele' },
                    ...(selectedCategory !== 'all' 
                      ? [{ 
                          id: selectedCategory, 
                          name: activeCategories.find(c => c.id === selectedCategory)?.name || 'Categorie' 
                        }] 
                      : []),
                    ...(selectedSubcategory 
                      ? [{ 
                          id: selectedSubcategory, 
                          name: activeCategories.find(c => c.id === selectedSubcategory)?.name || 'Subcategorie' 
                        }] 
                      : [])
                  ]}
                  onNavigate={(id) => {
                    if (id === 'all') {
                      setSelectedCategory('all');
                      setSelectedSubcategory('');
                    } else if (id === selectedCategory) {
                      setSelectedSubcategory('');
                    }
                  }}
                />
              </div>
              
              {/* Active filters badges */}
              {Object.keys(activeFilters).length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {Object.entries(activeFilters).map(([groupId, values]) => {
                    if (!values || values.length === 0) return null;
                    
                    const filterGroup = productFilters.find(f => f.id === groupId);
                    if (!filterGroup) return null;
                    
                    // For range filters
                    if (filterGroup.type === 'range' && values.length === 2) {
                      const rangeOption = filterGroup.options as { min: number; max: number; step: number; unit?: string };
                      return (
                        <Badge key={groupId} variant="outline" className="pl-2 pr-1 py-1 gap-1">
                          <span>{filterGroup.name}: {values[0]}{rangeOption.unit}-{values[1]}{rangeOption.unit}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleFilterChange(groupId, undefined)} 
                            className="h-4 w-4 p-0 hover:bg-transparent"
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </Badge>
                      );
                    }
                    
                    // For checkbox filters
                    return (values as string[]).map(value => {
                      const option = (filterGroup.options as FilterOption[]).find(o => o.id === value);
                      if (!option) return null;
                      
                      return (
                        <Badge key={`${groupId}-${value}`} variant="outline" className="pl-2 pr-1 py-1 gap-1">
                          <span>{filterGroup.name}: {option.label}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              const newValues = (activeFilters[groupId] as string[]).filter(v => v !== value);
                              handleFilterChange(groupId, newValues.length ? newValues : undefined);
                            }} 
                            className="h-4 w-4 p-0 hover:bg-transparent"
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </Badge>
                      );
                    });
                  })}
                </div>
              )}
            
              <ProductGrid 
                searchTerm={searchTerm} 
                category={selectedCategory} 
                subcategory={selectedSubcategory}
                filters={activeFilters}
                sortBy={sortBy} 
                showOutOfStock={showOutOfStock}
                currentPage={currentPage}
                productsPerPage={productsPerPage}
                onPageChange={setCurrentPage}
                onProductsPerPageChange={(value) => {
                  setProductsPerPage(value);
                  setCurrentPage(1); // Resetăm la prima pagină când se schimbă numărul de produse pe pagină
                }}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Back to top button */}
      <BackToTopButton />
    </div>
  );
};

export default OnlineStore;