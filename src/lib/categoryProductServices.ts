import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { NormalizedRealProduct } from '@/types/RealProduct';

// Collection names for different product categories
export const COLLECTIONS = {
  GENE: 'gene',
  ADEZIVE: 'adezive', 
  ACCESORII: 'accesorii',
  CONSUMABILE: 'consumabile',
  LAMINARE: 'laminare',
  OKO: 'oko',
  PREPARATE: 'preparate',
  USTENSILE: 'ustensile',
  INGRIJIRE_PERSONALA: 'ingrijire-personala'
} as const;

// Helper function to clean objects for Firebase
const cleanObjectForFirebase = (obj: any): any => {
  const cleaned: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        const cleanedNested = cleanObjectForFirebase(value);
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
      } else {
        cleaned[key] = value;
      }
    }
  }
  
  return cleaned;
};

// Generic service for product categories
export class CategoryProductService {
  
  // Add products to specific category collection
  static async addProductsToCategory(
    categoryName: string, 
    products: Omit<NormalizedRealProduct, 'id'>[]
  ): Promise<string[]> {
    try {
      const productIds: string[] = [];
      const collectionRef = collection(db, categoryName);
      
      for (const product of products) {
        const cleanedProduct = cleanObjectForFirebase(product);
        const docRef = await addDoc(collectionRef, cleanedProduct);
        productIds.push(docRef.id);
      }
      
      return productIds;
    } catch (error) {
      console.error(`Error adding products to ${categoryName}:`, error);
      throw error;
    }
  }

  // Get all products from specific category
  static async getProductsFromCategory(categoryName: string): Promise<NormalizedRealProduct[]> {
    try {
      const collectionRef = collection(db, categoryName);
      const querySnapshot = await getDocs(collectionRef);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as NormalizedRealProduct));
    } catch (error) {
      console.error(`Error getting products from ${categoryName}:`, error);
      throw error;
    }
  }

  // Get statistics for specific category
  static async getCategoryStats(categoryName: string) {
    try {
      const products = await this.getProductsFromCategory(categoryName);
      
      const stats = {
        total: products.length,
        inStock: products.filter(p => p.inStock).length,
        outOfStock: products.filter(p => !p.inStock).length,
        averagePrice: {
          mdl: 0,
          eur: 0
        },
        totalValue: {
          mdl: 0,
          eur: 0
        }
      };

      if (products.length > 0) {
        const totalMdl = products.reduce((sum, p) => sum + (p.price?.mdl || 0), 0);
        const totalEur = products.reduce((sum, p) => sum + (p.price?.eur || 0), 0);
        
        stats.averagePrice.mdl = Math.round(totalMdl / products.length);
        stats.averagePrice.eur = Math.round(totalEur / products.length);
        stats.totalValue.mdl = totalMdl;
        stats.totalValue.eur = totalEur;
      }

      return stats;
    } catch (error) {
      console.error(`Error getting stats for ${categoryName}:`, error);
      throw error;
    }
  }

  // Update product in specific category
  static async updateProductInCategory(
    categoryName: string, 
    productId: string, 
    updates: Partial<NormalizedRealProduct>
  ): Promise<void> {
    try {
      const docRef = doc(db, categoryName, productId);
      const cleanedUpdates = cleanObjectForFirebase(updates);
      await updateDoc(docRef, cleanedUpdates);
    } catch (error) {
      console.error(`Error updating product in ${categoryName}:`, error);
      throw error;
    }
  }

  // Delete product from specific category
  static async deleteProductFromCategory(categoryName: string, productId: string): Promise<void> {
    try {
      const docRef = doc(db, categoryName, productId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting product from ${categoryName}:`, error);
      throw error;
    }
  }

  // Search products in specific category
  static async searchProductsInCategory(
    categoryName: string, 
    searchTerm: string
  ): Promise<NormalizedRealProduct[]> {
    try {
      const products = await this.getProductsFromCategory(categoryName);
      const searchLower = searchTerm.toLowerCase();
      
      return products.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.code?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error(`Error searching products in ${categoryName}:`, error);
      throw error;
    }
  }

  // Clear all products from specific category
  static async clearCategory(categoryName: string): Promise<void> {
    try {
      const products = await this.getProductsFromCategory(categoryName);
      const deletePromises = products.map(product => 
        this.deleteProductFromCategory(categoryName, product.id)
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error(`Error clearing category ${categoryName}:`, error);
      throw error;
    }
  }
}

// Specific services for each category
export class GeneProductService extends CategoryProductService {
  static async addGeneProducts(products: Omit<NormalizedRealProduct, 'id'>[]): Promise<string[]> {
    return this.addProductsToCategory(COLLECTIONS.GENE, products);
  }

  static async getAllGeneProducts(): Promise<NormalizedRealProduct[]> {
    return this.getProductsFromCategory(COLLECTIONS.GENE);
  }

  static async getGeneProductStats() {
    return this.getCategoryStats(COLLECTIONS.GENE);
  }
}

export class AdeziveProductService extends CategoryProductService {
  static async addAdeziveProducts(products: Omit<NormalizedRealProduct, 'id'>[]): Promise<string[]> {
    return this.addProductsToCategory(COLLECTIONS.ADEZIVE, products);
  }

  static async getAllAdeziveProducts(): Promise<NormalizedRealProduct[]> {
    return this.getProductsFromCategory(COLLECTIONS.ADEZIVE);
  }

  static async getAdeziveProductStats() {
    return this.getCategoryStats(COLLECTIONS.ADEZIVE);
  }
}

export class AccesoriiProductService extends CategoryProductService {
  static async addAccesoriiProducts(products: Omit<NormalizedRealProduct, 'id'>[]): Promise<string[]> {
    return this.addProductsToCategory(COLLECTIONS.ACCESORII, products);
  }

  static async getAllAccesoriiProducts(): Promise<NormalizedRealProduct[]> {
    return this.getProductsFromCategory(COLLECTIONS.ACCESORII);
  }

  static async getAccesoriiProductStats() {
    return this.getCategoryStats(COLLECTIONS.ACCESORII);
  }
}

export class ConsumabileProductService extends CategoryProductService {
  static async addConsumabileProducts(products: Omit<NormalizedRealProduct, 'id'>[]): Promise<string[]> {
    return this.addProductsToCategory(COLLECTIONS.CONSUMABILE, products);
  }

  static async getAllConsumabileProducts(): Promise<NormalizedRealProduct[]> {
    return this.getProductsFromCategory(COLLECTIONS.CONSUMABILE);
  }

  static async getConsumabileProductStats() {
    return this.getCategoryStats(COLLECTIONS.CONSUMABILE);
  }
}

export class LaminareProductService extends CategoryProductService {
  static async addLaminareProducts(products: Omit<NormalizedRealProduct, 'id'>[]): Promise<string[]> {
    return this.addProductsToCategory(COLLECTIONS.LAMINARE, products);
  }

  static async getAllLaminareProducts(): Promise<NormalizedRealProduct[]> {
    return this.getProductsFromCategory(COLLECTIONS.LAMINARE);
  }

  static async getLaminareProductStats() {
    return this.getCategoryStats(COLLECTIONS.LAMINARE);
  }
}

export class OkoProductService extends CategoryProductService {
  static async addOkoProducts(products: Omit<NormalizedRealProduct, 'id'>[]): Promise<string[]> {
    return this.addProductsToCategory(COLLECTIONS.OKO, products);
  }

  static async getAllOkoProducts(): Promise<NormalizedRealProduct[]> {
    return this.getProductsFromCategory(COLLECTIONS.OKO);
  }

  static async getOkoProductStats() {
    return this.getCategoryStats(COLLECTIONS.OKO);
  }
}

export class PreparateProductService extends CategoryProductService {
  static async addPreparateProducts(products: Omit<NormalizedRealProduct, 'id'>[]): Promise<string[]> {
    return this.addProductsToCategory(COLLECTIONS.PREPARATE, products);
  }

  static async getAllPreparateProducts(): Promise<NormalizedRealProduct[]> {
    return this.getProductsFromCategory(COLLECTIONS.PREPARATE);
  }

  static async getPreparateProductStats() {
    return this.getCategoryStats(COLLECTIONS.PREPARATE);
  }
}

export class UstensileProductService extends CategoryProductService {
  static async addUstensileProducts(products: Omit<NormalizedRealProduct, 'id'>[]): Promise<string[]> {
    return this.addProductsToCategory(COLLECTIONS.USTENSILE, products);
  }

  static async getAllUstensileProducts(): Promise<NormalizedRealProduct[]> {
    return this.getProductsFromCategory(COLLECTIONS.USTENSILE);
  }

  static async getUstensileProductStats() {
    return this.getCategoryStats(COLLECTIONS.USTENSILE);
  }
}

export class IngrijirePersonalaProductService extends CategoryProductService {
  static async addIngrijirePersonalaProducts(products: Omit<NormalizedRealProduct, 'id'>[]): Promise<string[]> {
    return this.addProductsToCategory(COLLECTIONS.INGRIJIRE_PERSONALA, products);
  }

  static async getAllIngrijirePersonalaProducts(): Promise<NormalizedRealProduct[]> {
    return this.getProductsFromCategory(COLLECTIONS.INGRIJIRE_PERSONALA);
  }

  static async getIngrijirePersonalaProductStats() {
    return this.getCategoryStats(COLLECTIONS.INGRIJIRE_PERSONALA);
  }
}
