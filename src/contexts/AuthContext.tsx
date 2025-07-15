import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  isAdmin?: boolean; // Add admin flag
  registrationBonus?: {
    percentage: number;
    expiresAt: Date;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'totalSpent' | 'loyaltyLevel' | 'discountPercentage'>) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  calculateDiscount: (amount: number) => number;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load user data from local storage on component mount
  const [user, setUser] = useState<User | null>(() => {
    const savedUserData = localStorage.getItem('addressBeautyUser');
    if (savedUserData) {
      try {
        const parsedUser = JSON.parse(savedUserData);
        // Convert string date back to Date object if registration bonus exists
        if (parsedUser.registrationBonus && parsedUser.registrationBonus.expiresAt) {
          parsedUser.registrationBonus.expiresAt = new Date(parsedUser.registrationBonus.expiresAt);
        }
        return parsedUser;
      } catch (error) {
        console.error('Failed to parse user data from localStorage', error);
        return null;
      }
    }
    return null;
  });

  // Save user data to local storage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('addressBeautyUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('addressBeautyUser');
    }
  }, [user]);

  const calculateLoyaltyLevel = (totalSpent: number): { level: number; discount: number } => {
    if (totalSpent >= 50001) return { level: 5, discount: 10 };
    if (totalSpent >= 30001) return { level: 4, discount: 8 };
    if (totalSpent >= 20001) return { level: 3, discount: 7 };
    if (totalSpent >= 10001) return { level: 2, discount: 6 };
    if (totalSpent >= 5001) return { level: 1, discount: 5 };
    return { level: 0, discount: 0 };
  };

  const login = async (email: string, password: string, isAdmin = false) => {
    // Check admin credentials
    if (isAdmin) {
      if (email === 'admin@addressbeauty.md' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin',
          name: 'Administrator',
          email,
          phone: '+37368882490',
          birthdate: '1990-01-01',
          experience: 'trainer',
          country: 'Moldova',
          city: 'Chișinău',
          address: 'Address Beauty Hub',
          totalSpent: 0,
          loyaltyLevel: 5,
          discountPercentage: 0,
          isAdmin: true,
        };
        setUser(adminUser);
        return;
      } else {
        throw new Error('Credențiale admin invalide');
      }
    }

    // Regular user login
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
      isAdmin: false,
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
      isAdmin: !!user?.isAdmin,
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