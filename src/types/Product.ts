export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew: boolean;
  category: string;
  sales: number;
}