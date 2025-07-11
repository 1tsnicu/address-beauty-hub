import { Product } from '@/types/Product';

export const products: Product[] = [
  {
    id: 1,
    name: 'Gene false 3D Volume Negre',
    price: 45.99,
    originalPrice: 59.99,
    image: '/placeholder.svg',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    isNew: true,
    category: 'lashes',
    subcategories: ['lashes-black'],
    sales: 300,
    description: 'Gene false voluminoase 3D de culoare neagră pentru un look dramatic și expresiv.',
    attributes: {
      color: 'black',
      style: '3D',
    },
    variants: [
      { id: 101, size: 'S', length: '8mm', price: 45.99, stockQuantity: 25, inStock: true },
      { id: 102, size: 'M', length: '10mm', price: 45.99, stockQuantity: 30, inStock: true },
      { id: 103, size: 'L', length: '12mm', price: 47.99, stockQuantity: 20, inStock: true },
      { id: 104, size: 'XL', length: '14mm', price: 49.99, stockQuantity: 15, inStock: true },
    ]
  },
  {
    id: 2,
    name: 'Kit Sprâncene Professional Complet',
    price: 89.99,
    originalPrice: null,
    image: '/placeholder.svg',
    rating: 4.9,
    reviews: 98,
    inStock: true,
    isNew: false,
    category: 'brows',
    subcategories: ['brows-kits'],
    sales: 250,
    description: 'Kit complet pentru sprâncene cu tot ce ai nevoie pentru un look perfect.',
    attributes: {
      type: 'kit',
    }
  },
  {
    id: 3,
    name: 'Gel de Laminare Premium',
    price: 159.99,
    originalPrice: 189.99,
    image: '/placeholder.svg',
    rating: 4.7,
    reviews: 76,
    inStock: true,
    isNew: false,
    category: 'lamination',
    sales: 120,
    description: 'Gel premium pentru laminarea genelor și sprâncenelor cu efect de lungă durată.'
  },
  {
    id: 4,
    name: 'Serum pentru creșterea genelor',
    price: 129.99,
    originalPrice: null,
    image: '/placeholder.svg',
    rating: 4.6,
    reviews: 45,
    inStock: true,
    isNew: true,
    category: 'cosmetics',
    sales: 80,
    description: 'Serum inovator care stimulează creșterea genelor pentru un look natural și expresiv.'
  },
  {
    id: 5,
    name: 'Gene false Naturale Cafenii',
    price: 29.99,
    originalPrice: 39.99,
    image: '/placeholder.svg',
    rating: 4.5,
    reviews: 203,
    inStock: true,
    isNew: false,
    category: 'lashes',
    subcategories: ['lashes-brown'],
    sales: 400,
    description: 'Gene false cafenii pentru un look natural și subtil.',
    attributes: {
      color: 'brown',
      style: 'natural'
    },
    variants: [
      { id: 201, size: 'S', length: '8mm', price: 29.99, stockQuantity: 35, inStock: true },
      { id: 202, size: 'M', length: '10mm', price: 29.99, stockQuantity: 40, inStock: true },
      { id: 203, size: 'L', length: '12mm', price: 31.99, stockQuantity: 25, inStock: true },
    ]
  },
  {
    id: 6,
    name: 'Kit Laminare Sprâncene Complet',
    price: 299.99,
    originalPrice: 399.99,
    image: '/placeholder.svg',
    rating: 4.9,
    reviews: 89,
    inStock: true,
    isNew: false,
    category: 'lamination',
    sales: 150,
    description: 'Kit complet pentru laminarea sprâncenelor cu toate instrumentele și produsele necesare.'
  },
  {
    id: 7,
    name: 'Cremă hidratantă pentru față',
    price: 75.99,
    originalPrice: null,
    image: '/placeholder.svg',
    rating: 4.8,
    reviews: 156,
    inStock: true,
    isNew: true,
    category: 'cosmetics',
    sales: 220,
    description: 'Cremă hidratantă pentru toate tipurile de piele, cu ingrediente naturale și efect de lungă durată.'
  },
  {
    id: 8,
    name: 'Gel pentru sprâncene',
    price: 35.99,
    originalPrice: 45.99,
    image: '/placeholder.svg',
    rating: 4.6,
    reviews: 87,
    inStock: true,
    isNew: false,
    category: 'brows',
    subcategories: ['brows-gels'],
    sales: 180,
    description: 'Gel pentru fixarea și colorarea sprâncenelor, cu efect natural și de lungă durată.',
    attributes: {
      type: 'gel'
    }
  }
];