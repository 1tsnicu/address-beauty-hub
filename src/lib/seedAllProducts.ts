import { RealProductService } from './RealProductService';
import { 
  GeneProductService,
  AdeziveProductService,
  AccesoriiProductService,
  ConsumabileProductService,
  LaminareProductService,
  OkoProductService,
  PreparateProductService,
  UstensileProductService,
  IngrijirePersonalaProductService,
  COLLECTIONS
} from './categoryProductServices';
import { CustomerService, CourseService } from './firebaseService';
import { NormalizedCustomer } from '@/types/Customer';

// Import all product data files
import accesoriiData from '@/data/accesorii.json';
import adeziveData from '@/data/adezive.json';
import consumabileData from '@/data/consumabile.json';
import geneData from '@/data/gene.json';
import ingrijirePersonalaData from '@/data/ingrijire-personala.json';
import laminareData from '@/data/laminare.json';
import okoData from '@/data/oko.json';
import preparateData from '@/data/preparate.json';
import ustensileData from '@/data/ustensile.json';

// Import customers data
import customersData from '@/data/clienti.json';

// Import courses data
import { coursesData } from './seedData';

// Product categories mapping
export const PRODUCT_CATEGORIES = {
  ACCESORII: 'accesorii',
  ADEZIVE: 'adezive', 
  CONSUMABILE: 'consumabile',
  GENE: 'gene',
  INGRIJIRE_PERSONALA: 'ingrijire-personala',
  LAMINARE: 'laminare',
  OKO: 'oko',
  PREPARATE: 'preparate',
  USTENSILE: 'ustensile'
} as const;

// Data mapping with categories and their corresponding services
const PRODUCT_DATA_MAP = [
  { 
    data: accesoriiData, 
    category: PRODUCT_CATEGORIES.ACCESORII, 
    name: 'Accesorii',
    service: AccesoriiProductService,
    addMethod: 'addAccesoriiProducts'
  },
  { 
    data: adeziveData, 
    category: PRODUCT_CATEGORIES.ADEZIVE, 
    name: 'Adezive',
    service: AdeziveProductService,
    addMethod: 'addAdeziveProducts'
  },
  { 
    data: consumabileData, 
    category: PRODUCT_CATEGORIES.CONSUMABILE, 
    name: 'Consumabile',
    service: ConsumabileProductService,
    addMethod: 'addConsumabileProducts'
  },
  { 
    data: geneData, 
    category: PRODUCT_CATEGORIES.GENE, 
    name: 'Gene',
    service: GeneProductService,
    addMethod: 'addGeneProducts'
  },
  { 
    data: ingrijirePersonalaData, 
    category: PRODUCT_CATEGORIES.INGRIJIRE_PERSONALA, 
    name: 'Îngrijire Personală',
    service: IngrijirePersonalaProductService,
    addMethod: 'addIngrijirePersonalaProducts'
  },
  { 
    data: laminareData, 
    category: PRODUCT_CATEGORIES.LAMINARE, 
    name: 'Laminare',
    service: LaminareProductService,
    addMethod: 'addLaminareProducts'
  },
  { 
    data: okoData, 
    category: PRODUCT_CATEGORIES.OKO, 
    name: 'Oko',
    service: OkoProductService,
    addMethod: 'addOkoProducts'
  },
  { 
    data: preparateData, 
    category: PRODUCT_CATEGORIES.PREPARATE, 
    name: 'Preparate',
    service: PreparateProductService,
    addMethod: 'addPreparateProducts'
  },
  { 
    data: ustensileData, 
    category: PRODUCT_CATEGORIES.USTENSILE, 
    name: 'Ustensile',
    service: UstensileProductService,
    addMethod: 'addUstensileProducts'
  }
];

// Enhanced normalizer that includes category information
class AllProductsNormalizer {
  static normalizeProductsWithCategory(rawProducts: any[], category: string, categoryName: string) {
    const normalizedProducts = RealProductService.normalizeProducts(rawProducts);
    
    return normalizedProducts.map(product => ({
      ...product,
      category: category,
      categoryName: categoryName,
      subcategory: this.determineSubcategory(product.name, category)
    }));
  }

  static determineSubcategory(productName: string, category: string): string {
    const name = productName.toLowerCase();
    
    switch (category) {
      case PRODUCT_CATEGORIES.GENE:
        if (name.includes('volum') || name.includes('volume')) return 'Volume';
        if (name.includes('clasic') || name.includes('classic')) return 'Classic';
        if (name.includes('mega volum') || name.includes('mega volume')) return 'Mega Volume';
        return 'Standard';
        
      case PRODUCT_CATEGORIES.ADEZIVE:
        if (name.includes('rapid') || name.includes('fast')) return 'Rapid';
        if (name.includes('sensibil') || name.includes('sensitive')) return 'Sensitive';
        if (name.includes('rezistent') || name.includes('strong')) return 'Strong';
        return 'Standard';
        
      case PRODUCT_CATEGORIES.ACCESORII:
        if (name.includes('penseta') || name.includes('tweezer')) return 'Pensete';
        if (name.includes('husa') || name.includes('case')) return 'Huse';
        if (name.includes('lampa') || name.includes('lamp')) return 'Lămpi';
        return 'Diverse';
        
      case PRODUCT_CATEGORIES.CONSUMABILE:
        if (name.includes('pad') || name.includes('placa')) return 'Pad-uri';
        if (name.includes('band') || name.includes('banda')) return 'Benzi';
        if (name.includes('brush') || name.includes('perie')) return 'Perii';
        return 'Diverse';
        
      case PRODUCT_CATEGORIES.USTENSILE:
        if (name.includes('penseta') || name.includes('tweezer')) return 'Pensete';
        if (name.includes('foarfeca') || name.includes('scissors')) return 'Foarfeci';
        if (name.includes('oglinda') || name.includes('mirror')) return 'Oglinzi';
        return 'Diverse';
        
      default:
        return 'Standard';
    }
  }
}

// Function to seed all products from data folder
export const seedAllProducts = async () => {
  try {
    console.log('🌱 Starting complete product database seeding...');
    
    const allResults: { [key: string]: number } = {};
    let totalProducts = 0;
    
    // Process each product category
    for (const categoryMapping of PRODUCT_DATA_MAP) {
      console.log(`📦 Processing ${categoryMapping.name} (${categoryMapping.category})...`);
      
      // Normalize products with category information
      const normalizedProducts = AllProductsNormalizer.normalizeProductsWithCategory(
        categoryMapping.data, 
        categoryMapping.category, 
        categoryMapping.name
      );
      
      console.log(`📦 Normalized ${normalizedProducts.length} ${categoryMapping.name.toLowerCase()} products`);
      
      // Add products in batches to avoid Firebase limits
      const batchSize = 50;
      const productIds: string[] = [];
      
      for (let i = 0; i < normalizedProducts.length; i += batchSize) {
        const batch = normalizedProducts.slice(i, i + batchSize);
        console.log(`📦 Adding ${categoryMapping.name} batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(normalizedProducts.length/batchSize)}...`);
        
        // Use the static service method for this category
        const batchIds = await (categoryMapping.service as any)[categoryMapping.addMethod](
          batch.map(product => {
            const { id, ...productWithoutId } = product;
            return productWithoutId;
          })
        );
        productIds.push(...batchIds);
      }
      
      allResults[categoryMapping.category] = productIds.length;
      totalProducts += productIds.length;
      console.log(`✅ Added ${productIds.length} ${categoryMapping.name.toLowerCase()} products`);
    }
    
    // Seed courses
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
    
    console.log('🎉 Complete product database seeding completed successfully!');
    console.log(`📊 Summary: ${totalProducts} total products across ${Object.keys(allResults).length} categories, ${courseIds.length} courses, ${customerIds.length} customers`);
    
    return {
      totalProducts,
      courses: courseIds.length,
      customers: customerIds.length,
      categories: allResults,
      details: PRODUCT_DATA_MAP.map(({ category, name }) => ({
        category,
        name,
        count: allResults[category]
      }))
    };
    
  } catch (error) {
    console.error('❌ Error seeding complete product database:', error);
    throw error;
  }
};

// Function to get statistics about all products across separate collections
export const getAllProductsStats = async () => {
  try {
    const stats = {
      total: 0,
      categories: {} as { [key: string]: number },
      inStock: 0,
      outOfStock: 0,
      totalValue: { mdl: 0, eur: 0 },
      courses: 0,
      customers: 0
    };

    // Define static methods for each service
    const serviceQueries = [
      { service: GeneProductService, method: 'getAllGeneProducts', category: PRODUCT_CATEGORIES.GENE },
      { service: AdeziveProductService, method: 'getAllAdeziveProducts', category: PRODUCT_CATEGORIES.ADEZIVE },
      { service: AccesoriiProductService, method: 'getAllAccesoriiProducts', category: PRODUCT_CATEGORIES.ACCESORII },
      { service: ConsumabileProductService, method: 'getAllConsumabileProducts', category: PRODUCT_CATEGORIES.CONSUMABILE },
      { service: LaminareProductService, method: 'getAllLaminareProducts', category: PRODUCT_CATEGORIES.LAMINARE },
      { service: OkoProductService, method: 'getAllOkoProducts', category: PRODUCT_CATEGORIES.OKO },
      { service: PreparateProductService, method: 'getAllPreparateProducts', category: PRODUCT_CATEGORIES.PREPARATE },
      { service: UstensileProductService, method: 'getAllUstensileProducts', category: PRODUCT_CATEGORIES.USTENSILE },
      { service: IngrijirePersonalaProductService, method: 'getAllIngrijirePersonalaProducts', category: PRODUCT_CATEGORIES.INGRIJIRE_PERSONALA }
    ];

    // Get products from each category collection
    for (const { service, method, category } of serviceQueries) {
      try {
        const products = await (service as any)[method]();
        
        const categoryCount = products.length;
        stats.categories[category] = categoryCount;
        stats.total += categoryCount;

        // Count stock status and calculate values
        products.forEach(product => {
          if (product.inStock) {
            stats.inStock++;
          } else {
            stats.outOfStock++;
          }
          
          if (product.price?.mdl) {
            stats.totalValue.mdl += product.price.mdl;
          }
          if (product.price?.eur) {
            stats.totalValue.eur += product.price.eur;
          }
        });
        
      } catch (error) {
        console.warn(`Warning: Could not get stats for ${category}:`, error);
        stats.categories[category] = 0;
      }
    }
    
    // Get courses and customers stats
    try {
      const courses = await CourseService.getAllCourses();
      stats.courses = courses.length;
    } catch (error) {
      console.warn('Warning: Could not get courses stats:', error);
      stats.courses = 0;
    }
    
    try {
      const customers = await CustomerService.getAllCustomers();
      stats.customers = customers.length;
    } catch (error) {
      console.warn('Warning: Could not get customers stats:', error);
      stats.customers = 0;
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting all products stats:', error);
    throw error;
  }
};

// Function to check if we have products for all categories
export const hasAllProductCategories = async () => {
  try {
    const stats = await getAllProductsStats();
    const expectedCategories = Object.values(PRODUCT_CATEGORIES);
    const existingCategories = Object.keys(stats.categories);
    
    return {
      hasAll: expectedCategories.every(cat => existingCategories.includes(cat)),
      missing: expectedCategories.filter(cat => !existingCategories.includes(cat)),
      existing: existingCategories,
      expected: expectedCategories
    };
  } catch (error) {
    console.error('Error checking product categories:', error);
    return { hasAll: false, missing: [], existing: [], expected: [] };
  }
};
