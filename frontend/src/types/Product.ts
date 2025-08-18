import { GeneGroup } from './GeneVariant';

export interface ProductVariant {
  id: number;
  sku?: string;
  size?: string;
  color?: string;
  length?: string; // For eyelashes length
  volume?: string; // For eyelash volume
  price?: number; // Override main product price
  stockQuantity?: number;
  inStock?: boolean;
  imageUrl?: string;
  [key: string]: string | number | boolean | undefined; // Additional attributes
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  image: string;
  images?: string[]; // Additional product images
  rating: number;
  reviews: number;
  inStock: boolean;
  stockQuantity?: number; // Added for Cloud Shop integration
  isNew: boolean;
  category: string; // Main category
  categories?: string[]; // Multiple categories
  subcategories?: string[]; // Subcategories
  sales: number;
  discount?: number; // Discount percentage
  cloudShopId?: string; // Added for Cloud Shop integration
  description?: string; // Detailed product description
  specifications?: Record<string, string>; // Technical specifications
  variants?: ProductVariant[]; // Product variants
  geneGroup?: GeneGroup; // For gene products - contains GeneGroup data
  attributes?: {
    color?: string;
    material?: string;
    type?: string;
    style?: string;
    isGeneGroup?: boolean; // Flag to identify gene products
    totalVariants?: number;
    availableVariants?: number;
    [key: string]: string | number | boolean | undefined;
  }; // For filtering
}