import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Filter, Grid, List, Star, Heart, Eye } from 'lucide-react';
import AuthModal from './AuthModal';

interface Product {
  id: string;
  name: string;
  nameRu: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory: string;
  brand: string;
  curve?: string;
  length?: string;
  thickness?: string;
  type: string;
  inStock: boolean;
  isNew?: boolean;
  onSale?: boolean;
  limited?: boolean;
  rating: number;
  reviews: number;
}

interface Category {
  id: string;
  name: string;
  nameRu: string;
  subcategories: {
    id: string;
    name: string;
    nameRu: string;
  }[];
}

const categories: Category[] = [
  {
    id: 'lashes',
    name: 'Gene',
    nameRu: 'Ресницы',
    subcategories: [
      { id: 'black', name: 'Gene negre', nameRu: 'Черные ресницы' },
      { id: 'brown', name: 'Gene cafenii', nameRu: 'Коричневые ресницы' },
      { id: 'colored', name: 'Gene colorate', nameRu: 'Цветные ресницы' },
    ]
  },
  {
    id: 'brows',
    name: 'Sprâncene',
    nameRu: 'Брови',
    subcategories: [
      { id: 'henna', name: 'Henna', nameRu: 'Хна' },
      { id: 'tools', name: 'Instrumente', nameRu: 'Инструменты' },
    ]
  },
  {
    id: 'lamination',
    name: 'Laminarea',
    nameRu: 'Ламинирование',
    subcategories: [
      { id: 'kits', name: 'Kit-uri', nameRu: 'Наборы' },
      { id: 'solutions', name: 'Soluții', nameRu: 'Растворы' },
    ]
  },
  {
    id: 'cosmetics',
    name: 'Cosmetice & îngrijire personală',
    nameRu: 'Косметика и личный уход',
    subcategories: [
      { id: 'skincare', name: 'Îngrijire piele', nameRu: 'Уход за кожей' },
      { id: 'makeup', name: 'Machiaj', nameRu: 'Макияж' },
    ]
  },
];

// Mock products data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Gene Clasice Negre C 0.15',
    nameRu: 'Классические черные ресницы C 0.15',
    price: 45,
    originalPrice: 60,
    image: '/placeholder.svg',
    category: 'lashes',
    subcategory: 'black',
    brand: 'Premium Lash',
    curve: 'C',
    length: '10mm',
    thickness: '0.15',
    type: 'Benzi',
    inStock: true,
    isNew: true,
    onSale: true,
    rating: 4.8,
    reviews: 124,
  },
  // Add more mock products as needed...
];

const OnlineStore = () => {
  const { t, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [currency, setCurrency] = useState('LEI');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('new');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [filters, setFilters] = useState({
    curves: [] as string[],
    lengths: [] as string[],
    thickness: [] as string[],
    brands: [] as string[],
    types: [] as string[],
    inStock: true,
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
  };

  const formatPrice = (price: number) => {
    const rates = { LEI: 1, RON: 0.25, EURO: 0.05 };
    const convertedPrice = price * rates[currency as keyof typeof rates];
    return `${convertedPrice.toFixed(2)} ${currency}`;
  };

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    // Add to cart logic here
    console.log('Added to cart:', product);
  };

  if (!selectedCategory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-2">
              {t('shop.title')}
            </h1>
            {user && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Bun venit, {user.name}!</span>
                {user.discountPercentage > 0 && (
                  <Badge variant="secondary">
                    Reducere: {user.discountPercentage}%
                  </Badge>
                )}
                {user.registrationBonus && new Date() < user.registrationBonus.expiresAt && (
                  <Badge className="bg-green-100 text-green-800">
                    Bonus 15% - {Math.floor((user.registrationBonus.expiresAt.getTime() - Date.now()) / (1000 * 60))} min rămase
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t('shop.currency')}:</span>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LEI">LEI</SelectItem>
                  <SelectItem value="RON">RON</SelectItem>
                  <SelectItem value="EURO">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={() => handleCategorySelect(category.id)}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-heading text-xl text-primary">
                  {language === 'RO' ? category.name : category.nameRu}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.subcategories.map((sub) => (
                    <div key={sub.id} className="text-sm text-muted-foreground">
                      • {language === 'RO' ? sub.name : sub.nameRu}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <AuthModal 
          open={showAuthModal} 
          onOpenChange={setShowAuthModal}
        />
      </div>
    );
  }

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);
  const filteredProducts = mockProducts.filter(product => 
    product.category === selectedCategory &&
    (!selectedSubcategory || product.subcategory === selectedSubcategory) &&
    (!filters.inStock || product.inStock)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <button 
          onClick={() => setSelectedCategory(null)}
          className="text-primary hover:underline"
        >
          {t('shop.title')}
        </button>
        <span>/</span>
        <span className="text-muted-foreground">
          {language === 'RO' ? selectedCategoryData?.name : selectedCategoryData?.nameRu}
        </span>
        {selectedSubcategory && (
          <>
            <span>/</span>
            <span className="text-muted-foreground">
              {language === 'RO' 
                ? selectedCategoryData?.subcategories.find(s => s.id === selectedSubcategory)?.name
                : selectedCategoryData?.subcategories.find(s => s.id === selectedSubcategory)?.nameRu
              }
            </span>
          </>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-64 space-y-6">
          {/* Subcategories */}
          {!selectedSubcategory && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subcategorii</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {selectedCategoryData?.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleSubcategorySelect(sub.id)}
                    className="block w-full text-left px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {language === 'RO' ? sub.name : sub.nameRu}
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Product Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtre
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add filter controls here */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="inStock" 
                  checked={filters.inStock}
                  onCheckedChange={(checked) => 
                    setFilters(prev => ({ ...prev, inStock: checked as boolean }))
                  }
                />
                <label htmlFor="inStock" className="text-sm">
                  Doar produse în stoc
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} produse găsite
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">{t('shop.sort.new')}</SelectItem>
                  <SelectItem value="price_asc">{t('shop.sort.price_asc')}</SelectItem>
                  <SelectItem value="price_desc">{t('shop.sort.price_desc')}</SelectItem>
                  <SelectItem value="bestsellers">{t('shop.sort.bestsellers')}</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex rounded-lg border">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={language === 'RO' ? product.name : product.nameRu}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  
                  {/* Product Labels */}
                  <div className="absolute top-2 left-2 space-y-1">
                    {product.isNew && (
                      <Badge className="bg-green-500 text-white">
                        {t('shop.labels.new')}
                      </Badge>
                    )}
                    {product.onSale && (
                      <Badge className="bg-red-500 text-white">
                        {t('shop.labels.sale')}
                      </Badge>
                    )}
                    {product.limited && (
                      <Badge className="bg-orange-500 text-white">
                        {t('shop.labels.limited')}
                      </Badge>
                    )}
                  </div>

                  {/* Product Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-y-1">
                    <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {language === 'RO' ? product.name : product.nameRu}
                  </h3>
                  
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">
                      ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-bold text-lg text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {t('shop.product.add_to_cart')}
                    </Button>
                    <Button variant="outline" size="sm">
                      {t('shop.product.view_details')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
      />
    </div>
  );
};

export default OnlineStore;