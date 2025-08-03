import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { signUp, signIn, signOut, getCurrentUser } from '@/services/supabaseAuth';
import { insertUserProfile, getUserProfile } from '@/services/supabaseUserProfile';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

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
  register: (userData: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  calculateDiscount: (amount: number) => number;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State pentru MessageBox eroare Gmail duplicat
  const [showGmailError, setShowGmailError] = useState(false);
  // State pentru MessageBox confirmare email
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  // State pentru user
  const [user, setUser] = useState<User | null>(null);

  // Load user data from local storage on component mount
  useEffect(() => {
    const savedUserData = localStorage.getItem('addressBeautyUser');
    if (savedUserData) {
      try {
        const parsedUser = JSON.parse(savedUserData);
        // Convert string date back to Date object if registration bonus exists
        if (parsedUser.registrationBonus && parsedUser.registrationBonus.expiresAt) {
          parsedUser.registrationBonus.expiresAt = new Date(parsedUser.registrationBonus.expiresAt);
        }
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data from localStorage', error);
        setUser(null);
      }
    }
  }, []);

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

  // Login cu Supabase Auth
  const login = async (email: string, password: string) => {
    const { data, error } = await signIn(email, password);
    if (error) {
      // Verifică dacă eroarea e de tip "Email not confirmed"
      if (error.message && error.message.toLowerCase().includes('email not confirmed')) {
        toast.info('Contul nu este confirmat. Verifică emailul și confirmă contul pentru a te autentifica.');
        throw new Error('Contul nu este confirmat. Verifică emailul și confirmă contul pentru a te autentifica.');
      }
      throw new Error(error.message);
    }
    if (data.session && data.user) {
      // Poți extinde cu date suplimentare din profilul userului
      setUser({
        id: data.user.id,
        name: data.user.email || '',
        email: data.user.email || '',
        phone: '',
        birthdate: '',
        experience: 'beginner',
        country: '',
        city: '',
        address: '',
        totalSpent: 0,
        loyaltyLevel: 0,
        discountPercentage: 0,
        isAdmin: false,
      });
    }
  };

  // Register cu Supabase Auth
  // Register cu Supabase Auth și salvează datele suplimentare în tabelul users
  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    birthdate: string;
    experience: 'beginner' | 'experienced' | 'trainer';
    instagram?: string;
    country: string;
    city: string;
    village?: string;
    address: string;
  }) => {
    // Verifică dacă emailul există deja în baza de date (după profil, nu doar după id)
    if (userData.email.endsWith('@gmail.com')) {
      // Caută profil cu același email
      const { data: existingProfiles, error: profileError } = await getUserProfile(undefined, userData.email);
      if (profileError) {
        throw new Error('Eroare la verificarea emailului: ' + profileError.message);
      }
      if (existingProfiles && existingProfiles.length > 0) {
        setShowGmailError(true);
        throw new Error('Acest Gmail a fost deja folosit.');
      }
    }
    const { data, error } = await signUp(userData.email, userData.password);
    if (error) throw new Error(error.message);
    if (data.user) {
      // Verifică dacă profilul există deja
      const { data: existingProfile } = await getUserProfile(data.user.id);
      let profileInsert = { data: null, error: null };
      if (!existingProfile || existingProfile.length === 0) {
        // Salvează datele suplimentare în tabelul users
        profileInsert = await insertUserProfile({
          id: data.user.id, // id-ul generat de Supabase Auth
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          birthdate: userData.birthdate,
          experience: userData.experience,
          instagram: userData.instagram ? userData.instagram : null,
          country: userData.country,
          city: userData.city,
          village: userData.village ? userData.village : null,
          address: userData.address,
        });
        // Logare detaliată pentru debugging
        console.log('insertUserProfile response:', profileInsert);
        if (profileInsert?.error) {
          console.error('Supabase insert error:', profileInsert.error);
          throw new Error(profileInsert.error.message || 'Eroare la inserția profilului');
        }
      }
      setUser({
        id: data.user.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        birthdate: userData.birthdate,
        experience: userData.experience,
        instagram: userData.instagram,
        country: userData.country,
        city: userData.city,
        village: userData.village,
        address: userData.address,
        totalSpent: 0,
        loyaltyLevel: 0,
        discountPercentage: 0,
        isAdmin: false,
      });
      setShowConfirmDialog(true);
    }
  };

  // Logout cu Supabase Auth
  const logout = async () => {
    await signOut();
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
      {/* MessageBox-urile sunt afișate deasupra children (formularul de autentificare) */}
      {showConfirmDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: '2.5rem 2rem',
            maxWidth: 400,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            textAlign: 'center',
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 16, color: '#4077d6ff' }}>Confirmă emailul!</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: 24 }}>
              Pentru a continua, verifică emailul și confirmă contul.<br />
              <span style={{ color: '#555', fontSize: '0.95rem' }}>
                (Verifică și folderul Spam/Promotions dacă nu găsești emailul)
              </span>
            </p>
            <button
              style={{
                background: '#4077d6ff',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '0.75rem 1.5rem',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
              }}
              onClick={() => setShowConfirmDialog(false)}
            >
              Am înțeles
            </button>
          </div>
        </div>
      )}
      {showGmailError && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: '2.5rem 2rem',
            maxWidth: 400,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            textAlign: 'center',
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 16, color: '#dc2626' }}>Eroare Gmail!</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: 24 }}>
              Acest Gmail a fost deja folosit.<br />
              <span style={{ color: '#555', fontSize: '0.95rem' }}>
                Te rugăm să folosești alt email pentru înregistrare.
              </span>
            </p>
            <button
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '0.75rem 1.5rem',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
              }}
              onClick={() => setShowGmailError(false)}
            >
              Am înțeles
            </button>
          </div>
        </div>
      )}
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

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth();

  return (
    <Button onClick={logout} disabled={!isAuthenticated}>
      Deconectează-te
    </Button>
  );
};

export default LogoutButton;