// Mock products for testing and fallback purposes
export const products = [
  {
    id: 1,
    name: "Test Product 1",
    description: "Produs de test pentru demonstrație",
    price: 100,
    originalPrice: 120,
    image: "/placeholder.svg",
    rating: 4.5,
    reviews: 23,
    category: "test",
    inStock: true,
    isNew: true,
    sales: 45,
    specifications: {
      material: "Test material",
      length: "Test length"
    }
  },
  {
    id: 2, 
    name: "Test Product 2",
    description: "Al doilea produs de test",
    price: 150,
    originalPrice: null,
    image: "/placeholder.svg",
    rating: 4.0,
    reviews: 12,
    category: "test",
    inStock: false,
    isNew: false,
    sales: 23,
    specifications: {
      material: "Test material 2",
      length: "Test length 2"
    }
  }
];

export default products;
