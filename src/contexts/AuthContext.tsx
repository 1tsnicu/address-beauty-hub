import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  experience: 'beginner' | 'experienced' | 'trainer';
  instagram?: string;
  country: string;
  city: string;
  village?: string;
  address: string;
  totalSpent: number;
  loyaltyLevel: number;
  discountPercentage: number;
  registrationBonus?: {
    percentage: number;
    expiresAt: Date;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'totalSpent' | 'loyaltyLevel' | 'discountPercentage'>) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  calculateDiscount: (amount: number) => number;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const calculateLoyaltyLevel = (totalSpent: number): { level: number; discount: number } => {
    if (totalSpent >= 50001) return { level: 5, discount: 10 };
    if (totalSpent >= 30001) return { level: 4, discount: 8 };
    if (totalSpent >= 20001) return { level: 3, discount: 7 };
    if (totalSpent >= 10001) return { level: 2, discount: 6 };
    if (totalSpent >= 5001) return { level: 1, discount: 5 };
    return { level: 0, discount: 0 };
  };

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would be an API call
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      email,
      phone: '+37368882490',
      birthdate: '1990-01-01',
      experience: 'experienced',
      country: 'Moldova',
      city: 'Chișinău',
      address: 'Str. Test 123',
      totalSpent: 15000,
      loyaltyLevel: 2,
      discountPercentage: 6,
    };
    
    const loyaltyInfo = calculateLoyaltyLevel(mockUser.totalSpent);
    mockUser.loyaltyLevel = loyaltyInfo.level;
    mockUser.discountPercentage = loyaltyInfo.discount;
    
    setUser(mockUser);
  };

  const register = async (userData: Omit<User, 'id' | 'totalSpent' | 'loyaltyLevel' | 'discountPercentage'>) => {
    // Mock registration - in real app, this would be an API call
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      totalSpent: 0,
      loyaltyLevel: 0,
      discountPercentage: 0,
      registrationBonus: {
        percentage: 15,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      },
    };
    
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      const loyaltyInfo = calculateLoyaltyLevel(updatedUser.totalSpent);
      updatedUser.loyaltyLevel = loyaltyInfo.level;
      updatedUser.discountPercentage = loyaltyInfo.discount;
      setUser(updatedUser);
    }
  };

  const calculateDiscount = (amount: number): number => {
    if (!user) return 0;
    
    // Check if registration bonus is still valid
    if (user.registrationBonus && new Date() < user.registrationBonus.expiresAt) {
      return (amount * user.registrationBonus.percentage) / 100;
    }
    
    // Use loyalty discount
    return (amount * user.discountPercentage) / 100;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateUser,
      calculateDiscount,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};