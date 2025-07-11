import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
  parentId?: string; // For subcategories
  imageUrl?: string; // For category thumbnail
  order?: number; // For controlling display order
  attributes?: {
    type?: string;
    color?: string;
    size?: string;
    [key: string]: any;
  }; // For additional filtering attributes
}

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

// Default categories (these will be replaced by Cloud Shop data in the future)
const defaultCategories: ProductCategory[] = [
  // Main categories
  { id: 'all', name: 'Toate produsele', slug: 'all', active: true, order: 0 },
  { id: 'lashes', name: 'Gene', slug: 'lashes', description: 'Produse pentru gene și extensii', active: true, order: 1 },
  { id: 'brows', name: 'Sprâncene', slug: 'brows', description: 'Produse pentru sprâncene', active: true, order: 2 },
  { id: 'lamination', name: 'Laminarea', slug: 'lamination', description: 'Produse pentru laminare', active: true, order: 3 },
  { id: 'cosmetics', name: 'Cosmetice & îngrijire personală', slug: 'cosmetics', description: 'Produse cosmetice și de îngrijire', active: true, order: 4 },
  
  // Subcategories for Gene (Eyelashes)
  { 
    id: 'lashes-black', 
    name: 'Gene negre', 
    slug: 'gene-negre', 
    description: 'Gene false negre pentru diverse stiluri',
    active: true,
    parentId: 'lashes',
    attributes: { color: 'black' },
    order: 1
  },
  { 
    id: 'lashes-brown', 
    name: 'Gene cafenii', 
    slug: 'gene-cafenii', 
    description: 'Gene false cafenii pentru un look natural',
    active: true,
    parentId: 'lashes',
    attributes: { color: 'brown' },
    order: 2
  },
  { 
    id: 'lashes-colored', 
    name: 'Gene colorate', 
    slug: 'gene-colorate', 
    description: 'Gene false colorate pentru un look dramatic',
    active: true,
    parentId: 'lashes',
    attributes: { color: 'multi' },
    order: 3
  },
  
  // Subcategories for Sprâncene (Eyebrows)
  { 
    id: 'brows-pencils', 
    name: 'Creioane sprâncene', 
    slug: 'creioane-sprancene', 
    description: 'Creioane pentru definirea sprâncenelor',
    active: true,
    parentId: 'brows',
    attributes: { type: 'pencil' },
    order: 1
  },
  { 
    id: 'brows-gels', 
    name: 'Geluri pentru sprâncene', 
    slug: 'geluri-sprancene', 
    description: 'Geluri pentru fixarea și colorarea sprâncenelor',
    active: true,
    parentId: 'brows',
    attributes: { type: 'gel' },
    order: 2
  },
  { 
    id: 'brows-kits', 
    name: 'Kituri complete', 
    slug: 'kituri-sprancene', 
    description: 'Seturi complete pentru îngrijirea sprâncenelor',
    active: true,
    parentId: 'brows',
    attributes: { type: 'kit' },
    order: 3
  },
  
  // Additional subcategories could be added for other main categories
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
          console.error('Error parsing stored categories', err);
          setCategories(defaultCategories);
        }
      } else {
        setCategories(defaultCategories);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
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
      console.error('Failed to add category', err);
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
      console.error('Failed to update category', err);
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
      console.error('Failed to delete category', err);
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

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};
