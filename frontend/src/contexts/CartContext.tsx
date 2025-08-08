import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CartItem {
  id: number;
  variantId?: number; // Added to support product variants
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  checkout: () => void;
  isCheckingOut: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user, isAuthenticated, updateUser, calculateDiscount } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === newItem.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const checkout = async () => {
    if (!isAuthenticated) {
      toast.error('Trebuie să vă autentificați pentru a finaliza comanda');
      return;
    }
    
    if (items.length === 0) {
      toast.error('Coșul este gol');
      return;
    }
    
    setIsCheckingOut(true);
    
    try {
      // Calculate total price and discount
      const totalPrice = getTotalPrice();
      const discount = isAuthenticated ? calculateDiscount(totalPrice) : 0;
      const finalPrice = totalPrice - discount;
      
      // In a real application, we would process payment here
      // For now, we'll just update the user's total spent
      
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const newTotalSpent = user.totalSpent + finalPrice;
        updateUser({
          totalSpent: newTotalSpent
        });
        
        toast.success('Comandă finalizată cu succes!');
        clearCart();
      }
    } catch (error) {
      toast.error('A apărut o eroare la procesarea comenzii');
      console.error('Checkout error:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    checkout,
    isCheckingOut,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};