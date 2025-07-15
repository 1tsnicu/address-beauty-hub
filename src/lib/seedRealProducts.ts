import { RealProductService as RealProductNormalizer } from '@/lib/RealProductService';
import { GeneProductService } from '@/lib/firebaseService';
import { CourseService, CustomerService } from '@/lib/firebaseService';
import { NormalizedCustomer } from '@/types/Customer';

// Import real products and customers data
import realProductsData from '@/data/gene.json';
import customersData from '@/data/clienti.json';

// Import courses data from existing seed file
import { coursesData } from './seedData';

// Function to seed gene products instead of test products
export const seedGeneProducts = async () => {
  try {
    console.log('🌱 Starting gene products seeding...');
    
    // Normalize and seed gene products from gene.json
    console.log('📦 Processing gene products from gene.json...');
    const normalizedProducts = RealProductNormalizer.normalizeProducts(realProductsData);
    console.log(`📦 Normalized ${normalizedProducts.length} gene products`);
    
    // Add products in batches to avoid Firebase limits
    const batchSize = 50;
    const productIds: string[] = [];
    
    for (let i = 0; i < normalizedProducts.length; i += batchSize) {
      const batch = normalizedProducts.slice(i, i + batchSize);
      console.log(`📦 Adding gene products batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(normalizedProducts.length/batchSize)}...`);
      
      const batchIds = await GeneProductService.addGeneProducts(
        batch.map(product => {
          const { id, ...productWithoutId } = product;
          return productWithoutId;
        })
      );
      productIds.push(...batchIds);
    }
    
    console.log(`✅ Added ${productIds.length} gene products`);
    
    // Seed courses (reuse existing)
    console.log('🎓 Seeding courses...');
    const courseIds = await CourseService.addCourses(coursesData);
    console.log(`✅ Added ${courseIds.length} courses`);
    
    // Seed customers
    console.log('👥 Seeding customers...');
    const normalizedCustomers = customersData
      .filter(customer => customer["Наименование"]) // Filter out invalid entries
      .map(customer => CustomerService.normalizeCustomer(customer));
    
    const customerIds = await CustomerService.addCustomers(normalizedCustomers);
    console.log(`✅ Added ${customerIds.length} customers`);
    
    console.log('🎉 Gene products database seeding completed successfully!');
    
    return {
      geneProducts: productIds.length,
      courses: courseIds.length,
      customers: customerIds.length
    };
    
  } catch (error) {
    console.error('❌ Error seeding gene products database:', error);
    throw error;
  }
};

// Function to check if database has real products
export const hasRealProducts = async (): Promise<boolean> => {
  try {
    const realProducts = await GeneProductService.getAllGeneProducts();
    return realProducts.length > 0;
  } catch (error) {
    console.error('Error checking real products:', error);
    return false;
  }
};

// Function to get database statistics including real products
export const getDatabaseStats = async () => {
  try {
    const [realProducts, courses, customers] = await Promise.all([
      GeneProductService.getAllGeneProducts(),
      CourseService.getAllCourses(),
      CustomerService.getAllCustomers()
    ]);

    // Get detailed real products stats
    const realProductStats = await GeneProductService.getGeneProductStats();
    
    return {
      realProducts: {
        total: realProducts.length,
        ...realProductStats
      },
      courses: courses.length,
      customers: customers.length,
      isEmpty: realProducts.length === 0 && courses.length === 0 && customers.length === 0
    };
    
  } catch (error) {
    console.error('Error getting database stats:', error);
    return {
      realProducts: { total: 0, inStock: 0, outOfStock: 0, byCategory: {}, averagePrice: { eur: 0, mdl: 0 } },
      courses: 0,
      customers: 0,
      isEmpty: true
    };
  }
};
