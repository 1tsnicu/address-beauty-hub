import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GeneVariantService } from '@/services/geneVariantService';
import { VariantChipGroup } from '@/components/VariantChips';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShoppingCart, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { 
  GeneGroup, 
  GeneVariant, 
  GeneVariantOptions, 
  VariantSelection,
  SelectedVariant 
} from '@/types/GeneVariant';

export const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Stări pentru datele produsului
  const [group, setGroup] = useState<GeneGroup | null>(null);
  const [variants, setVariants] = useState<GeneVariant[]>([]);
  const [options, setOptions] = useState<GeneVariantOptions>({
    curburi: [],
    grosimi: [],
    lungimi: [],
    culori: []
  });
  
  // Stări pentru selecție și UI
  const [selection, setSelection] = useState<VariantSelection>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  // Încărcare date inițiale
  useEffect(() => {
    if (!slug) {
      setError('Produs invalid');
      setLoading(false);
      return;
    }

    loadProductData(slug);
  }, [slug]);

  const loadProductData = async (productSlug: string) => {
    try {
      setLoading(true);
      setError(null);

      const [groupData, variantsData, optionsData] = await Promise.all([
        GeneVariantService.getProductGroup(productSlug),
        GeneVariantService.getProductVariants(productSlug),
        GeneVariantService.getVariantOptions(productSlug)
      ]);

      if (!groupData) {
        setError('Produsul nu a fost găsit');
        return;
      }

      setGroup(groupData);
      setVariants(variantsData);
      setOptions(optionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea produsului');
    } finally {
      setLoading(false);
    }
  };

  // Calculează opțiunile disponibile pe baza selecției curente
  const enabledOptions = useMemo(() => {
    const getEnabledValues = (attribute: keyof VariantSelection) => {
      return variants
        .filter(variant => {
          // Verifică dacă varianta se potrivește cu toate selecțiile făcute (except atributul curent)
          return Object.entries(selection).every(([key, value]) => {
            if (key === attribute || !value) return true;
            return variant[key as keyof GeneVariant] === value;
          });
        })
        .map(variant => variant[attribute])
        .filter((value): value is string => Boolean(value));
    };

    return {
      curburi: [...new Set(getEnabledValues('curbura'))].sort(),
      grosimi: [...new Set(getEnabledValues('grosime'))].sort(),
      lungimi: [...new Set(getEnabledValues('lungime'))].sort(),
      culori: [...new Set(getEnabledValues('culoare'))].sort()
    };
  }, [variants, selection]);

  // Găsește varianta exactă pe baza selecției complete
  const selectedVariant: SelectedVariant | null = useMemo(() => {
    const { curbura, grosime, lungime, culoare } = selection;
    
    const isComplete = Boolean(curbura && grosime && lungime && culoare);
    
    if (!isComplete) {
      return null;
    }

    const variant = variants.find(v => 
      v.curbura === curbura &&
      v.grosime === grosime &&
      v.lungime === lungime &&
      v.culoare === culoare
    );

    if (!variant) {
      return {
        isComplete: true,
        isAvailable: false,
      } as SelectedVariant;
    }

    return {
      ...variant,
      isComplete: true,
      isAvailable: (variant.store_stock || 0) > 0
    };
  }, [variants, selection]);

  // Handlers pentru selecția variantelor
  const handleSelectionChange = (attribute: keyof VariantSelection, value: string) => {
    setSelection(prev => ({
      ...prev,
      [attribute]: value || undefined
    }));
  };

  // Handler pentru adăugarea în coș
  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedVariant.isAvailable) {
      toast.error('Te rog selectează o variantă disponibilă');
      return;
    }

    setAddingToCart(true);
    try {
      // Aici adaugi logica pentru coș - trimite selectedVariant.id
      toast.success('Produsul a fost adăugat în coș');
      
      // Simulare API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      toast.error('Eroare la adăugarea în coș');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Se încarcă produsul...</p>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Produs nu a fost găsit</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/products')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi la produse
          </Button>
        </div>
      </div>
    );
  }

  const displayPrice = selectedVariant?.sale_price ?? group.from_price;
  const displayDiscount = selectedVariant?.discount;
  const displayStock = selectedVariant?.store_stock ?? group.total_stock;
  const displayImage = selectedVariant?.image_url ?? group.image_url;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/products')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Înapoi la produse
        </Button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Imaginea produsului */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            {displayImage ? (
              <img 
                src={displayImage} 
                alt={group.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Fără imagine
              </div>
            )}
          </div>
        </div>

        {/* Informații produs și selecție variante */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-2xl font-bold">
                {displayPrice ? `${displayPrice} MDL` : 'Preț la cerere'}
              </div>
              {displayDiscount && displayDiscount > 0 && (
                <Badge variant="destructive">-{displayDiscount}%</Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Stoc: {displayStock > 0 ? `${displayStock} bucăți` : 'Indisponibil'}
            </div>
          </div>

          {/* Selecția variantelor */}
          <Card>
            <CardHeader>
              <CardTitle>Selectează varianta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <VariantChipGroup
                title="Curbură"
                values={options.curburi}
                selectedValue={selection.curbura}
                enabledValues={enabledOptions.curburi}
                onValueChange={(value) => handleSelectionChange('curbura', value)}
              />

              <VariantChipGroup
                title="Grosime"
                values={options.grosimi}
                selectedValue={selection.grosime}
                enabledValues={enabledOptions.grosimi}
                onValueChange={(value) => handleSelectionChange('grosime', value)}
              />

              <VariantChipGroup
                title="Lungime"
                values={options.lungimi}
                selectedValue={selection.lungime}
                enabledValues={enabledOptions.lungimi}
                onValueChange={(value) => handleSelectionChange('lungime', value)}
              />

              <VariantChipGroup
                title="Culoare"
                values={options.culori}
                selectedValue={selection.culoare}
                enabledValues={enabledOptions.culori}
                onValueChange={(value) => handleSelectionChange('culoare', value)}
              />
            </CardContent>
          </Card>

          {/* Status selecție și buton adăugare în coș */}
          <div className="space-y-4">
            {selectedVariant?.isComplete && !selectedVariant.isAvailable && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                Combinația selectată nu este disponibilă în stoc
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!selectedVariant?.isComplete || !selectedVariant.isAvailable || addingToCart}
            >
              {addingToCart ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Se adaugă...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {selectedVariant?.isComplete 
                    ? (selectedVariant.isAvailable ? 'Adaugă în coș' : 'Indisponibil')
                    : 'Selectează toate opțiunile'
                  }
                </>
              )}
            </Button>
          </div>

          {/* Informații suplimentare */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Total {group.variant_count} variante disponibile</p>
            <p>• Livrare gratuită pentru comenzi peste 500 MDL</p>
            <p>• Garanție de calitate 100%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
