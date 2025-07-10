import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Search, Filter, Heart, Star } from 'lucide-react';
import { Product, useCart } from './ShoppingCart';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock product data - în realitate ar veni de la Cloud Shop API
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Gene false Classic Volume',
    price: 149,
    currency: 'MDL',
    image: '/api/placeholder/300/300',
    category: 'gene-false',
    inStock: true,
    description: 'Gene false premium pentru volum clasic',
    brand: 'LashPro'
  },
  {
    id: '2',
    name: 'Cleaner pentru gene',
    price: 89,
    currency: 'MDL',
    image: '/api/placeholder/300/300',
    category: 'cleanser',
    inStock: true,
    description: 'Cleaner profesional pentru curățarea genelor',
    brand: 'BeautyLash'
  },
  {
    id: '3',
    name: 'Adeziv Strong Hold',
    price: 199,
    currency: 'MDL',
    image: '/api/placeholder/300/300',
    category: 'adezivi',
    inStock: true,
    description: 'Adeziv puternic pentru extensii de gene',
    brand: 'ProGlue'
  },
  {
    id: '4',
    name: 'Pensete curbe profesionale',
    price: 120,
    currency: 'MDL',
    image: '/api/placeholder/300/300',
    category: 'instrumente',
    inStock: true,
    description: 'Pensete curbe de înaltă calitate',
    brand: 'ToolsPro'
  },
  {
    id: '5',
    name: 'Gene false Mega Volume',
    price: 179,
    currency: 'MDL',
    image: '/api/placeholder/300/300',
    category: 'gene-false',
    inStock: false,
    description: 'Gene false pentru efecte dramatice',
    brand: 'LashPro'
  },
  {
    id: '6',
    name: 'Primer pentru gene',
    price: 95,
    currency: 'MDL',
    image: '/api/placeholder/300/300',
    category: 'preparare',
    inStock: true,
    description: 'Primer pentru prepararea genelor naturale',
    brand: 'BeautyLash'
  }
];

const CATEGORIES = [
  { value: 'toate', label: 'Toate categoriile' },
  { value: 'gene-false', label: 'Gene false' },
  { value: 'adezivi', label: 'Adezivi' },
  { value: 'instrumente', label: 'Instrumente' },
  { value: 'cleanser', label: 'Cleansere' },
  { value: 'preparare', label: 'Preparare' }
];

const BRANDS = [
  { value: 'toate', label: 'Toate mărcile' },
  { value: 'LashPro', label: 'LashPro' },
  { value: 'BeautyLash', label: 'BeautyLash' },
  { value: 'ProGlue', label: 'ProGlue' },
  { value: 'ToolsPro', label: 'ToolsPro' }
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Sortare implicită' },
  { value: 'price-asc', label: 'Preț crescător' },
  { value: 'price-desc', label: 'Preț descrescător' },
  { value: 'name', label: 'Nume A-Z' },
  { value: 'newest', label: 'Noutăți' }
];

const ProductGrid: React.FC = () => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('toate');
  const [selectedBrand, setSelectedBrand] = useState('toate');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  // Filter only in-stock products
  const availableProducts = MOCK_PRODUCTS.filter(product => product.inStock);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...availableProducts];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'toate') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply brand filter
    if (selectedBrand !== 'toate') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        // În realitate ar fi sortare după dată de adăugare
        break;
      default:
        break;
    }

    return filtered;
  }, [availableProducts, searchTerm, selectedCategory, selectedBrand, sortBy]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Caută produse, mărci..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtrare și sortare
          </Button>
          <div className="text-sm text-muted-foreground">
            {filteredAndSortedProducts.length} produse găsite
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
            <div className="space-y-2">
              <Label>Categorie</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Marcă</Label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRANDS.map(brand => (
                    <SelectItem key={brand.value} value={brand.value}>
                      {brand.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sortare</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('toate');
                  setSelectedBrand('toate');
                  setSortBy('default');
                }}
                className="w-full"
              >
                Resetează filtrele
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="product-grid">
        {filteredAndSortedProducts.map((product) => (
          <Card key={product.id} className="card-beauty group">
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {product.brand}
                </Badge>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              
              <CardTitle className="text-sm line-clamp-2">{product.name}</CardTitle>
              
              <p className="text-xs text-muted-foreground line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-lg font-bold text-primary">
                    {product.price} {product.currency === 'MDL' ? 'lei' : product.currency}
                  </p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="p-4 pt-0">
              <Button
                onClick={() => handleAddToCart(product)}
                className="w-full gap-2"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4" />
                Adaugă în coș
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* No Products Found */}
      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nu am găsit produse</h3>
            <p>Încearcă să schimbi filtrele sau termenul de căutare.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;