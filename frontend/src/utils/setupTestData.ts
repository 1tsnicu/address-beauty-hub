import { supabase } from '../lib/supabaseClient';

// Sample data for testing
const sampleProducts = {
  gene: [
    {
      name: 'Gene individuale 0.03mm C 10mm',
      sku: 'GEN001',
      sale_price: 25.50,
      discount: 10,
      store_stock: 15,
      total_stock: 25,
      image_url: null
    },
    {
      name: 'Gene volum 0.05mm D 12mm',
      sku: 'GEN002', 
      sale_price: 32.00,
      discount: 5,
      store_stock: 8,
      total_stock: 12,
      image_url: null
    }
  ],
  adezive: [
    {
      name: 'Adeziv rapid profesional 5ml',
      sku: 'ADZ001',
      sale_price: 45.00,
      discount: 15,
      store_stock: 20,
      total_stock: 30,
      image_url: null
    },
    {
      name: 'Adeziv sensibil pentru alergici 3ml', 
      sku: 'ADZ002',
      sale_price: 38.50,
      discount: 0,
      store_stock: 12,
      total_stock: 18,
      image_url: null
    }
  ],
  preparate: [
    {
      name: 'Primer degreasing pentru gene',
      sku: 'PREP001',
      sale_price: 28.00,
      discount: 20,
      store_stock: 25,
      total_stock: 35,
      image_url: null
    }
  ]
};

// Function to create admin user
export const createAdminUser = async () => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@test.com',
      password: 'admin123456',
      options: {
        data: {
          is_admin: true,
          role: 'admin'
        }
      }
    });
    
    if (error) {
      console.error('Error creating admin user:', error);
      return false;
    }
    
    console.log('Admin user created successfully:', data);
    return true;
  } catch (error) {
    console.error('Failed to create admin user:', error);
    return false;
  }
};

// Function to seed sample data
export const seedSampleData = async () => {
  try {
    for (const [tableName, products] of Object.entries(sampleProducts)) {
      console.log(`Adding sample data to ${tableName}...`);
      
      const { data, error } = await supabase
        .from(tableName)
        .insert(products);
        
      if (error) {
        console.error(`Error inserting data into ${tableName}:`, error);
      } else {
        console.log(`Successfully added ${products.length} products to ${tableName}`);
      }
    }
    
    console.log('Sample data seeding completed!');
    return true;
  } catch (error) {
    console.error('Failed to seed sample data:', error);
    return false;
  }
};

// Function to run all setup
export const setupTestData = async () => {
  console.log('Setting up test data...');
  
  await createAdminUser();
  await seedSampleData();
  
  console.log('Test data setup completed!');
};