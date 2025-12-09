import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingBag, Plus, Minus, X, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from 'sonner';

interface ShoppingCartProps {
  className?: string;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ className = "" }) => {
  const { t } = useLanguage();
  const { user, isAuthenticated, calculateDiscount } = useAuth();
  const { items, removeItem, updateQuantity, clearCart, getTotalItems, getTotalPrice, checkout, isCheckingOut } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  
  const discount = isAuthenticated ? calculateDiscount(totalPrice) : 0;
  const finalPrice = totalPrice - discount;

  // Calculate how much more the user needs to spend to reach the next loyalty level
  const getNextLoyaltyLevelInfo = () => {
    if (!user) return null;
    
    const currentTotal = user.totalSpent;
    
    if (currentTotal < 5001) {
      return {
        nextLevel: 1,
        nextDiscount: 5,
        amountNeeded: 5001 - currentTotal,
        threshold: 5001
      };
    } else if (currentTotal < 10001) {
      return {
        nextLevel: 2,
        nextDiscount: 6,
        amountNeeded: 10001 - currentTotal,
        threshold: 10001
      };
    } else if (currentTotal < 20001) {
      return {
        nextLevel: 3,
        nextDiscount: 7,
        amountNeeded: 20001 - currentTotal,
        threshold: 20001
      };
    } else if (currentTotal < 30001) {
      return {
        nextLevel: 4,
        nextDiscount: 8,
        amountNeeded: 30001 - currentTotal,
        threshold: 30001
      };
    } else if (currentTotal < 50001) {
      return {
        nextLevel: 5,
        nextDiscount: 10,
        amountNeeded: 50001 - currentTotal,
        threshold: 50001
      };
    }
    
    return null; // User has reached the highest loyalty level
  };
  
  const nextLevelInfo = isAuthenticated ? getNextLoyaltyLevelInfo() : null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className={`gap-2 relative ${className}`}>
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Coș</span>
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
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Coșul este gol</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Adaugă produse pentru a începe cumpărăturile
                </p>
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
                       <p className="font-semibold text-primary">
                         {formatPrice(item.price)}
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
                          onClick={() => removeItem(item.id)}
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
                     <span>{formatPrice(totalPrice)}</span>
                   </div>
                   
                   {discount > 0 && (
                     <div className="flex justify-between text-sm text-green-600">
                       <span>Reducere client fidel:</span>
                       <span>-{formatPrice(discount)}</span>
                     </div>
                   )}
                   
                   <Separator />
                   
                   <div className="flex justify-between font-semibold">
                     <span>Total:</span>
                     <span className="text-primary">{formatPrice(finalPrice)}</span>
                   </div>
                </div>

                <div className="space-y-2">
                  <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.error('Trebuie să te conectezi pentru a face o comandă.');
                      return;
                    }
                    if (checkout()) {
                      setIsOpen(false); // Închide fereastra cu coșul
                      navigate('/checkout');
                    }
                  }} 
                  disabled={isCheckingOut || items.length === 0}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {isCheckingOut ? 'Se procesează...' : 'Finalizează comanda'}
                </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearCart}
                  >
                    Golește coșul
                  </Button>
                </div>

                {/* Registration bonus info for non-authenticated users */}
                {!isAuthenticated && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      💰 Creează cont și primești 15% reducere la prima comandă!
                    </p>
                  </div>
                )}
                
                {/* Loyalty program info for authenticated users */}
                {isAuthenticated && user && (
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Nivel fidelitate:</span>
                      <span className="font-semibold text-primary">{user.loyaltyLevel} ({user.discountPercentage}%)</span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Total cumpărături: {formatPrice(user.totalSpent)}
                    </div>
                    
                    {nextLevelInfo && (
                      <div className="mt-2 text-xs">
                        <p>Mai ai nevoie de {formatPrice(nextLevelInfo.amountNeeded)} pentru a atinge nivelul {nextLevelInfo.nextLevel} ({nextLevelInfo.nextDiscount}% reducere)</p>
                        <div className="w-full bg-muted h-1.5 rounded-full mt-1">
                          <div 
                            className="bg-primary h-1.5 rounded-full" 
                            style={{ 
                              width: `${Math.min(100, (user.totalSpent / nextLevelInfo.threshold) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;