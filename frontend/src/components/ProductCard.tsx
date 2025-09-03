import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star, ChevronDown } from 'lucide-react';
import { Product, ProductVariant } from '@/types/Product';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProductDetailsModal from './ProductDetailsModal';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [variantPopoverOpen, setVariantPopoverOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determine if the product has variants
  const hasVariants = product.variants && product.variants.length > 0;
  
  // Get the current price (from variant if selected, or product's default price)
  const currentPrice = selectedVariant?.price ?? product.price;
  
  // Determine if the product or selected variant is in stock
  const isInStock = selectedVariant ? selectedVariant.inStock : product.inStock;
  
  // Get current stock quantity
  const stockQuantity = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItem({
        id: product.id,
        variantId: selectedVariant.id,
        name: `${product.name} - ${getVariantLabel(selectedVariant)}`,
        price: selectedVariant.price || product.price,
        image: selectedVariant.imageUrl || product.image
      });
    } else {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
  };
  
  // Function to generate a readable label for a variant
  const getVariantLabel = (variant: ProductVariant): string => {
    const parts: string[] = [];
    
    if (variant.size) parts.push(`${variant.size}`);
    if (variant.length) parts.push(`${variant.length}`);
    if (variant.color) parts.push(`${variant.color}`);
    if (variant.volume) parts.push(`${variant.volume}`);
    
    // When multiple attributes are present, format them differently
    if (parts.length > 1) {
      if (variant.size && variant.length) {
        return `Măr: ${variant.size}, Lung: ${variant.length}${variant.color ? `, ${variant.color}` : ''}`;
      }
    }
    
    // Default formatting for single attributes or other combinations
    return parts.join(', ') || 'Standard';
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 h-full flex flex-col border-0 shadow-md hover:scale-[1.02]">
      <CardHeader className="p-0">
        <div 
          className="relative overflow-hidden rounded-2xl cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          {/* Imagine de înaltă calitate */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Product Labels - Etichete vizuale */}
          <div className="absolute top-3 left-3 space-y-1">
            {product.isNew && (
              <Badge className="bg-emerald-500 text-white font-semibold px-3 py-1 text-xs rounded-full shadow-lg">NOU</Badge>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <Badge className="bg-red-500 text-white font-semibold px-3 py-1 text-xs rounded-full shadow-lg">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </Badge>
            )}
            {stockQuantity !== undefined && stockQuantity <= 5 && stockQuantity > 0 && (
              <Badge className="bg-amber-500 text-white font-semibold px-3 py-1 text-xs rounded-full shadow-lg">Stoc limitat</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 h-9 w-9 p-0 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full shadow-lg border-0"
          >
            <Heart className="h-4 w-4 text-gray-700" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 space-y-4">
        {/* Denumire completă și clară */}
        <CardTitle className="text-lg line-clamp-2 font-bold leading-tight text-gray-900 group-hover:text-primary transition-colors">
          {product.name}
        </CardTitle>
        
        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                product.rating && i < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-2 font-medium">
            {(product.rating || 0).toFixed(1)}{product.reviews && product.reviews > 0 ? ` (${product.reviews})` : ''}
          </span>
        </div>
        
        {/* Scurtă descriere */}
        {product.description && (
          <div className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </div>
        )}
        
        {/* Preț afișat vizibil */}
        <div className="flex items-baseline gap-3">
          <span className="font-bold text-2xl text-primary">
            {formatPrice(currentPrice)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <div className="space-y-4 w-full">
          {/* Variants selector - Opțiuni pentru variante */}
          {hasVariants && (
            <Popover open={variantPopoverOpen} onOpenChange={setVariantPopoverOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between text-xs h-10 border-dashed overflow-hidden group/variant-btn"
                >
                  <div className="flex items-center w-full justify-between overflow-hidden">
                    <div className="truncate mr-2 flex items-center">
                      {selectedVariant ? (
                        <>
                          {selectedVariant.size && (
                            <span className="bg-primary/10 rounded-md px-1.5 py-0.5 mr-1 font-medium">
                              {selectedVariant.size}
                            </span>
                          )}
                          {selectedVariant.length && (
                            <span className="bg-secondary/10 rounded-md px-1.5 py-0.5">
                              {selectedVariant.length}
                            </span>
                          )}
                          {!selectedVariant.size && !selectedVariant.length && getVariantLabel(selectedVariant)}
                        </>
                      ) : (
                        'Selectează varianta'
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 flex-shrink-0 group-hover/variant-btn:text-primary transition-colors" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="center" sideOffset={5}>
                <ScrollArea className="max-h-64">
                  <div className="p-2">
                    {product.variants?.map((variant) => (
                      <Button
                        key={variant.id}
                        variant={selectedVariant?.id === variant.id ? "default" : "ghost"}
                        className="w-full justify-between mb-1 text-xs h-auto py-2"
                        disabled={!variant.inStock}
                        onClick={() => {
                          setSelectedVariant(variant);
                          setVariantPopoverOpen(false);
                        }}
                      >
                        <div className="flex flex-col items-start text-left">
                          <div className="font-medium">
                            {variant.size && <span className="mr-2">Mărime: {variant.size}</span>}
                            {variant.length && <span>Lungime: {variant.length}</span>}
                          </div>
                          {(variant.color || variant.volume) && (
                            <div className="text-xs opacity-80">
                              {variant.color && <span className="mr-2">Culoare: {variant.color}</span>}
                              {variant.volume && <span>Volum: {variant.volume}</span>}
                            </div>
                          )}
                        </div>
                        <span className={`text-xs font-medium ${!variant.inStock ? 'text-red-500' : ''}`}>
                          {variant.inStock 
                            ? variant.price ? formatPrice(variant.price) : formatPrice(product.price) 
                            : 'Indisponibil'}
                        </span>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          )}
          
          {/* Stock info - Informații stoc */}
          {stockQuantity !== undefined && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Disponibilitate:</span>
              <span className={`font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
                {isInStock 
                  ? `În stoc (${stockQuantity})` 
                  : 'Stoc epuizat'}
              </span>
            </div>
          )}
          
          {/* Butoane de acțiune */}
          <div className="grid grid-cols-1 gap-3">
            {/* Buton „Adaugă în coș" */}
            <Button 
              className="w-full font-semibold py-4 rounded-xl text-base shadow-lg hover:shadow-xl transition-all duration-300" 
              disabled={!isInStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isInStock ? 'Adaugă în coș' : 'Stoc epuizat'}
            </Button>
            
            {/* Buton „Vezi detalii" - mereu afișat */}
            <Button 
              className="w-full font-medium py-3 rounded-xl border-2 hover:bg-primary/5 transition-all duration-300" 
              variant="outline"
              onClick={() => setIsModalOpen(true)}
            >
              Vezi detalii
            </Button>
          </div>
        </div>
      </CardFooter>
      
      {/* Product Details Modal - mereu afișat */}
      <ProductDetailsModal 
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Card>
  );
};

export default ProductCard;