// Types for real beauty products from gene.json
export interface RealProduct {
  "Наименование": string;  // Product name in Russian
  "Код": string;           // Product code
  "Цена продажи": number;  // Sale price
  "Скидка": number;        // Discount
  "Высота": number;        // Height
  "Ширина": number;        // Width  
  "Глубина": number;       // Depth
  "Фактический вес": number; // Actual weight
  "Магазин (Остаток)": number; // Store stock
  "Общий остаток": number;     // Total stock
}

// Normalized product for our application
export interface NormalizedRealProduct {
  id?: string;
  name: string;              // Romanian name
  nameRu: string;           // Russian name (original)
  code: string;             // Product code
  price: {
    eur: number;            // Price in EUR
    mdl: number;            // Price in MDL
  };
  originalPrice: number;    // Original price from JSON
  discount: number;         // Discount percentage
  inStock: boolean;         // Is in stock
  stockQuantity: number;    // Stock quantity
  category: string;         // Product category
  subcategory?: string;     // Subcategory (optional)
  image: string;           // Product image URL
  description: string;      // Romanian description
  descriptionRu: string;    // Russian description
  specifications: {
    thickness?: string;     // For lashes (0.07, 0.10, etc.)
    curl?: string;         // Curl type (C, D, etc.)
    length?: string;       // Length range
    color?: string;        // Color if applicable
    type?: string;         // Product type
  };
  dimensions: {           // Remove optional to ensure all fields exist
    height: number;
    width: number;
    depth: number;
    weight: number;
  };
  featured: boolean;       // Is featured product
  tags: string[];         // Product tags
  createdAt: Date;
  updatedAt: Date;
}

// Product category mapping
export const PRODUCT_CATEGORIES = {
  LASHES: 'Gene',
  LASH_ACCESSORIES: 'Accesorii Gene',
  BROW_PRODUCTS: 'Produse Sprâncene',
  TOOLS: 'Instrumente',
  ADHESIVES: 'Adezivi',
  REMOVERS: 'Removere',
  CARE: 'Îngrijire',
  OTHER: 'Altele'
} as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[keyof typeof PRODUCT_CATEGORIES];
