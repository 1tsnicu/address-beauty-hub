import type { CategoryKey } from './schemas';

export type FieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'textarea';

export interface FieldConfigBase {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  step?: string | number;
  min?: number;
  max?: number;
  options?: string[];
}

export type FieldsMap = Record<CategoryKey | 'common', FieldConfigBase[]>;

export const FIELD_CONFIG: FieldsMap = {
  common: [
    { name: 'name', label: 'Nume produs', type: 'text', placeholder: 'Ex: Gene 3D', required: true },
    { name: 'sale_price', label: 'Preț', type: 'number', step: 0.01, min: 0, required: true },
    { name: 'discount', label: 'Discount (%)', type: 'number', step: 1, min: 0, max: 100 },
    { name: 'store_stock', label: 'Stoc magazin', type: 'number', step: 1, min: 0, required: true },
    { name: 'total_stock', label: 'Stoc total', type: 'number', step: 1, min: 0, required: true },
    { name: 'image_url', label: 'URL Imagine', type: 'text', placeholder: 'https://...' , required: true },
    { name: 'descriere', label: 'Descriere', type: 'textarea', placeholder: 'Detalii produs (opțional)' },
  ],
  gene: [
    { name: 'curbura', label: 'Curbură', type: 'text', placeholder: 'ex: C, D, M, L New', required: true },
    { name: 'grosime', label: 'Grosime', type: 'text', placeholder: '0.05 | 0.07 | 0.10 | 0.12', required: true },
    { name: 'lungime', label: 'Lungime', type: 'text', placeholder: '06 | 15 | 6-13', required: true },
    { name: 'culoare', label: 'Culoare', type: 'text', placeholder: 'Negru', required: true },
  ],
  adezive: [
    { name: 'sku', label: 'SKU', type: 'text', placeholder: 'ADZ-001', required: true },
  ],
  'preparate': [],
  'consumabile': [],
  'ingrijire-personala': [],
  'accesorii': [],
  'ustensile': [],
  'tehnologie_led': [],
  'hena_sprancene': [],
  'vopsele_profesionale': [],
  'pensule_instrumente_speciale': [],
  'solutii_laminare': [],
  'adezive_laminare': [],
  'accesorii_specifice': [],
};

export const CATEGORY_OPTIONS: Array<{ value: CategoryKey; label: string }> = [
  { value: 'adezive', label: 'Adezive' },
  { value: 'preparate', label: 'Preparate' },
  { value: 'consumabile', label: 'Consumabile' },
  { value: 'ingrijire-personala', label: 'Îngrijire Personală' },
  { value: 'accesorii', label: 'Accesorii' },
  { value: 'gene', label: 'Gene' },
  { value: 'ustensile', label: 'Ustensile' },
  { value: 'tehnologie_led', label: 'Tehnologie LED' },
  { value: 'hena_sprancene', label: 'Hena sprâncene' },
  { value: 'vopsele_profesionale', label: 'Vopsele profesionale' },
  { value: 'pensule_instrumente_speciale', label: 'Pensule/Instrumente speciale' },
  { value: 'solutii_laminare', label: 'Soluții laminare' },
  { value: 'adezive_laminare', label: 'Adezive laminare' },
  { value: 'accesorii_specifice', label: 'Accesorii specifice' },
];
