import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Package, 
  Truck, 
  Shield, 
  Info,
  ChevronLeft,
  ChevronRight,
  Zap,
  Award,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Product, ProductVariant } from '@/types/Product';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ 
  product, 
  isOpen, 
  onClose 
}) => {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  // Initialize selected variant
  React.useEffect(() => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);

  // Get current details based on selected variant or product
  const currentPrice = selectedVariant?.price ?? product.price;
  const currentImage = selectedVariant?.imageUrl || product.image;
  const isInStock = selectedVariant ? selectedVariant.inStock : product.inStock;
  const stockQuantity = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;

  // Get all available images
  const allImages = [
    currentImage,
    ...(product.images || [])
  ].filter(Boolean);

  const handleAddToCart = () => {
    if (selectedVariant) {
      // Add multiple items based on quantity
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          variantId: selectedVariant.id,
          name: `${product.name} - ${getVariantLabel(selectedVariant)}`,
          price: selectedVariant.price || product.price,
          image: selectedVariant.imageUrl || product.image
        });
      }
    } else {
      // Add multiple items based on quantity
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image
        });
      }
    }
  };

  const getVariantLabel = (variant: ProductVariant): string => {
    const labels = [];
    if (variant.size) labels.push(`Mărime: ${variant.size}`);
    if (variant.color) labels.push(`Culoare: ${variant.color}`);
    if (variant.length) labels.push(`Lungime: ${variant.length}`);
    if (variant.volume) labels.push(`Volum: ${variant.volume}`);
    return labels.join(', ') || 'Standard';
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </DialogTitle>
                </div>
                
                {/* Badges */}
                <div className="flex flex-col gap-2">
                  {product.isNew && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Zap className="w-3 h-3 mr-1" />
                      Nou
                    </Badge>
                  )}
                  {product.discount && product.discount > 0 && (
                    <Badge variant="destructive">
                      -{product.discount}%
                    </Badge>
                  )}
                  {product.sales > 100 && (
                    <Badge variant="default" className="bg-purple-100 text-purple-800">
                      <Award className="w-3 h-3 mr-1" />
                      Bestseller
                    </Badge>
                  )}
                </div>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative group">
                  <img
                    src={allImages[selectedImageIndex] || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg bg-gray-100"
                  />
                  
                  {allImages.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={nextImage}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${
                          selectedImageIndex === index 
                            ? 'border-primary' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image || '/placeholder.svg'}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                {/* Price and Rating */}
                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(currentPrice)}
                    </span>
                    {product.originalPrice && product.originalPrice > currentPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews} recenzii)
                    </span>
                  </div>
                </div>

                {/* Variants */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Variante disponibile:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`p-3 text-left rounded-lg border transition-colors ${
                            selectedVariant?.id === variant.id
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{getVariantLabel(variant)}</span>
                            <div className="flex items-center gap-2">
                              {variant.price && (
                                <span className="text-sm font-semibold">
                                  {formatPrice(variant.price)}
                                </span>
                              )}
                              {variant.inStock ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock Status */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {isInStock ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-700 font-medium">În stoc</span>
                        {stockQuantity && stockQuantity > 0 && (
                          <span className="text-sm text-gray-600">
                            ({stockQuantity} bucăți disponibile)
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-700 font-medium">Stoc epuizat</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Quantity Selector */}
                {isInStock && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Cantitate:</label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={stockQuantity ? quantity >= stockQuantity : false}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    className="w-full py-6 text-lg font-medium" 
                    disabled={!isInStock}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isInStock ? `Adaugă în coș (${quantity})` : 'Stoc epuizat'}
                  </Button>
                  
                  <Button variant="outline" className="w-full py-3">
                    <Heart className="w-4 h-4 mr-2" />
                    Adaugă la favorite
                  </Button>
                </div>

                {/* Product Info Cards */}
                <div className="grid grid-cols-3 gap-2">
                  <Card className="p-3">
                    <CardContent className="p-0 text-center">
                      <Truck className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                      <p className="text-xs text-gray-600">Livrare gratuită</p>
                      <p className="text-xs font-medium">peste 500 LEI</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-3">
                    <CardContent className="p-0 text-center">
                      <Shield className="w-5 h-5 mx-auto text-green-600 mb-1" />
                      <p className="text-xs text-gray-600">Garanție</p>
                      <p className="text-xs font-medium">30 zile</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-3">
                    <CardContent className="p-0 text-center">
                      <Package className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                      <p className="text-xs text-gray-600">Ambalare</p>
                      <p className="text-xs font-medium">profesională</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <Separator className="my-8" />
            
            <div className="space-y-6">
              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Descriere
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Specificații
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">{key}:</span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attributes */}
              {product.attributes && Object.keys(product.attributes).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Caracteristici</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <Badge key={key} variant="outline" className="px-3 py-1">
                        {key}: {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Categorii</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  {product.subcategories?.map((subcat) => (
                    <Badge key={subcat} variant="outline">{subcat}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
