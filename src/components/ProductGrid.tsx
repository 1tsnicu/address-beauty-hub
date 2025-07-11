import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star, Search } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from 'sonner';

interface ProductGridProps {
  searchTerm?: string;
  category?: string;
  sortBy?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  searchTerm = '', 
  category = 'all', 
  sortBy = 'newest' 
}) => {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  const products = [
    {
      id: 1,
      name: 'Gene false 3D Volume',
      price: 45.99,
      originalPrice: 59.99,
      image: '/placeholder.svg',
      rating: 4.8,
      reviews: 124,
      inStock: true,
      isNew: true,
      category: 'lashes',
      sales: 300
    },
    {
      id: 2,
      name: 'Kit Sprâncene Professional',
      price: 89.99,
      originalPrice: null,
      image: '/placeholder.svg',
      rating: 4.9,
      reviews: 98,
      inStock: true,
      isNew: false,
      category: 'brows',
      sales: 250
    },
    {
      id: 3,
      name: 'Gel de Laminare Premium',
      price: 159.99,
      originalPrice: 189.99,
      image: '/placeholder.svg',
      rating: 4.7,
      reviews: 76,
      inStock: true,
      isNew: false,
      category: 'lamination',
      sales: 120
    },
    {
      id: 4,
      name: 'Serum pentru creșterea genelor',
      price: 129.99,
      originalPrice: null,
      image: '/placeholder.svg',
      rating: 4.6,
      reviews: 45,
      inStock: true,
      isNew: true,
      category: 'cosmetics',
      sales: 80
    },
    {
      id: 5,
      name: 'Gene false volum natural',
      price: 29.99,
      originalPrice: 39.99,
      image: '/placeholder.svg',
      rating: 4.5,
      reviews: 203,
      inStock: true,
      isNew: false,
      category: 'lashes',
      sales: 400
    },
    {
      id: 6,
      name: 'Kit Laminare Sprâncene Complet',
      price: 299.99,
      originalPrice: 399.99,
      image: '/placeholder.svg',
      rating: 4.9,
      reviews: 89,
      inStock: true,
      isNew: false,
      category: 'lamination',
      sales: 150
    },
    {
      id: 7,
      name: 'Cremă hidratantă pentru față',
      price: 75.99,
      originalPrice: null,
      image: '/placeholder.svg',
      rating: 4.8,
      reviews: 156,
      inStock: true,
      isNew: true,
      category: 'cosmetics',
      sales: 220
    },
    {
      id: 8,
      name: 'Ceară pentru sprâncene',
      price: 35.99,
      originalPrice: 45.99,
      image: '/placeholder.svg',
      rating: 4.6,
      reviews: 87,
      inStock: true,
      isNew: false,
      category: 'brows',
      sales: 180
    }
  ];

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Filter by search term
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by category
      const matchesCategory = category === 'all' || product.category === category;
      
      // Hide out of stock products
      const isInStock = product.inStock;
      
      return matchesSearch && matchesCategory && isInStock;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => b.sales - a.sales);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return filtered;
  }, [searchTerm, category, sortBy]);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  if (filteredAndSortedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground text-lg">Nu au fost găsite produse</p>
        <p className="text-sm text-muted-foreground mt-2">Încearcă să modifici criteriile de căutare</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredAndSortedProducts.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-all">
          <CardHeader className="p-0">
            <div className="relative overflow-hidden rounded-t-xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Product Labels */}
              <div className="absolute top-2 left-2 space-y-1">
                {product.isNew && (
                  <Badge className="bg-green-500 text-white">Nou</Badge>
                )}
                {product.originalPrice && (
                  <Badge className="bg-red-500 text-white">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </Badge>
                )}
              </div>

              {/* Wishlist Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 space-y-3">
            <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
            
            {/* Rating */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">
                ({product.reviews})
              </span>
            </div>
            
             {/* Price */}
             <div className="flex items-center gap-2">
               <span className="font-bold text-lg text-primary">
                 {formatPrice(product.price)}
               </span>
               {product.originalPrice && (
                 <span className="text-sm text-muted-foreground line-through">
                   {formatPrice(product.originalPrice)}
                 </span>
               )}
             </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0">
            <Button 
              className="w-full" 
              disabled={!product.inStock}
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.inStock ? 'Adaugă în coș' : 'Stoc epuizat'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;