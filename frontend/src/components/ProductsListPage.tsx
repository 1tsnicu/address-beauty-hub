import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GeneVariantService } from '@/services/geneVariantService';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye } from 'lucide-react';
import type { GeneGroup } from '@/types/GeneVariant';

export const ProductsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<GeneGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GeneVariantService.getProductGroups();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea produselor');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Se încarcă produsele...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Eroare</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={loadProducts} variant="outline">
            Încearcă din nou
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gene False</h1>
        <p className="text-muted-foreground">
          Descoperă colecția noastră de gene false de înaltă calitate cu multiple variante
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nu au fost găsite produse</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              onViewProduct={() => navigate(`/product/${product.slug}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ProductCardProps {
  product: GeneGroup;
  onViewProduct: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewProduct }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <div onClick={onViewProduct}>
        <CardContent className="p-0">
          <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Fără imagine
              </div>
            )}
          </div>
          
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-xl font-bold">
                  {product.from_price ? (
                    <>de la {product.from_price} MDL</>
                  ) : (
                    'Preț la cerere'
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Stoc: {product.total_stock} bucăți
                </div>
              </div>
              
              <Badge variant="secondary">
                {product.variant_count} variante
              </Badge>
            </div>
          </div>
        </CardContent>
      </div>
      
      <CardFooter className="pt-0 pb-4 px-4">
        <Button 
          className="w-full"
          onClick={onViewProduct}
          variant="outline"
        >
          <Eye className="h-4 w-4 mr-2" />
          Vezi opțiuni
        </Button>
      </CardFooter>
    </Card>
  );
};
