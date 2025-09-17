import React, { useMemo, useState } from 'react';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FIELD_CONFIG, type FieldConfigBase, CATEGORY_OPTIONS } from '@/lib/admin/fieldConfig';
import {
  type CategoryKey,
  geneSchema,
  adhesiveSchema,
  type GeneInput,
  type AdhesiveInput,
  getSchemaForCategory,
  type BaseInput,
} from '@/lib/admin/schemas';
import { createByCategory } from '@/lib/admin/adapters';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { uploadImageFile } from '@/lib/admin/uploadImage';

// Value type allowed by inputs
type FieldValue = string | number | '';

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldConfigBase;
  value: FieldValue | undefined;
  onChange: (name: string, v: FieldValue) => void;
}) {
  const commonProps = {
    id: field.name,
    name: field.name,
    placeholder: field.placeholder,
  } as const;

  return (
    <div className="space-y-1">
      <Label htmlFor={field.name}>{field.label}</Label>
      {field.type === 'text' && (
        <Input {...commonProps} value={(value as string) ?? ''} onChange={(e) => onChange(field.name, e.target.value)} />
      )}
      {field.type === 'number' && (
        <Input
          {...commonProps}
          type="number"
          step={field.step ?? 1}
          min={field.min}
          max={field.max}
          value={(value as number | '') ?? ''}
          onChange={(e) =>
            onChange(field.name, e.target.value === '' ? '' : (Number(e.target.value) as number))
          }
        />
      )}
      {field.type === 'textarea' && (
        <Textarea {...commonProps} value={(value as string) ?? ''} onChange={(e) => onChange(field.name, e.target.value)} />
      )}
      {field.type === 'select' && (
        <select
          {...commonProps}
          className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(field.name, e.target.value)}
        >
          <option value="" disabled>
            Selectează
          </option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default function AddProductButton({ onAdded }: { onAdded?: () => void }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [category, setCategory] = useState<CategoryKey | ''>('');
  const [values, setValues] = useState<Record<string, FieldValue>>({ discount: 0 });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const schema = useMemo(() => (category ? getSchemaForCategory(category as CategoryKey) : null), [category]);

  const fields = useMemo<FieldConfigBase[]>(() => {
    if (!category) return [];
    return [...FIELD_CONFIG.common, ...FIELD_CONFIG[category as CategoryKey]];
  }, [category]);

  function reset() {
    setStep(1);
    setCategory('');
    setValues({ discount: 0 });
  }

  function handleClose(v: boolean) {
    setOpen(v);
    if (!v) {
      reset();
    }
  }

  const onChange = (name: string, v: FieldValue) => setValues((s) => ({ ...s, [name]: v }));

  async function onSubmit() {
    if (!schema || !category) return;

    try {
      setSubmitting(true);
      if (category === 'gene') {
        const parsed = geneSchema.parse(values) as GeneInput;
        await createByCategory('gene', parsed);
      } else if (category === 'adezive') {
        const parsed = adhesiveSchema.parse(values) as AdhesiveInput;
        await createByCategory('adezive', parsed);
      } else {
        const parsed = (schema as z.ZodTypeAny).parse(values) as BaseInput;
        await createByCategory(category as Exclude<CategoryKey, 'gene' | 'adezive'>, parsed);
      }
      toast({ title: 'Produs adăugat', description: 'Produsul a fost creat cu succes.' });
      onAdded?.();
      handleClose(false);
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        const first = e.issues?.[0];
        toast({ title: 'Validare eșuată', description: first?.message ?? 'Verifică câmpurile', variant: 'destructive' });
      } else if (e instanceof Error) {
        toast({ title: 'Eroare la salvare', description: e.message, variant: 'destructive' });
      } else {
        toast({ title: 'Eroare la salvare', description: 'Încercă din nou', variant: 'destructive' });
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setSubmitting(true);
      const { publicUrl } = await uploadImageFile(file, { category: (category || 'misc').toString() });
      setValues((s) => ({ ...s, image_url: publicUrl }));
      toast({ title: 'Imagine încărcată', description: 'URL setat automat.' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Încărcarea a eșuat';
      toast({ title: 'Eroare imagine', description: msg, variant: 'destructive' });
    } finally {
      setSubmitting(false);
      // reset file input so the same file can be re-selected
      e.currentTarget.value = '';
    }
  }

  const imageUrl = values.image_url as string | undefined;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Adaugă produs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Adaugă produs</DialogTitle>
          <p className="sr-only" id="add-product-desc">
            Completează datele produsului
          </p>
        </DialogHeader>

        {step === 1 && (
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="category">Categorie</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryKey)}
                  className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="" disabled>
                    Selectează categoria
                  </option>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end pt-4 border-t bg-white sticky bottom-0">
                <Button onClick={() => setStep(2)} disabled={!category} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Continuă
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && category && (
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((f) => (
                  <FieldRenderer key={f.name} field={f} value={values[f.name]} onChange={onChange} />
                ))}
              </div>

              <div className="space-y-3">
                <Label>Încărcare imagine de pe dispozitiv</Label>
                <input type="file" accept="image/*" onChange={handleFileSelect} />
                {imageUrl && (
                  <div className="rounded-md border border-blue-200 p-3 bg-blue-50">
                    <div className="text-sm mb-2 text-blue-900">Previzualizare imagine</div>
                    <img src={imageUrl} alt="preview" className="max-h-48 w-full object-contain bg-white rounded" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t bg-white sticky bottom-0">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Înapoi
                </Button>
                <Button onClick={onSubmit} disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {submitting ? 'Se salvează...' : 'Salvează'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
