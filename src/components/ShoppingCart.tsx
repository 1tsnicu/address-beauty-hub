import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingBag, Plus, Minus, X, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: 'MDL' | 'RON' | 'EUR';
  image: string;
  category: string;
  inStock: boolean;
  description?: string;
  brand?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  currency: 'MDL' | 'RON' | 'EUR';
  setCurrency: (currency: 'MDL' | 'RON' | 'EUR') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Currency conversion rates (mock - în realitate ar veni de la o API)
const EXCHANGE_RATES = {
  MDL: { RON: 0.27, EUR: 0.055 },
  RON: { MDL: 3.7, EUR: 0.2 },
  EUR: { MDL: 18.2, RON: 5.0 }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState<'MDL' | 'RON' | 'EUR'>('MDL');
  const { toast } = useToast();

  const convertPrice = (price: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return price;
    if (fromCurrency === 'MDL' && toCurrency === 'RON') return price * EXCHANGE_RATES.MDL.RON;
    if (fromCurrency === 'MDL' && toCurrency === 'EUR') return price * EXCHANGE_RATES.MDL.EUR;
    if (fromCurrency === 'RON' && toCurrency === 'MDL') return price * EXCHANGE_RATES.RON.MDL;
    if (fromCurrency === 'RON' && toCurrency === 'EUR') return price * EXCHANGE_RATES.RON.EUR;
    if (fromCurrency === 'EUR' && toCurrency === 'MDL') return price * EXCHANGE_RATES.EUR.MDL;
    if (fromCurrency === 'EUR' && toCurrency === 'RON') return price * EXCHANGE_RATES.EUR.RON;
    return price;
  };

  const addToCart = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    
    toast({
      title: "Produs adăugat în coș",
      description: `${product.name} a fost adăugat în coșul de cumpărături.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.id !== productId));
    toast({
      title: "Produs eliminat",
      description: "Produsul a fost eliminat din coș.",
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Coș golit",
      description: "Toate produsele au fost eliminate din coș.",
    });
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const convertedPrice = convertPrice(item.price, item.currency, currency);
    return sum + (convertedPrice * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      currency,
      setCurrency
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const ShoppingCart: React.FC = () => {
  const { t } = useLanguage();
  const { user, calculateDiscount } = useAuth();
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, currency, setCurrency } = useCart();
  
  const discount = user ? calculateDiscount(totalPrice) : 0;
  const finalPrice = totalPrice - discount;

  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
      case 'MDL': return 'lei';
      case 'RON': return 'lei';
      case 'EUR': return '€';
      default: return 'lei';
    }
  };

  const formatPrice = (price: number, curr: string) => {
    return `${price.toFixed(2)} ${getCurrencySymbol(curr)}`;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 relative">
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">{t('header.cart')}</span>
          {totalItems > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Coșul de cumpărături ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Currency Selector */}
          <div className="flex gap-2 my-4">
            {(['MDL', 'RON', 'EUR'] as const).map((curr) => (
              <Button
                key={curr}
                variant={currency === curr ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrency(curr)}
              >
                {curr}
              </Button>
            ))}
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Coșul este gol</p>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto space-y-4 py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.brand}</p>
                      <p className="font-semibold text-primary">
                        {formatPrice(item.price, item.currency)}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatPrice(totalPrice, currency)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Reducere ({user?.discountPercentage || 0}%):</span>
                      <span>-{formatPrice(discount, currency)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-primary">{formatPrice(finalPrice, currency)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Finalizează comanda
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearCart}
                  >
                    Golește coșul
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;