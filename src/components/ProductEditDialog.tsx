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
    sku: '',
    sale_price: '',
    discount: '',
    store_stock: '',
    total_stock: '',
    image_url: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (row) {
      setForm({
        name: row.name || '',
        sku: (row.sku ?? '') as string,
        sale_price: row.sale_price != null ? String(row.sale_price) : '',
        discount: row.discount != null ? String(row.discount) : '',
        store_stock: row.store_stock != null ? String(row.store_stock) : '',
        total_stock: row.total_stock != null ? String(row.total_stock) : '',
        image_url: (row.image_url ?? '') as string,
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
        sku: form.sku || null,
        sale_price: form.sale_price !== '' ? Number(form.sale_price) : null,
        discount: form.discount !== '' ? Number(form.discount) : null,
        store_stock: form.store_stock !== '' ? Number(form.store_stock) : null,
        total_stock: form.total_stock !== '' ? Number(form.total_stock) : null,
        image_url: form.image_url || null,
      };

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

  // Upload simplu imagine în bucket "product-images"
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !row) return;
    try {
      const ext = file.name.split('.').pop();
      const path = `${row.table}/${row.id}-${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true });
      if (error) throw new Error(error.message);
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(data.path);
      setForm((p) => ({ ...p, image_url: urlData.publicUrl }));
      toast.success('Imagine încărcată');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload eșuat');
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nume</Label>
              <Input id="name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" value={form.sku} onChange={(e) => handleChange('sku', e.target.value)} />
            </div>
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

          <div className="space-y-2">
            <Label htmlFor="image_url">URL imagine</Label>
            <Input id="image_url" value={form.image_url} onChange={(e) => handleChange('image_url', e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Încarcă imagine</Label>
            <Input type="file" accept="image/*" onChange={handleUpload} />
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
