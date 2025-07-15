import React, { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Package, 
  Eye,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useCategories } from '@/contexts/CategoriesContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Product } from '@/types/Product';
import { ProductService } from '@/lib/firebaseService';
import { toast } from 'sonner';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  image: string;
  category: string;
  subcategories: string[];
  inStock: boolean;
  isNew: boolean;
  sales: number;
  discount?: number;
  rating: number;
  reviews: number;
  attributes?: {
    [key: string]: any;
  };
}

const ProductManagement: React.FC = () => {
  const { products, isLoading, error, refreshProducts } = useProducts();
  const { categories } = useCategories();
  const { currency } = useCurrency();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    originalPrice: null,
    image: '',
    category: '',
    subcategories: [],
    inStock: true,
    isNew: false,
    sales: 0,
    discount: 0,
    rating: 0,
    reviews: 0,
    attributes: {}
  });

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           product.category === selectedCategory ||
                           (product.subcategories && product.subcategories.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = async () => {
    try {
      // Create the product object with proper ID generation
      const newProduct: Omit<Product, 'id'> = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        originalPrice: formData.originalPrice,
        image: formData.image,
        category: formData.category,
        subcategories: formData.subcategories,
        inStock: formData.inStock,
        isNew: formData.isNew,
        sales: formData.sales,
        discount: formData.discount,
        rating: formData.rating,
        reviews: formData.reviews,
        attributes: formData.attributes
      };

      await ProductService.addProduct(newProduct);
      toast.success('Produsul a fost adăugat cu succes!');
      setShowAddDialog(false);
      resetForm();
      refreshProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Eroare la adăugarea produsului');
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;
    
    try {
      const updates: Partial<Product> = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        originalPrice: formData.originalPrice,
        image: formData.image,
        category: formData.category,
        subcategories: formData.subcategories,
        inStock: formData.inStock,
        isNew: formData.isNew,
        sales: formData.sales,
        discount: formData.discount,
        rating: formData.rating,
        reviews: formData.reviews,
        attributes: formData.attributes
      };

      await ProductService.updateProduct(editingProduct.id.toString(), updates);
      toast.success('Produsul a fost actualizat cu succes!');
      setShowEditDialog(false);
      setEditingProduct(null);
      resetForm();
      refreshProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Eroare la actualizarea produsului');
    }
  };

  const handleDeleteProduct = async (productId: string | number) => {
    try {
      await ProductService.deleteProduct(productId.toString());
      toast.success('Produsul a fost șters cu succes!');
      refreshProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Eroare la ștergerea produsului');
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      subcategories: product.subcategories || [],
      inStock: product.inStock,
      isNew: product.isNew || false,
      sales: product.sales,
      discount: product.discount || 0,
      rating: product.rating,
      reviews: product.reviews,
      attributes: product.attributes || {}
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      originalPrice: null,
      image: '',
      category: '',
      subcategories: [],
      inStock: true,
      isNew: false,
      sales: 0,
      discount: 0,
      rating: 0,
      reviews: 0,
      attributes: {}
    });
  };

  // Get statistics
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const newProducts = products.filter(p => p.isNew).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Gestionare Produse</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-muted rounded-lg h-24"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse bg-muted rounded-lg h-80"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <p className="text-destructive text-lg mb-4">{error}</p>
        <Button onClick={refreshProducts} variant="outline">
          Încearcă din nou
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestionare Produse</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Adaugă Produs
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adaugă Produs Nou</DialogTitle>
              <DialogDescription>
                Completează informațiile pentru a adăuga un produs nou în magazin.
              </DialogDescription>
            </DialogHeader>
            
            <ProductForm 
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              onSave={handleAddProduct}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produse</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              produse în sistem
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">În Stoc</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{inStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              {((inStockProducts / totalProducts) * 100).toFixed(1)}% din total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stoc Epuizat</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              necesită reaprovizionare
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produse Noi</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{newProducts}</div>
            <p className="text-xs text-muted-foreground">
              marcate ca noi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Caută produse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Toate categoriile" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate categoriile</SelectItem>
            {categories.filter(cat => cat.active).map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground text-lg">Nu au fost găsite produse</p>
          <p className="text-sm text-muted-foreground mt-2">
            Încearcă să modifici criteriile de căutare sau adaugă un produs nou
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              onEdit={() => openEditDialog(product)}
              onDelete={() => handleDeleteProduct(product.id)}
            />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editează Produs</DialogTitle>
            <DialogDescription>
              Modifică informațiile produsului selectat.
            </DialogDescription>
          </DialogHeader>
          
          <ProductForm 
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            onSave={handleEditProduct}
            onCancel={() => {
              setShowEditDialog(false);
              setEditingProduct(null);
              resetForm();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Product Card Component for Admin View
interface ProductCardProps {
  product: Product;
  currency: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, currency, onEdit, onDelete }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-2 right-2 flex gap-1">
          {product.isNew && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Nou
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="destructive">
              Stoc epuizat
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Preț:</span>
            <span className="font-semibold">
              {product.price.toFixed(2)} {currency}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Vânzări:</span>
            <span className="text-sm">{product.sales}</span>
          </div>
          
          {product.discount && product.discount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Reducere:</span>
              <Badge variant="outline" className="text-green-600">
                -{product.discount}%
              </Badge>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
            <Edit3 className="w-4 h-4 mr-1" />
            Editează
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
                <AlertDialogDescription>
                  Ești sigur că vrei să ștergi produsul "{product.name}"? 
                  Această acțiune nu poate fi anulată.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anulează</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Șterge
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

// Product Form Component
interface ProductFormProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  categories: any[];
  onSave: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  formData,
  setFormData,
  categories,
  onSave,
  onCancel
}) => {
  const mainCategories = categories.filter(cat => !cat.parentId && cat.active);
  const subcategories = categories.filter(cat => cat.parentId && cat.active);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nume Produs*</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Introduceți numele produsului"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Preț*</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="originalPrice">Preț Original</Label>
          <Input
            id="originalPrice"
            type="number"
            step="0.01"
            value={formData.originalPrice || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              originalPrice: e.target.value ? parseFloat(e.target.value) : null 
            }))}
            placeholder="Preț înainte de reducere"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="discount">Reducere (%)</Label>
          <Input
            id="discount"
            type="number"
            min="0"
            max="100"
            value={formData.discount}
            onChange={(e) => setFormData(prev => ({ ...prev, discount: parseInt(e.target.value) || 0 }))}
            placeholder="0"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descriere</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Descrierea produsului"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image">URL Imagine</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Categorie Principală*</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selectează categoria" />
            </SelectTrigger>
            <SelectContent>
              {mainCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sales">Numărul de vânzări</Label>
          <Input
            id="sales"
            type="number"
            value={formData.sales}
            onChange={(e) => setFormData(prev => ({ ...prev, sales: parseInt(e.target.value) || 0 }))}
            placeholder="0"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
            placeholder="0"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reviews">Numărul de recenzii</Label>
          <Input
            id="reviews"
            type="number"
            value={formData.reviews}
            onChange={(e) => setFormData(prev => ({ ...prev, reviews: parseInt(e.target.value) || 0 }))}
            placeholder="0"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="inStock"
            checked={formData.inStock}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, inStock: checked }))}
          />
          <Label htmlFor="inStock">În stoc</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="isNew"
            checked={formData.isNew}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isNew: checked }))}
          />
          <Label htmlFor="isNew">Produs nou</Label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Anulează
        </Button>
        <Button onClick={onSave} disabled={!formData.name || !formData.category || formData.price <= 0}>
          Salvează
        </Button>
      </div>
    </div>
  );
};

export default ProductManagement;
