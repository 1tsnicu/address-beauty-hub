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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editare produs</DialogTitle>
          <DialogDescription>
            Modifică câmpurile și salvează. Imaginea poate fi încărcată mai jos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nume</Label>
            <Input id="name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descriere">Descriere</Label>
            <Input id="descriere" value={form.descriere} onChange={(e) => handleChange('descriere', e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sale_price">Preț (MDL)</Label>
              <Input id="sale_price" type="number" step="0.01" value={form.sale_price} onChange={(e) => handleChange('sale_price', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input id="discount" type="number" step="1" value={form.discount} onChange={(e) => handleChange('discount', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store_stock">Stoc magazin</Label>
              <Input id="store_stock" type="number" step="1" value={form.store_stock} onChange={(e) => handleChange('store_stock', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_stock">Stoc total</Label>
              <Input id="total_stock" type="number" step="1" value={form.total_stock} onChange={(e) => handleChange('total_stock', e.target.value)} />
            </div>
          </div>

          {/* Câmpuri specifice pentru tabelul gene */}
          {row?.table === 'gene' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Proprietăți specifice gene</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="curbura">Curbură</Label>
                  <Input id="curbura" value={form.curbura} onChange={(e) => handleChange('curbura', e.target.value)} placeholder="ex: C, CC, D, L" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grosime">Grosime (mm)</Label>
                  <Input id="grosime" value={form.grosime} onChange={(e) => handleChange('grosime', e.target.value)} placeholder="ex: 0.05, 0.07, 0.10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lungime">Lungime (mm)</Label>
                  <Input id="lungime" value={form.lungime} onChange={(e) => handleChange('lungime', e.target.value)} placeholder="ex: 8, 10, 12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="culoare">Culoare</Label>
                  <Input id="culoare" value={form.culoare} onChange={(e) => handleChange('culoare', e.target.value)} placeholder="ex: Negru, Maro" />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="image_url">URL imagine sau Base64</Label>
            <Input id="image_url" value={form.image_url} onChange={(e) => handleChange('image_url', e.target.value)} />
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

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Anulează
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Se salvează...' : 'Salvează'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditDialog;
