import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Filter, ChevronLeft, ChevronRight, XCircle, LayoutGrid,
  Eye, Palette, Sparkles, Heart, Scissors, Droplets, Wrench, Zap, Lightbulb, Package,
  ChevronDown, ChevronUp
} from 'lucide-react';
import ProductGrid from './ProductGrid';
import LoyaltyStatusBanner from './LoyaltyStatusBanner';
import BreadcrumbNavigation from './BreadcrumbNavigation';
import ProductFilters, { FilterGroup, FilterState, FilterOption } from './ProductFilters';
import BackToTopButton from './BackToTopButton';

const CategoryProductsPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { categories } = useCategories();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);

  // Get current category
  const currentCategory = categories.find(cat => cat.id === categoryId);
  const subcategories = categories.filter(cat => cat.parentId === categoryId);

  // Reset filters and page when category changes
  useEffect(() => {
    setActiveFilters({});
    setCurrentPage(1);
    setSelectedSubcategory('');
  }, [categoryId]);

  // Configurare filtre pentru produse
  const productFilters: FilterGroup[] = [
    {
      id: 'curvature',
      name: t('category.filters.curvature'),
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
      name: t('category.filters.length'),
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
      name: t('category.filters.thickness'),
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
      name: t('category.filters.brand'),
      type: 'checkbox',
      options: [
        { id: 'addressbeauty', label: 'Address Beauty' },
        { id: 'luxeglam', label: 'Luxe Glam' },
        { id: 'glamlash', label: 'Glam Lash' },
        { id: 'bellalash', label: 'Bella Lash' },
      ]
    }
  ];

  // Opțiuni de sortare
  const sortOptions = [
    { value: 'newest', label: t('category.sort.newest') },
    { value: 'price-low', label: t('category.sort.price.low') },
    { value: 'price-high', label: t('category.sort.price.high') },
    { value: 'popular', label: t('category.sort.popular') },
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
    setCurrentPage(1);
  };

  // Get category icon
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'lashes':
        return <Eye className="h-6 w-6" />;
      case 'brows':
        return <Palette className="h-6 w-6" />;
      case 'lamination':
        return <Sparkles className="h-6 w-6" />;
      case 'cosmetics':
        return <Heart className="h-6 w-6" />;
      default:
        return <LayoutGrid className="h-6 w-6" />;
    }
  };

  // Get subcategory icon
  const getSubcategoryIcon = (subcategoryId: string) => {
    switch (subcategoryId) {
      case 'lashes-individual':
        return <Scissors className="h-4 w-4" />;
      case 'lashes-adhesives':
        return <Droplets className="h-4 w-4" />;
      case 'lashes-care':
        return <Heart className="h-4 w-4" />;
      case 'lashes-consumables':
        return <Package className="h-4 w-4" />;
      case 'lashes-tools':
        return <Wrench className="h-4 w-4" />;
      case 'lashes-led':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <LayoutGrid className="h-4 w-4" />;
    }
  };

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Categoria nu a fost găsită</h1>
          <Link to="/magazin">
            <Button>Înapoi la Magazin</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-4">
            <Link to="/magazin">
              <Button variant="ghost" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Înapoi la Categorii
              </Button>
            </Link>
          </div>

          {/* Category Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 rounded-2xl mb-4">
              <div className="text-primary">
                {getCategoryIcon(categoryId!)}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#1a1a1a] mb-3">
              {currentCategory.name}
            </h1>
            {currentCategory.description && (
              <p className="text-lg text-[#1a1a1a] max-w-2xl mx-auto">
                {currentCategory.description}
              </p>
            )}
          </div>

          {/* Search Bar - Hidden on category page, moved to header or removed */}
          {/* Search functionality can be accessed via filters or removed entirely */}
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

            {/* Subcategories */}
      {subcategories.length > 0 && (
        <section className="py-6 bg-gradient-to-b from-slate-50/50 via-blue-50/30 to-indigo-50/20">
          <div className="container mx-auto px-4">
            {/* Desktop: Show all subcategories directly - More subtle and elegant design */}
            <div className="hidden md:flex flex-wrap gap-2 justify-center">
              {subcategories.map((subcategory) => (
                <Button
                  key={subcategory.id}
                  variant={selectedSubcategory === subcategory.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubcategory(subcategory.id)}
                  className="rounded-lg px-3 py-2 h-auto flex items-center gap-2 text-xs hover:scale-105 transition-transform border border-gray-200 hover:border-primary/50"
                >
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full ${
                    selectedSubcategory === subcategory.id
                      ? 'bg-white/20'
                      : 'bg-primary/10'
                  }`}>
                    {getSubcategoryIcon(subcategory.id)}
                  </div>
                  <span className="font-medium text-center leading-tight">
                    {subcategory.name}
                  </span>
                </Button>
              ))}
            </div>

            {/* Mobile: Subtle subcategories list */}
            <div className="md:hidden">
              {/* Show all subcategories directly - more compact and elegant */}
              <div className="flex flex-col gap-2">
                {subcategories.map((subcategory) => (
                  <Button
                    key={subcategory.id}
                    variant={selectedSubcategory === subcategory.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedSubcategory(subcategory.id)}
                    className="rounded-lg px-3 py-2 h-auto flex flex-row items-center gap-3 w-full justify-start border-b border-gray-100 last:border-b-0 hover:bg-primary/5 transition-colors"
                  >
                    <div className={`flex items-center justify-center w-5 h-5 rounded-full ${
                      selectedSubcategory === subcategory.id
                        ? 'bg-primary/20'
                        : 'bg-gray-100'
                    }`}>
                      {getSubcategoryIcon(subcategory.id)}
                    </div>
                    <span className="text-xs font-medium text-left leading-tight flex-1 text-[#1a1a1a]">
                      {subcategory.name}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filters and Products */}
      <section className="py-6">
        <div className="container mx-auto px-4">
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
                  {t('category.filters.title')}
                </span>
                <ChevronRight className={`h-4 w-4 transition-transform ${showMobileFilters ? 'rotate-90' : ''}`} />
              </Button>
            </div>
            
            {/* Filters Sidebar */}
            <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block lg:w-64 flex-shrink-0`}>
              <div className="sticky top-20">
                <h3 className="font-medium text-lg mb-4">{t('category.filters.title')}</h3>
                
                <ProductFilters 
                  filters={productFilters}
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                />
                
                {/* Opțiune pentru afișarea produselor care nu sunt în stoc */}
                <div className="flex items-center space-x-2 mt-6 pt-4 border-t">
                  <input
                    type="checkbox"
                    id="show-out-of-stock"
                    checked={showOutOfStock} 
                    onChange={(e) => setShowOutOfStock(e.target.checked)}
                    className="rounded"
                  />
                  <label 
                    htmlFor="show-out-of-stock" 
                    className="text-sm cursor-pointer"
                  >
                    {t('category.show.out.of.stock')}
                  </label>
                </div>

                {Object.keys(activeFilters).length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleResetFilters} 
                    className="w-full mt-4"
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    {t('category.reset.filters')}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Products Section */}
            <div className="flex-1">
              {/* Sort Controls */}
              <div className="flex justify-between items-center mb-6">
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
                category={categoryId!} 
                subcategory={selectedSubcategory}
                filters={activeFilters}
                sortBy={sortBy} 
                showOutOfStock={showOutOfStock}
                currentPage={currentPage}
                productsPerPage={productsPerPage}
                onPageChange={setCurrentPage}
                onProductsPerPageChange={(value) => {
                  setProductsPerPage(value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <BackToTopButton />
    </div>
  );
};

export default CategoryProductsPage;
