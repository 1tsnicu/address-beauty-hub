import React, { useState, useEffect } from 'react';
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
import { GeneVariant, GeneGroup } from '@/types/GeneVariant';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { GeneVariantService } from '@/services/geneVariantService';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  geneGroup?: GeneGroup; // Use the same type from GeneVariant.ts
  isGeneProduct?: boolean;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ 
  product, 
  isOpen, 
  onClose,
  geneGroup,
  isGeneProduct = false
}) => {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  // Auto-detect if this is a gene product based on product attributes
  const isActuallyGeneProduct = isGeneProduct || product?.attributes?.isGeneGroup || false;
  const actualGeneGroup = geneGroup || product?.geneGroup;
  
  // Gene variant states
  const [geneVariants, setGeneVariants] = useState<GeneVariant[]>([]);
  const [selectedGeneVariant, setSelectedGeneVariant] = useState<GeneVariant | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    curbura?: string;
    grosime?: string;
    lungime?: string;
    culoare?: string;
  }>({});

  // Initialize selected variant for regular products
  useEffect(() => {
    if (!isActuallyGeneProduct && product?.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant, isActuallyGeneProduct]);

  // Load gene variants if it's a gene product
  useEffect(() => {
    const loadGeneVariants = async () => {
      if (!actualGeneGroup?.slug) return;
      
      setLoading(true);
      try {
        const variants = await GeneVariantService.getProductVariants(actualGeneGroup.slug);
        setGeneVariants(variants);
        
        // Reset selections when loading new variants
        setSelectedGeneVariant(null);
        
        // Auto-select first curvature and default color
        if (variants.length > 0) {
          const uniqueCurvatures = variants
            .map(v => v.curbura)
            .filter(c => c != null && c !== '')
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort((a, b) => {
              const order = ['B', 'C', 'CC', 'D', 'DD', 'L', 'LC', 'LD', 'M'];
              return order.indexOf(a) - order.indexOf(b);
            });
          
          const uniqueColors = variants
            .map(v => v.culoare)
            .filter(c => c != null && c !== '')
            .filter((value, index, self) => self.indexOf(value) === index);
          
          const initialFilters = {
            curbura: uniqueCurvatures[0] || undefined,
            culoare: uniqueColors[0] || undefined, // Auto-select first color as default
          };
          
          setSelectedFilters(initialFilters);
          
          // Find matching variant with initial filters
          const matchingVariant = variants.find(variant => {
            return Object.entries(initialFilters).every(([key, val]) => {
              if (!val) return true;
              return variant[key as keyof GeneVariant] === val;
            });
          });
          
          if (matchingVariant) {
            setSelectedGeneVariant(matchingVariant);
          }
        }
      } catch (error) {
        console.error('Error loading gene variants:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isActuallyGeneProduct && actualGeneGroup?.slug) {
      loadGeneVariants();
    }
  }, [isActuallyGeneProduct, actualGeneGroup?.slug]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFilters({});
      setSelectedGeneVariant(null);
      setQuantity(1);
      setSelectedImageIndex(0);
    }
  }, [isOpen]);

  const updateFiltersFromVariant = (variant: GeneVariant) => {
    setSelectedFilters({
      curbura: variant.curbura || undefined,
      grosime: variant.grosime || undefined,
      lungime: variant.lungime || undefined,
      culoare: variant.culoare || undefined,
    });
  };

  const handleGeneVariantSelect = (variant: GeneVariant) => {
    setSelectedGeneVariant(variant);
    updateFiltersFromVariant(variant);
  };

  if (!product && !actualGeneGroup) return null;

  // Helper functions for chip interactions
  const getUniqueValues = (attribute: keyof GeneVariant) => {
    const values = geneVariants
      .map(variant => variant[attribute])
      .filter(value => value != null && value !== '')
      .filter((value, index, self) => self.indexOf(value) === index);
    
    // Sort values in ascending order based on attribute type
    return (values as string[]).sort((a, b) => {
      if (attribute === 'curbura') {
        // Custom order for curvature: B, C, CC, D, DD, L, LC, LD, M
        const order = ['B', 'C', 'CC', 'D', 'DD', 'L', 'LC', 'LD', 'M'];
        return order.indexOf(a) - order.indexOf(b);
      } else if (attribute === 'grosime' || attribute === 'lungime') {
        // Numeric sort for thickness and length
        return parseFloat(a) - parseFloat(b);
      } else {
        // Alphabetical sort for other attributes
        return a.localeCompare(b);
      }
    });
  };

  const isVariantAvailable = (attribute: keyof GeneVariant, value: string) => {
    // Pentru curbură, toate opțiunile sunt mereu disponibile
    if (attribute === 'curbura') {
      return geneVariants.some(variant => variant[attribute] === value);
    }
    
    // Pentru alte atribute, verificăm compatibilitatea cu toate caracteristicile selectate
    const selectedCurvature = selectedFilters.curbura;
    if (!selectedCurvature) {
      // Dacă nu e selectată curbura, nu permitem selectarea altceva
      return false;
    }
    
    // Creăm un set temporar de filtre care include noul atribut
    const testFilters = {
      ...selectedFilters,
      [attribute]: value
    };
    
    // Verificăm dacă există o variantă care corespunde exact cu toate caracteristicile
    return geneVariants.some(variant => {
      return Object.entries(testFilters).every(([key, val]) => {
        if (!val) return true; // Skip undefined filters
        return variant[key as keyof GeneVariant] === val;
      });
    });
  };

  const handleFilterChange = (attribute: string, value: string) => {
    // Pentru curbură, nu permitem deselectarea - e mereu obligatorie
    const currentValue = selectedFilters[attribute as keyof typeof selectedFilters];
    
    let newFilters;
    if (attribute === 'curbura') {
      // Când selectăm o curbură nouă, resetăm toate celelalte caracteristici
      // pentru ca utilizatorul să poată alege orice combinație pentru acea curbură
      newFilters = {
        curbura: value,
        culoare: selectedFilters.culoare, // Păstrăm culoarea că e setată automat
        // grosime și lungime se resetează
      };
    } else {
      // Pentru alte atribute, toggle selection: dacă e deja selectat, îl deselectăm
      newFilters = {
        ...selectedFilters,
        [attribute]: currentValue === value ? undefined : value
      };
    }
    
    setSelectedFilters(newFilters);
    
    // Find matching variant based on new filters
    const matchingVariants = geneVariants.filter(variant => {
      return Object.entries(newFilters).every(([key, val]) => {
        if (!val) return true; // Skip undefined filters
        return variant[key as keyof GeneVariant] === val;
      });
    });
    
    // Prefer variants with stock, but show any matching variant
    const variantWithStock = matchingVariants.find(v => (v.store_stock || 0) > 0);
    const selectedVariant = variantWithStock || matchingVariants[0];
    
    if (selectedVariant) {
      setSelectedGeneVariant(selectedVariant);
    } else {
      // If no exact match, clear selection but keep filters for future matching
      setSelectedGeneVariant(null);
    }
  };

  // Get current details based on selected variant or product
  const getCurrentData = () => {
    if (isActuallyGeneProduct && actualGeneGroup) {
      return {
        name: actualGeneGroup.name,
        price: selectedGeneVariant?.sale_price || actualGeneGroup.from_price || 0,
        originalPrice: undefined,
        image: selectedGeneVariant?.image_url || actualGeneGroup.image_url,
        isInStock: selectedGeneVariant ? (selectedGeneVariant.store_stock || 0) > 0 : actualGeneGroup.total_stock > 0,
        stockQuantity: selectedGeneVariant?.store_stock || actualGeneGroup.total_stock,
        description: selectedGeneVariant?.descriere || actualGeneGroup.descriere || 'Variante disponibile cu diferite specificații'
      };
    } else if (product) {
      const currentPrice = selectedVariant?.price ?? product.price;
      const currentImage = selectedVariant?.imageUrl || product.image;
      const isInStock = selectedVariant ? selectedVariant.inStock : product.inStock;
      const stockQuantity = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;
      
      return {
        name: product.name,
        price: currentPrice,
        originalPrice: product.originalPrice,
        image: currentImage,
        isInStock,
        stockQuantity,
        description: product.description
      };
    }
    
    return {
      name: actualGeneGroup?.name || '',
      price: 0,
      originalPrice: undefined,
      image: actualGeneGroup?.image_url || '',
      isInStock: false,
      stockQuantity: 0,
      description: ''
    };
  };

  const currentData = getCurrentData();

  // Get all available images
  const allImages = [
    currentData.image,
    ...(product?.images || [])
  ].filter(Boolean);

  const handleAddToCart = () => {
    if (isActuallyGeneProduct && selectedGeneVariant && actualGeneGroup) {
      // Add gene variant to cart
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: selectedGeneVariant.id,
          name: actualGeneGroup.name,
          price: selectedGeneVariant.sale_price || 0,
          image: selectedGeneVariant.image_url || actualGeneGroup.image_url || ''
        });
      }
    } else if (product) {
      if (selectedVariant) {
        // Add regular product variant to cart
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
        // Add regular product to cart
        for (let i = 0; i < quantity; i++) {
          addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
          });
        }
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
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 bg-white rounded-3xl border-0 shadow-2xl">
        <ScrollArea className="max-h-[95vh]">
          <div className="relative">
            {/* Header modern cu gradient */}
            <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white p-8">
              <DialogHeader className="space-y-4">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <DialogTitle className="text-3xl font-bold text-white leading-tight mb-3">
                      {currentData.name}
                    </DialogTitle>
                    <div className="flex items-baseline gap-4">
                      <span className="text-4xl font-bold text-white">
                        {formatPrice(currentData.price)}
                      </span>
                      {currentData.originalPrice && currentData.originalPrice > currentData.price && (
                        <span className="text-xl text-white/70 line-through">
                          {formatPrice(currentData.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Badges moderne */}
                  <div className="flex flex-col gap-3">
                    {product?.isNew && (
                      <Badge className="bg-emerald-500 text-white font-semibold px-4 py-2 rounded-full shadow-lg">
                        <Zap className="w-4 h-4 mr-2" />
                        Nou
                      </Badge>
                    )}
                    {product?.discount && product.discount > 0 && (
                      <Badge className="bg-red-500 text-white font-semibold px-4 py-2 rounded-full shadow-lg">
                        -{product.discount}%
                      </Badge>
                    )}
                    {product?.sales && product.sales > 100 && (
                      <Badge className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-full shadow-lg">
                        <Award className="w-4 h-4 mr-2" />
                        Bestseller
                      </Badge>
                    )}
                  </div>
                </div>
              </DialogHeader>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Image Gallery */}
                <div className="space-y-6">
                  <div className="relative group">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl border-0">
                      <img
                        src={allImages[selectedImageIndex] || '/placeholder.svg'}
                        alt={currentData.name}
                        className="w-full h-[500px] object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Overlay cu gradient pentru butoane */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {allImages.length > 1 && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/95 hover:bg-white shadow-xl border-0 rounded-full h-12 w-12"
                            onClick={prevImage}
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/95 hover:bg-white shadow-xl border-0 rounded-full h-12 w-12"
                            onClick={nextImage}
                          >
                            <ChevronRight className="w-6 h-6" />
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Gallery */}
                    {allImages.length > 1 && (
                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {allImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-24 h-24 rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                              selectedImageIndex === index 
                                ? 'border-primary shadow-xl scale-110' 
                                : 'border-gray-200 hover:border-primary/50 hover:shadow-lg hover:scale-105'
                            }`}
                          >
                            <img
                              src={image || '/placeholder.svg'}
                              alt={`${currentData.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="space-y-6">
                    {/* Rating - only show for regular products with actual ratings */}
                    {product && product.rating > 0 && product.reviews > 0 && (
                      <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
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
                          {product.rating.toFixed(1)} ({product.reviews} recenzii)
                        </span>
                      </div>
                    )}

                {/* Gene Variants with Interactive Chips */}
                {isActuallyGeneProduct && geneVariants.length > 0 && (
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-2">Se încarcă variantele...</p>
                      </div>
                    ) : (
                      <>
                        {/* Curbură Selection (Required) */}
                        {getUniqueValues('curbura').length > 0 && (
                          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border-0 shadow-md">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              Curbură <span className="text-red-500 text-xs font-medium">*obligatoriu</span>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {getUniqueValues('curbura').map((value) => (
                                <button
                                  key={value}
                                  onClick={() => handleFilterChange('curbura', value)}
                                  disabled={!isVariantAvailable('curbura', value)}
                                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                    selectedFilters.curbura === value
                                      ? 'bg-primary text-white shadow-lg transform scale-105 border-2 border-primary/20'
                                      : isVariantAvailable('curbura', value)
                                      ? 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md hover:scale-105'
                                      : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-50'
                                  }`}
                                >
                                  {value}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Grosime Selection */}
                        {getUniqueValues('grosime').length > 0 && (
                          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border-0 shadow-md">
                            <h4 className="font-semibold text-gray-900 mb-3">Grosime:</h4>
                            <div className="flex flex-wrap gap-2">
                              {getUniqueValues('grosime').map((value) => (
                                <button
                                  key={value}
                                  onClick={() => handleFilterChange('grosime', value)}
                                  disabled={!isVariantAvailable('grosime', value)}
                                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                    selectedFilters.grosime === value
                                      ? 'bg-primary text-white shadow-lg transform scale-105 border-2 border-primary/20'
                                      : isVariantAvailable('grosime', value)
                                      ? 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md hover:scale-105'
                                      : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-50'
                                  }`}
                                >
                                  {value} mm
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Lungime Selection */}
                        {getUniqueValues('lungime').length > 0 && (
                          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border-0 shadow-md">
                            <h4 className="font-semibold text-gray-900 mb-3">Lungime:</h4>
                            <div className="flex flex-wrap gap-2">
                              {getUniqueValues('lungime').map((value) => (
                                <button
                                  key={value}
                                  onClick={() => handleFilterChange('lungime', value)}
                                  disabled={!isVariantAvailable('lungime', value)}
                                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                    selectedFilters.lungime === value
                                      ? 'bg-primary text-white shadow-lg transform scale-105 border-2 border-primary/20'
                                      : isVariantAvailable('lungime', value)
                                      ? 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md hover:scale-105'
                                      : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-50'
                                  }`}
                                >
                                  {value} mm
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Culoare Display (Non-selectable) */}
                        {selectedFilters.culoare && (
                          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border-0 shadow-md">
                            <h4 className="font-semibold text-gray-900 mb-3">Culoare:</h4>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-4 py-2 rounded-xl border-2 bg-white text-gray-700 border-gray-200 text-sm font-semibold shadow-md">
                                {selectedFilters.culoare}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Culoarea este setată automat pentru acest produs</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Regular Product Variants */}
                {!isActuallyGeneProduct && product?.variants && product.variants.length > 0 && (
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
                                <CheckCircle className="w-4 h-4 text-blue-400" />
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

              </div>
            </div>

            {/* Description Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mx-6 mb-6">
              <div className="space-y-4">
                {/* Description */}
                {currentData.description && (
                  <div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-3 text-gray-800">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Info className="w-5 h-5 text-purple-600" />
                      </div>
                      Descriere produs
                    </h3>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <p className="text-gray-700 leading-relaxed text-base">{currentData.description}</p>
                    </div>
                  </div>
                )}

                {/* Selected Variant Info (moved here) */}
                {selectedGeneVariant && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <p className="font-medium text-blue-700">✓ Varianta selectată</p>
                        <div className="flex flex-wrap gap-2 text-sm">
                          {selectedGeneVariant.curbura && (
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              Curbură: {selectedGeneVariant.curbura}
                            </span>
                          )}
                          {selectedGeneVariant.grosime && (
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              Grosime: {selectedGeneVariant.grosime}
                            </span>
                          )}
                          {selectedGeneVariant.lungime && (
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              Lungime: {selectedGeneVariant.lungime}
                            </span>
                          )}
                          {selectedGeneVariant.culoare && (
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              Culoare: {selectedGeneVariant.culoare}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-900">
                          {formatPrice(selectedGeneVariant.sale_price || 0)}
                        </p>
                        <p className="text-sm text-green-700">
                          În stoc: {selectedGeneVariant.store_stock || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stock Status */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {currentData.isInStock ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-green-700 font-medium">În stoc</span>
                        {currentData.stockQuantity && currentData.stockQuantity > 0 && (
                          <span className="text-sm text-gray-600">
                            ({currentData.stockQuantity} bucăți disponibile)
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
                {currentData.isInStock && (
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
                        disabled={currentData.stockQuantity ? quantity >= currentData.stockQuantity : false}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button 
                    className="w-full py-5 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300" 
                    disabled={!currentData.isInStock || (isActuallyGeneProduct && !selectedFilters.curbura)}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-6 h-6 mr-3" />
                    {!currentData.isInStock 
                      ? 'Stoc epuizat' 
                      : (isActuallyGeneProduct && !selectedFilters.curbura)
                      ? 'Selectează curbura'
                      : `Adaugă în coș (${quantity})`
                    }
                  </Button>
                  
                  <Button variant="outline" className="w-full py-4 text-base font-semibold rounded-2xl border-2 hover:bg-primary/5 transition-all duration-300">
                    <Heart className="w-5 h-5 mr-2" />
                    Adaugă la favorite
                  </Button>
                </div>

                {/* Product Info Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0 text-center">
                      <Truck className="w-6 h-6 mx-auto text-primary mb-2" />
                      <p className="text-sm text-gray-600 font-medium">Livrare gratuită</p>
                      <p className="text-sm font-bold text-primary">peste 500 LEI</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-4 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0 text-center">
                      <Shield className="w-6 h-6 mx-auto text-emerald-600 mb-2" />
                      <p className="text-sm text-gray-600 font-medium">Garanție</p>
                      <p className="text-sm font-bold text-emerald-600">30 zile</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-4 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0 text-center">
                      <Package className="w-6 h-6 mx-auto text-purple-600 mb-2" />
                      <p className="text-sm text-gray-600 font-medium">Ambalare</p>
                      <p className="text-sm font-bold text-purple-600">profesională</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
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
