import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import type { AdminProductRow } from './AdminProductsTable';

interface ProductEditDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  row: AdminProductRow | null;
  onSaved?: () => void;
}

const ProductEditDialog: React.FC<ProductEditDialogProps> = ({ open, onOpenChange, row, onSaved }) => {
  const [form, setForm] = useState({
    name: '',
    descriere: '',
    sale_price: '',
    discount: '',
    store_stock: '',
    total_stock: '',
    image_url: '',
    // Câmpuri specifice pentru tabelul gene
    curbura: '',
    grosime: '',
    lungime: '',
    culoare: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (row) {
      setForm({
        name: row.name || '',
        descriere: (row.descriere ?? '') as string,
        sale_price: row.sale_price != null ? String(row.sale_price) : '',
        discount: row.discount != null ? String(row.discount) : '',
        store_stock: row.store_stock != null ? String(row.store_stock) : '',
        total_stock: row.total_stock != null ? String(row.total_stock) : '',
        image_url: (row.image_url ?? '') as string,
        // Câmpuri specifice pentru tabelul gene
        curbura: (row.curbura ?? '') as string,
        grosime: (row.grosime ?? '') as string,
        lungime: (row.lungime ?? '') as string,
        culoare: (row.culoare ?? '') as string,
      });
    }
  }, [row]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!row) return;
    setSaving(true);
    try {
      // Construim payload numeric pentru câmpurile numerice
      const payload: Record<string, unknown> = {
        name: form.name,
        descriere: form.descriere || null,
        sale_price: form.sale_price !== '' ? Number(form.sale_price) : null,
        discount: form.discount !== '' ? Number(form.discount) : null,
        store_stock: form.store_stock !== '' ? Number(form.store_stock) : null,
        total_stock: form.total_stock !== '' ? Number(form.total_stock) : null,
        image_url: form.image_url || null,
      };

      // Adăugăm câmpurile specifice pentru tabelul gene
      if (row.table === 'gene') {
        payload.curbura = form.curbura || null;
        payload.grosime = form.grosime || null;
        payload.lungime = form.lungime || null;
        payload.culoare = form.culoare || null;
      }

      const { error } = await supabase
        .from(row.table)
        .update(payload)
        .eq('id', row.id)
        .select();

      if (error) throw new Error(error.message);
      toast.success('Produsul a fost actualizat');
      onSaved?.();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Eroare la actualizare');
    } finally {
      setSaving(false);
    }
  };

  // Convert image to base64 and store directly in database
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !row) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Te rog selectează un fișier imagine valid');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imaginea este prea mare. Mărimea maximă permisă este 5MB');
      return;
    }
    
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setForm((p) => ({ ...p, image_url: base64String }));
        toast.success('Imagine încărcată cu succes');
      };
      reader.onerror = () => {
        toast.error('Eroare la citirea fișierului');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Eroare la încărcarea imaginii');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] 2xl:w-[70vw] max-w-[1800px] max-h-[95vh] flex flex-col mx-auto">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl">Editare produs</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Modifică câmpurile și salvează. Imaginea poate fi încărcată mai jos.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nume</Label>
            <Input 
              id="name" 
              value={form.name} 
              onChange={(e) => handleChange('name', e.target.value)} 
              required 
              className="text-sm sm:text-base md:text-lg py-2 sm:py-3"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descriere">Descriere</Label>
            <textarea 
              id="descriere" 
              value={form.descriere} 
              onChange={(e) => handleChange('descriere', e.target.value)}
              className="w-full min-h-[80px] sm:min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical text-sm sm:text-base"
              placeholder="Introduceți descrierea produsului..."
            />
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5">
            <div className="space-y-2">
              <Label htmlFor="sale_price" className="text-xs sm:text-sm">Preț (MDL)</Label>
              <Input id="sale_price" type="number" step="0.01" value={form.sale_price} onChange={(e) => handleChange('sale_price', e.target.value)} className="py-2 sm:py-3 text-sm sm:text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount" className="text-xs sm:text-sm">Discount (%)</Label>
              <Input id="discount" type="number" step="1" value={form.discount} onChange={(e) => handleChange('discount', e.target.value)} className="py-2 sm:py-3 text-sm sm:text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store_stock" className="text-xs sm:text-sm">Stoc magazin</Label>
              <Input id="store_stock" type="number" step="1" value={form.store_stock} onChange={(e) => handleChange('store_stock', e.target.value)} className="py-2 sm:py-3 text-sm sm:text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_stock" className="text-xs sm:text-sm">Stoc total</Label>
              <Input id="total_stock" type="number" step="1" value={form.total_stock} onChange={(e) => handleChange('total_stock', e.target.value)} className="py-2 sm:py-3 text-sm sm:text-base" />
            </div>
          </div>

          {/* Câmpuri specifice pentru tabelul gene */}
          {row?.table === 'gene' && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium border-b pb-2">Proprietăți specifice gene</h3>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5">
                <div className="space-y-2">
                  <Label htmlFor="curbura" className="text-xs sm:text-sm">Curbură</Label>
                  <Input id="curbura" value={form.curbura} onChange={(e) => handleChange('curbura', e.target.value)} placeholder="ex: C, CC, D, L" className="py-2 sm:py-3 text-sm sm:text-base" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grosime" className="text-xs sm:text-sm">Grosime (mm)</Label>
                  <Input id="grosime" value={form.grosime} onChange={(e) => handleChange('grosime', e.target.value)} placeholder="ex: 0.05, 0.07, 0.10" className="py-2 sm:py-3 text-sm sm:text-base" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lungime" className="text-xs sm:text-sm">Lungime (mm)</Label>
                  <Input id="lungime" value={form.lungime} onChange={(e) => handleChange('lungime', e.target.value)} placeholder="ex: 8, 10, 12" className="py-2 sm:py-3 text-sm sm:text-base" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="culoare" className="text-xs sm:text-sm">Culoare</Label>
                  <Input id="culoare" value={form.culoare} onChange={(e) => handleChange('culoare', e.target.value)} placeholder="ex: Negru, Maro" className="py-2 sm:py-3 text-sm sm:text-base" />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="image_url" className="text-sm sm:text-base">URL imagine sau Base64</Label>
            <textarea 
              id="image_url" 
              value={form.image_url} 
              onChange={(e) => handleChange('image_url', e.target.value)}
              className="w-full min-h-[60px] sm:min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical font-mono text-xs sm:text-sm"
              placeholder="Introduceți URL-ul imaginii sau datele Base64..."
            />
            {form.image_url && (
              <div className="mt-2 p-2 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Previzualizare imagine:</p>
                <img 
                  src={form.image_url} 
                  alt="Preview" 
                  className="max-w-full h-32 object-contain rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Încarcă imagine nouă (va fi salvată ca base64)</Label>
            <Input type="file" accept="image/*" onChange={handleUpload} />
            <p className="text-xs text-muted-foreground">
              Formante acceptate: JPG, PNG, GIF, WebP. Mărime maximă: 5MB
            </p>
          </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-4 border-t bg-white sticky bottom-0">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving} className="w-full sm:w-auto py-2 sm:py-3 text-sm sm:text-base">
                Anulează
              </Button>
              <Button type="submit" disabled={saving} className="w-full sm:w-auto py-2 sm:py-3 text-sm sm:text-base">
                {saving ? 'Se salvează...' : 'Salvează'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditDialog;
