import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Product } from '@/types/Product';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all">
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
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.inStock ? 'Adaugă în coș' : 'Stoc epuizat'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;