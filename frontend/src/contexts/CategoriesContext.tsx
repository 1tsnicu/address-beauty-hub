import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProductCategory } from '@/types/Category';

interface CategoriesContextType {
  categories: ProductCategory[];
  isLoading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
  addCategory: (category: Omit<ProductCategory, 'id'>) => Promise<void>;
  updateCategory: (id: string, categoryData: Partial<ProductCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export { CategoriesContext };

// Default categories (these will be replaced by Cloud Shop data in the future)
const defaultCategories: ProductCategory[] = [
  // Main categories
  { id: 'all', name: 'Toate produsele', slug: 'all', active: true, order: 0 },
  { id: 'lashes', name: 'Gene', slug: 'lashes', description: 'Produse pentru gene și extensii', active: true, order: 1 },
  { id: 'brows', name: 'Sprâncene', slug: 'brows', description: 'Produse pentru sprâncene (în curând completată)', active: true, order: 2 },
  { id: 'lamination', name: 'Laminarea', slug: 'lamination', description: 'Produse pentru laminare', active: true, order: 3 },
  { id: 'cosmetics', name: 'Îngrijire Personală', slug: 'cosmetics', description: 'Momentan disponibilă doar ca denumire, urmează să o completăm...', active: true, order: 4 },
  
  // Subcategories for Gene (Eyelashes) - based on Firebase collections
  { 
    id: 'lashes-individual', 
    name: 'Gene fir cu fir / bande', 
    slug: 'gene-fir-cu-fir', 
    description: 'Gene false individuale și în bande (datele din gene)',
    active: true,
    parentId: 'lashes',
    order: 1
  },
  { 
    id: 'lashes-adhesives', 
    name: 'Adezive', 
    slug: 'adezive', 
    description: 'Adezive profesionale pentru aplicarea genelor (datele din adezive)',
    active: true,
    parentId: 'lashes',
    order: 2
  },
  { 
    id: 'lashes-care', 
    name: 'Preparate pentru aplicare și îngrijire', 
    slug: 'preparate-ingrijire', 
    description: 'Preparate pentru aplicare și îngrijire (datele din ingrijire-personala)',
    active: true,
    parentId: 'lashes',
    order: 3
  },
  { 
    id: 'lashes-consumables', 
    name: 'Consumabile & accesorii', 
    slug: 'consumabile-accesorii', 
    description: 'Consumabile și accesorii pentru aplicare (datele din consumabile)',
    active: true,
    parentId: 'lashes',
    order: 4
  },
  { 
    id: 'lashes-tools', 
    name: 'Ustensile profesionale', 
    slug: 'ustensile-profesionale', 
    description: 'Ustensile și instrumente profesionale (datele din ustensile)',
    active: true,
    parentId: 'lashes',
    order: 5
  },
  { 
    id: 'lashes-led', 
    name: 'Tehnologie LED', 
    slug: 'tehnologie-led', 
    description: 'Echipamente și tehnologie LED pentru aplicare',
    active: true,
    parentId: 'lashes',
    order: 6
  },

  // Subcategories for Sprâncene (în curând completată)
  { 
    id: 'brows-henna', 
    name: 'Henna pentru sprâncene', 
    slug: 'henna-sprancene', 
    description: 'Henna profesională pentru sprâncene',
    active: true, // Activată conform cererii
    parentId: 'brows',
    order: 1
  },
  { 
    id: 'brows-dyes', 
    name: 'Vopsele profesionale', 
    slug: 'vopsele-profesionale', 
    description: 'Vopsele și coloranți pentru sprâncene',
    active: true, // Activată conform cererii
    parentId: 'brows',
    order: 2
  },
  { 
    id: 'brows-oxidants', 
    name: 'Oxidanți & preparate speciale', 
    slug: 'oxidanti-preparate', 
    description: 'Oxidanți și preparate speciale pentru sprâncene',
    active: true, // Activată conform cererii
    parentId: 'brows',
    order: 3
  },
  { 
    id: 'brows-brushes', 
    name: 'Pensule & instrumente dedicate', 
    slug: 'pensule-instrumente', 
    description: 'Pensule și instrumente dedicate pentru sprâncene',
    active: true, // Activată conform cererii
    parentId: 'brows',
    order: 4
  },

  // Subcategories for Laminare - based on Firebase collection
  { 
    id: 'lamination-solutions', 
    name: 'Soluții pentru laminare', 
    slug: 'solutii-laminare', 
    description: 'Soluții profesionale pentru laminare (datele din laminare)',
    active: true,
    parentId: 'lamination',
    order: 1
  },
  { 
    id: 'lamination-adhesives', 
    name: 'Adezive pentru laminare', 
    slug: 'adezive-laminare', 
    description: 'Adezive specializate pentru laminare (datele din laminare)',
    active: true,
    parentId: 'lamination',
    order: 2
  },
  { 
    id: 'lamination-accessories', 
    name: 'Role, bigudiuri & accesorii specifice', 
    slug: 'role-bigudiuri-accesorii', 
    description: 'Role, bigudiuri și accesorii pentru laminare (datele din laminare)',
    active: true,
    parentId: 'lamination',
    order: 3
  }
];

export const CategoriesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<ProductCategory[]>(defaultCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In the future, this will be replaced with a fetch to Cloud Shop API
      // For now, we use the default categories with a simulated delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if we have stored categories in localStorage
      const storedCategories = localStorage.getItem('addressBeautyCategories');
      if (storedCategories) {
        try {
          setCategories(JSON.parse(storedCategories));
        } catch (err) {
          setCategories(defaultCategories);
        }
      } else {
        setCategories(defaultCategories);
      }
    } catch (err) {
      setError('Nu s-au putut încărca categoriile. Vă rugăm încercați din nou mai târziu.');
      // Fallback to default categories
      setCategories(defaultCategories);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('addressBeautyCategories', JSON.stringify(categories));
  }, [categories]);

  const refreshCategories = async () => {
    await loadCategories();
  };

  const addCategory = async (category: Omit<ProductCategory, 'id'>) => {
    setIsLoading(true);
    
    try {
      // In the future, this will be an API call to Cloud Shop
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCategory: ProductCategory = {
        ...category,
        id: Date.now().toString(),
      };
      
      setCategories(prev => [...prev, newCategory]);
    } catch (err) {
      setError('Nu s-a putut adăuga categoria. Vă rugăm încercați din nou.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<ProductCategory>) => {
    setIsLoading(true);
    
    try {
      // In the future, this will be an API call to Cloud Shop
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCategories(prev => 
        prev.map(cat => 
          cat.id === id ? { ...cat, ...categoryData } : cat
        )
      );
    } catch (err) {
      setError('Nu s-a putut actualiza categoria. Vă rugăm încercați din nou.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setIsLoading(true);
    
    try {
      // In the future, this will be an API call to Cloud Shop
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      setError('Nu s-a putut șterge categoria. Vă rugăm încercați din nou.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CategoriesContext.Provider value={{
      categories,
      isLoading,
      error,
      refreshCategories,
      addCategory,
      updateCategory,
      deleteCategory,
    }}>
      {children}
    </CategoriesContext.Provider>
  );
};
