import { 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc,
  writeBatch,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '@/types/Product';
import { Customer, NormalizedCustomer } from '@/types/Customer';
import { NormalizedRealProduct } from '@/types/RealProduct';
import { Order, OrderItem, OrderStatistics } from '@/types/Order';

// Collection names
export const COLLECTIONS = {
  PRODUCTS: 'products',
  GENE: 'Gene', // Collection for eyelash extension products
  COURSES: 'courses',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  USERS: 'users',
  NEWSLETTER: 'newsletter',
  CONTACTS: 'contacts',
  CUSTOMERS: 'customers'
};

// Products service
export const ProductService = {
  // Add a single product
  async addProduct(product: Omit<Product, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.PRODUCTS), {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Add multiple products (bulk)
  async addProducts(products: Omit<Product, 'id'>[]) {
    try {
      const batch = writeBatch(db);
      const productRefs: string[] = [];

      for (const product of products) {
        const docRef = doc(collection(db, COLLECTIONS.PRODUCTS));
        batch.set(docRef, {
          ...product,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        productRefs.push(docRef.id);
      }

      await batch.commit();
      return productRefs;
    } catch (error) {
      console.error('Error adding products:', error);
      throw error;
    }
  },

  // Get all products
  async getAllProducts(): Promise<Product[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
      return querySnapshot.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data()
      } as Product));
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  },

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.PRODUCTS),
        where('category', '==', category),
        orderBy('sales', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data()
      } as Product));
    } catch (error) {
      console.error('Error getting products by category:', error);
      throw error;
    }
  },

  // Update product
  async updateProduct(id: string, updates: Partial<Product>) {
    try {
      const productRef = doc(db, COLLECTIONS.PRODUCTS, id);
      await updateDoc(productRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Get product by ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: parseInt(docSnap.id),
          ...docSnap.data()
        } as Product;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting product by ID:', error);
      throw error;
    }
  },

  // Search products
  async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      const products = await this.getAllProducts();
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      return products.filter(product => 
        product.name.toLowerCase().includes(lowerSearchTerm) ||
        (product.description && product.description.toLowerCase().includes(lowerSearchTerm)) ||
        product.category.toLowerCase().includes(lowerSearchTerm)
      );
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
};

// Course type definition
export interface Course {
  id: string;
  title: string;
  titleRu: string;
  duration: string;
  price: {
    eur: number;
    mdl: number;
  };
  description: string;
  descriptionRu: string;
  includes: string[];
  includesRu: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  image: string;
  featured: boolean;
  available: boolean;
  maxStudents: number;
  currentStudents: number;
  certificateIncluded: boolean;
  practicalHours: number;
  theoryHours: number;
  startDate?: string;
  endDate?: string;
  instructor: {
    name: string;
    nameRu: string;
    experience: string;
    image: string;
  };
}

// Courses service
export const CourseService = {
  // Add a course
  async addCourse(course: Omit<Course, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.COURSES), course);
      return docRef.id;
    } catch (error) {
      console.error('Error adding course:', error);
      throw error;
    }
  },

  // Add multiple courses
  async addCourses(courses: Omit<Course, 'id'>[]) {
    try {
      const batch = writeBatch(db);
      const courseRefs: string[] = [];

      for (const course of courses) {
        const docRef = doc(collection(db, COLLECTIONS.COURSES));
        batch.set(docRef, course);
        courseRefs.push(docRef.id);
      }

      await batch.commit();
      return courseRefs;
    } catch (error) {
      console.error('Error adding courses:', error);
      throw error;
    }
  },

  // Get all courses
  async getAllCourses(): Promise<Course[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.COURSES));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Course));
    } catch (error) {
      console.error('Error getting courses:', error);
      throw error;
    }
  },

  // Update a course
  async updateCourse(courseId: string, courseData: Partial<Omit<Course, 'id'>>) {
    try {
      const docRef = doc(db, COLLECTIONS.COURSES, courseId);
      await updateDoc(docRef, courseData);
      return courseId;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  // Delete a course
  async deleteCourse(courseId: string) {
    try {
      const docRef = doc(db, COLLECTIONS.COURSES, courseId);
      await deleteDoc(docRef);
      return courseId;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
};

// Newsletter service
export const NewsletterService = {
  async addSubscriber(email: string, language: string = 'RO') {
    try {
      const subscriber = {
        email,
        language,
        subscribedAt: new Date(),
        isActive: true
      };
      
      const docRef = await addDoc(collection(db, COLLECTIONS.NEWSLETTER), subscriber);
      return docRef.id;
    } catch (error) {
      console.error('Error adding newsletter subscriber:', error);
      throw error;
    }
  }
};

// Contact service
export const ContactService = {
  async addContact(contactData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    language: string;
  }) {
    try {
      const contact = {
        ...contactData,
        createdAt: new Date(),
        isRead: false
      };
      
      const docRef = await addDoc(collection(db, COLLECTIONS.CONTACTS), contact);
      return docRef.id;
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  }
};

// Customers service
export const CustomerService = {
  // Normalize customer data from JSON format
  normalizeCustomer(rawCustomer: any): NormalizedCustomer {
    // Parse date from format "dd/mm/yyyy" to Date object
    const parseDate = (dateString: string): Date => {
      if (!dateString || dateString === '-') {
        return new Date();
      }
      
      const parts = dateString.split('/');
      if (parts.length === 3) {
        // Assuming format is dd/mm/yyyy
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Month is 0-indexed
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
      }
      
      return new Date();
    };

    // Calculate loyalty tier based on total spent
    const calculateLoyaltyTier = (totalSpent: number): 'bronze' | 'silver' | 'gold' | 'platinum' => {
      if (totalSpent >= 5000) return 'platinum';
      if (totalSpent >= 2000) return 'gold';
      if (totalSpent >= 500) return 'silver';
      return 'bronze';
    };

    const totalSpent = rawCustomer.totalSpent || Math.random() * 3000; // Random for demo
    const totalOrders = rawCustomer.totalOrders || Math.floor(Math.random() * 20); // Random for demo

    return {
      name: rawCustomer["Наименование"] || rawCustomer.name || '',
      phone: rawCustomer["Телефон"] || rawCustomer.phone || '',
      email: rawCustomer["Email"] || rawCustomer.email || '',
      birthday: rawCustomer["День рождения"] || rawCustomer.birthday || '',
      gender: rawCustomer["Пол"] || rawCustomer.gender || '',
      description: rawCustomer["Описание"] || rawCustomer.description || '',
      address: rawCustomer["адрес"] || rawCustomer.address || '',
      addedBy: rawCustomer["Добавил"] || rawCustomer.addedBy || '',
      createdAt: parseDate(rawCustomer["Создан"] || rawCustomer.createdAt),
      status: 'active',
      totalOrders: totalOrders,
      totalSpent: totalSpent,
      preferredLanguage: 'RO',
      tags: [],
      notes: '',
      // New properties
      loyaltyTier: calculateLoyaltyTier(totalSpent),
      isActive: Math.random() > 0.2, // 80% chance of being active
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(rawCustomer["Наименование"] || rawCustomer.name || 'User')}&background=random`,
      registrationDate: parseDate(rawCustomer["Создан"] || rawCustomer.createdAt),
      orderCount: totalOrders
    };
  },

  // Add a single customer
  async addCustomer(customer: Omit<NormalizedCustomer, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.CUSTOMERS), {
        ...customer,
        createdAt: customer.createdAt || new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  },

  // Add multiple customers (bulk import)
  async addCustomers(customers: Omit<NormalizedCustomer, 'id'>[]) {
    try {
      const batch = writeBatch(db);
      const customerRefs: string[] = [];

      for (const customer of customers) {
        const docRef = doc(collection(db, COLLECTIONS.CUSTOMERS));
        batch.set(docRef, {
          ...customer,
          createdAt: customer.createdAt || new Date(),
          updatedAt: new Date()
        });
        customerRefs.push(docRef.id);
      }

      await batch.commit();
      return customerRefs;
    } catch (error) {
      console.error('Error adding customers:', error);
      throw error;
    }
  },

  // Get all customers
  async getAllCustomers(): Promise<NormalizedCustomer[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, COLLECTIONS.CUSTOMERS),
          orderBy('createdAt', 'desc')
        )
      );
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        const totalSpent = data.totalSpent || Math.random() * 3000;
        const totalOrders = data.totalOrders || Math.floor(Math.random() * 20);
        
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastVisit: data.lastVisit?.toDate(),
          registrationDate: data.registrationDate?.toDate() || data.createdAt?.toDate() || new Date(),
          // Ensure all required properties exist
          loyaltyTier: data.loyaltyTier || (totalSpent >= 5000 ? 'platinum' : totalSpent >= 2000 ? 'gold' : totalSpent >= 500 ? 'silver' : 'bronze'),
          isActive: data.isActive !== undefined ? data.isActive : Math.random() > 0.2,
          avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=random`,
          orderCount: data.orderCount || totalOrders,
          totalSpent: totalSpent,
          totalOrders: totalOrders
        } as NormalizedCustomer;
      });
    } catch (error) {
      console.error('Error getting customers:', error);
      throw error;
    }
  },

  // Get customers by status
  async getCustomersByStatus(status: 'active' | 'inactive'): Promise<NormalizedCustomer[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.CUSTOMERS),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastVisit: doc.data().lastVisit?.toDate()
      } as NormalizedCustomer));
    } catch (error) {
      console.error('Error getting customers by status:', error);
      throw error;
    }
  },

  // Search customers by name or phone
  async searchCustomers(searchTerm: string): Promise<NormalizedCustomer[]> {
    try {
      // Note: This is a basic search. For better search functionality, 
      // consider using Algolia or implement text search in Firestore
      const customersSnapshot = await getDocs(collection(db, COLLECTIONS.CUSTOMERS));
      
      const customers = customersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastVisit: doc.data().lastVisit?.toDate()
      } as NormalizedCustomer));

      return customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  },

  // Update customer
  async updateCustomer(id: string, updates: Partial<NormalizedCustomer>) {
    try {
      const customerRef = doc(db, COLLECTIONS.CUSTOMERS, id);
      await updateDoc(customerRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  // Delete customer
  async deleteCustomer(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.CUSTOMERS, id));
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  // Get customer statistics
  async getCustomerStats() {
    try {
      const customersSnapshot = await getDocs(collection(db, COLLECTIONS.CUSTOMERS));
      const customers = customersSnapshot.docs.map(doc => doc.data() as NormalizedCustomer);
      
      return {
        total: customers.length,
        active: customers.filter(c => c.status === 'active').length,
        inactive: customers.filter(c => c.status === 'inactive').length,
        withEmail: customers.filter(c => c.email && c.email !== '-').length,
        withPhone: customers.filter(c => c.phone && c.phone !== '-').length,
        totalSpent: customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0),
        averageSpent: customers.length > 0 ? 
          customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / customers.length : 0
      };
    } catch (error) {
      console.error('Error getting customer stats:', error);
      throw error;
    }
  }
};

// Gene Products Service for gene.json products
export class GeneProductService {
  // Helper function to remove undefined values
  private static cleanForFirebase(obj: any): any {
    const cleaned: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
          const cleanedNested = this.cleanForFirebase(value);
          if (Object.keys(cleanedNested).length > 0) {
            cleaned[key] = cleanedNested;
          }
        } else {
          cleaned[key] = value;
        }
      }
    }
    
    return cleaned;
  }

  // Add multiple gene products
  static async addGeneProducts(products: Omit<NormalizedRealProduct, 'id'>[]): Promise<string[]> {
    const batch = writeBatch(db);
    const ids: string[] = [];
    
    for (const product of products) {
      const docRef = doc(collection(db, COLLECTIONS.GENE));
      const cleanedProduct = this.cleanForFirebase({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      batch.set(docRef, cleanedProduct);
      ids.push(docRef.id);
    }
    
    await batch.commit();
    console.log(`Added ${ids.length} gene products to Firestore`);
    return ids;
  }

  // Get all gene products
  static async getAllGeneProducts(): Promise<NormalizedRealProduct[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.GENE));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as NormalizedRealProduct));
  }

  // Get gene products by category
  static async getGeneProductsByCategory(category: string): Promise<NormalizedRealProduct[]> {
    const q = query(
      collection(db, COLLECTIONS.GENE),
      where('category', '==', category),
      orderBy('name')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as NormalizedRealProduct));
  }

  // Get featured gene products
  static async getFeaturedGeneProducts(limitCount: number = 10): Promise<NormalizedRealProduct[]> {
    const q = query(
      collection(db, COLLECTIONS.GENE),
      where('featured', '==', true),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as NormalizedRealProduct));
  }

  // Get in-stock gene products
  static async getInStockGeneProducts(): Promise<NormalizedRealProduct[]> {
    const q = query(
      collection(db, COLLECTIONS.GENE),
      where('inStock', '==', true),
      orderBy('name')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as NormalizedRealProduct));
  }

  // Search gene products
  static async searchGeneProducts(searchTerm: string): Promise<NormalizedRealProduct[]> {
    // Note: Firestore doesn't support full-text search, so we'll get all products
    // and filter client-side. For production, consider using Algolia or similar.
    const allProducts = await this.getAllGeneProducts();
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(lowerSearchTerm) ||
      product.nameRu.toLowerCase().includes(lowerSearchTerm) ||
      product.code.toLowerCase().includes(lowerSearchTerm) ||
      product.description.toLowerCase().includes(lowerSearchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
    );
  }

  // Update gene product
  static async updateGeneProduct(id: string, updates: Partial<NormalizedRealProduct>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.GENE, id);
    const cleanedUpdates = this.cleanForFirebase({
      ...updates,
      updatedAt: new Date()
    });
    await updateDoc(docRef, cleanedUpdates);
  }

  // Delete gene product
  static async deleteGeneProduct(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.GENE, id));
  }

  // Get gene product statistics
  static async getGeneProductStats(): Promise<{
    total: number;
    inStock: number;
    outOfStock: number;
    byCategory: Record<string, number>;
    averagePrice: { eur: number; mdl: number };
  }> {
    const products = await this.getAllGeneProducts();
    
    const stats = {
      total: products.length,
      inStock: products.filter(p => p.inStock).length,
      outOfStock: products.filter(p => !p.inStock).length,
      byCategory: {} as Record<string, number>,
      averagePrice: { eur: 0, mdl: 0 }
    };
    
    // Calculate category distribution
    products.forEach(product => {
      stats.byCategory[product.category] = (stats.byCategory[product.category] || 0) + 1;
    });
    
    // Calculate average prices
    if (products.length > 0) {
      const totalEur = products.reduce((sum, p) => sum + p.price.eur, 0);
      const totalMdl = products.reduce((sum, p) => sum + p.price.mdl, 0);
      stats.averagePrice.eur = Math.round((totalEur / products.length) * 100) / 100;
      stats.averagePrice.mdl = Math.round((totalMdl / products.length) * 100) / 100;
    }
    
    return stats;
  }

  // Clear all gene products
  static async clearAllGeneProducts(): Promise<void> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.GENE));
    const batch = writeBatch(db);
    
    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log('All gene products cleared successfully');
  }
}

// Clear all data (for testing) - Optimized to avoid quota exceeded
export const clearAllData = async () => {
  try {
    console.log('🗑️ Starting complete database cleanup...');
    
    // Get all collection names including category collections
    const allCollections = [
      ...Object.values(COLLECTIONS),
      'gene', 'adezive', 'accesorii', 'consumabile', 
      'laminare', 'oko', 'preparate', 'ustensile', 'ingrijire-personala'
    ];
    
    let totalDeleted = 0;
    
    for (const collectionName of allCollections) {
      try {
        console.log(`🗑️ Clearing collection: ${collectionName}`);
        
        let hasMore = true;
        let batchCount = 0;
        
        while (hasMore) {
          // Get documents in smaller batches to avoid quota issues
          const q = query(collection(db, collectionName), limit(100));
          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.empty) {
            hasMore = false;
            continue;
          }
          
          // Delete in smaller batches
          const batch = writeBatch(db);
          let batchSize = 0;
          
          querySnapshot.docs.forEach((doc) => {
            if (batchSize < 50) { // Smaller batch size to avoid quota
              batch.delete(doc.ref);
              batchSize++;
            }
          });
          
          if (batchSize > 0) {
            await batch.commit();
            totalDeleted += batchSize;
            batchCount++;
            
            console.log(`   ✅ Deleted batch ${batchCount} (${batchSize} documents) from ${collectionName}`);
            
            // Add delay between batches to avoid quota exceeded
            if (batchCount % 5 === 0) {
              console.log(`   ⏳ Waiting 2 seconds to avoid quota limits...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
          
          // Check if there are more documents
          if (querySnapshot.docs.length < 100) {
            hasMore = false;
          } else {
            // Small delay between queries
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        console.log(`   ✅ Collection ${collectionName} cleared completely`);
        
      } catch (collectionError) {
        console.warn(`⚠️ Warning: Could not clear collection ${collectionName}:`, collectionError);
        // Continue with other collections even if one fails
      }
      
      // Add delay between collections
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`🎉 Database cleanup completed! Total documents deleted: ${totalDeleted}`);
    return { success: true, deletedCount: totalDeleted };
    
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  }
};

// Orders service
export const OrderService = {
  // Add a new order
  async addOrder(order: Omit<Order, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), {
        ...order,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },

  // Get all orders
  async getAllOrders(): Promise<Order[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.ORDERS),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        shippedAt: doc.data().shippedAt?.toDate(),
        deliveredAt: doc.data().deliveredAt?.toDate()
      } as Order));
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  },

  // Get orders by status
  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.ORDERS),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        shippedAt: doc.data().shippedAt?.toDate(),
        deliveredAt: doc.data().deliveredAt?.toDate()
      } as Order));
    } catch (error) {
      console.error('Error getting orders by status:', error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(id: string, status: Order['status'], trackingNumber?: string) {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date()
      };

      if (status === 'shipped' && trackingNumber) {
        updateData.trackingNumber = trackingNumber;
        updateData.shippedAt = new Date();
      }

      if (status === 'delivered') {
        updateData.deliveredAt = new Date();
      }

      const orderRef = doc(db, COLLECTIONS.ORDERS, id);
      await updateDoc(orderRef, updateData);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Update order
  async updateOrder(id: string, updates: Partial<Order>) {
    try {
      const orderRef = doc(db, COLLECTIONS.ORDERS, id);
      await updateDoc(orderRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  // Delete order
  async deleteOrder(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.ORDERS, id));
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  // Get order statistics
  async getOrderStatistics(): Promise<OrderStatistics> {
    try {
      const orders = await this.getAllOrders();
      
      const stats: OrderStatistics = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + o.total, 0),
        averageOrderValue: 0,
        recentOrders: orders.slice(0, 10)
      };

      stats.averageOrderValue = stats.total > 0 ? stats.totalRevenue / stats.total : 0;

      return stats;
    } catch (error) {
      console.error('Error getting order statistics:', error);
      throw error;
    }
  },

  // Search orders
  async searchOrders(searchTerm: string): Promise<Order[]> {
    try {
      const orders = await this.getAllOrders();
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      return orders.filter(order => 
        order.orderNumber.toLowerCase().includes(lowerSearchTerm) ||
        order.customerInfo.name.toLowerCase().includes(lowerSearchTerm) ||
        order.customerInfo.email.toLowerCase().includes(lowerSearchTerm) ||
        order.customerInfo.phone.includes(searchTerm) ||
        order.id.toLowerCase().includes(lowerSearchTerm)
      );
    } catch (error) {
      console.error('Error searching orders:', error);
      throw error;
    }
  }
};

// Admin Dashboard Service
export const AdminService = {
  // Get complete dashboard statistics
  async getDashboardStats() {
    try {
      const [orderStats, customerStats, productStats] = await Promise.all([
        OrderService.getOrderStatistics(),
        CustomerService.getCustomerStats(),
        this.getProductStats()
      ]);

      return {
        orders: orderStats,
        customers: customerStats,
        products: productStats,
        revenue: {
          total: orderStats.totalRevenue,
          monthly: await this.getMonthlyRevenue(),
          daily: await this.getDailyRevenue()
        }
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  },

  // Get product statistics across all collections
  async getProductStats() {
    try {
      const [products, geneProducts] = await Promise.all([
        ProductService.getAllProducts(),
        GeneProductService.getAllGeneProducts()
      ]);

      const allProducts = [...products, ...geneProducts];

      return {
        total: allProducts.length,
        inStock: allProducts.filter(p => p.inStock).length,
        outOfStock: allProducts.filter(p => !p.inStock).length,
        lowStock: allProducts.filter(p => (p as any).stockQuantity < 10).length
      };
    } catch (error) {
      console.error('Error getting product stats:', error);
      return {
        total: 0,
        inStock: 0,
        outOfStock: 0,
        lowStock: 0
      };
    }
  },

  // Get monthly revenue for the current year
  async getMonthlyRevenue() {
    try {
      const orders = await OrderService.getAllOrders();
      const currentYear = new Date().getFullYear();
      
      const monthlyRevenue = Array(12).fill(0);
      
      orders
        .filter(order => 
          order.createdAt.getFullYear() === currentYear && 
          order.status !== 'cancelled'
        )
        .forEach(order => {
          const month = order.createdAt.getMonth();
          monthlyRevenue[month] += order.total;
        });

      return monthlyRevenue;
    } catch (error) {
      console.error('Error getting monthly revenue:', error);
      return Array(12).fill(0);
    }
  },

  // Get daily revenue for the last 30 days
  async getDailyRevenue() {
    try {
      const orders = await OrderService.getAllOrders();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const dailyRevenue: Record<string, number> = {};
      
      orders
        .filter(order => 
          order.createdAt >= thirtyDaysAgo && 
          order.status !== 'cancelled'
        )
        .forEach(order => {
          const dateKey = order.createdAt.toISOString().split('T')[0];
          dailyRevenue[dateKey] = (dailyRevenue[dateKey] || 0) + order.total;
        });

      return dailyRevenue;
    } catch (error) {
      console.error('Error getting daily revenue:', error);
      return {};
    }
  }
};
