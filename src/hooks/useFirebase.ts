import { useState, useEffect } from 'react';
import { ProductService, CourseService, CustomerService, Course } from '@/lib/firebaseService';
import { Product } from '@/types/Product';
import { NormalizedCustomer } from '@/types/Customer';

// Hook for managing products from Firebase (OLD - for DatabaseSetupPage only)
export const useFirebaseProductsOld = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await ProductService.getAllProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const productId = await ProductService.addProduct(product);
      await fetchProducts(); // Refresh the list
      return productId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
      throw err;
    }
  };

  const getProductsByCategory = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const categoryProducts = await ProductService.getProductsByCategory(category);
      return categoryProducts;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products by category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    getProductsByCategory
  };
};

// Hook for managing courses from Firebase
export const useFirebaseCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCourses = await CourseService.getAllCourses();
      setCourses(fetchedCourses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const addCourse = async (course: Omit<Course, 'id'>) => {
    try {
      const courseId = await CourseService.addCourse(course);
      await fetchCourses(); // Refresh the list
      return courseId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add course');
      throw err;
    }
  };

  return {
    courses,
    loading,
    error,
    fetchCourses,
    addCourse
  };
};

// Hook for managing customers from Firebase
export const useFirebaseCustomers = () => {
  const [customers, setCustomers] = useState<NormalizedCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCustomers = await CustomerService.getAllCustomers();
      setCustomers(fetchedCustomers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const addCustomer = async (customer: Omit<NormalizedCustomer, 'id'>) => {
    try {
      const customerId = await CustomerService.addCustomer(customer);
      await fetchCustomers(); // Refresh the list
      return customerId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add customer');
      throw err;
    }
  };

  const updateCustomer = async (id: string, updates: Partial<NormalizedCustomer>) => {
    try {
      await CustomerService.updateCustomer(id, updates);
      await fetchCustomers(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update customer');
      throw err;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await CustomerService.deleteCustomer(id);
      await fetchCustomers(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer');
      throw err;
    }
  };

  const searchCustomers = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);
      const results = await CustomerService.searchCustomers(searchTerm);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search customers');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers
  };
};
