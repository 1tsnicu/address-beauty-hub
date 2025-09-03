import { z } from 'zod';

// Base/common fields
export const baseProductSchema = z.object({
  name: z.string().min(2, 'Numele trebuie să aibă minim 2 caractere'),
  sale_price: z
    .number({ invalid_type_error: 'Prețul trebuie să fie un număr' })
    .min(0, 'Prețul trebuie să fie ≥ 0'),
  discount: z
    .number({ invalid_type_error: 'Discount trebuie să fie un număr' })
    .min(0, 'Discount minim 0')
    .max(100, 'Discount maxim 100')
    .default(0)
    .optional()
    .transform((v) => (typeof v === 'number' ? v : 0)),
  store_stock: z
    .number({ invalid_type_error: 'Stoc magazin trebuie să fie un număr' })
    .int('Stoc magazin trebuie să fie întreg')
    .min(0, 'Stoc magazin trebuie să fie ≥ 0'),
  total_stock: z
    .number({ invalid_type_error: 'Stoc total trebuie să fie un număr' })
    .int('Stoc total trebuie să fie întreg')
    .min(0, 'Stoc total trebuie să fie ≥ 0'),
  image_url: z
    .string()
    .url('URL imagine invalid (trebuie să înceapă cu http/https)'),
  descriere: z.string().optional().or(z.literal('')),
});

export const geneSchema = baseProductSchema
  .extend({
    // Free-text to allow adding new curvatures on the fly
    curbura: z.string().min(1, 'Curbura este obligatorie'),
    grosime: z
      .string()
      .regex(/^0\.\d{2}$/, 'Format grosime ex: 0.05, 0.07, 0.10, 0.12'),
    lungime: z
      .string()
      .min(1, 'Lungimea este obligatorie'), // acceptă „06”, „15”, „6-13” etc.
    culoare: z.string().min(1, 'Culoarea este obligatorie'),
  })
  .refine((data) => data.total_stock >= data.store_stock, {
    message: 'Stoc total trebuie să fie ≥ stoc magazin',
    path: ['total_stock'],
  });

export const adhesiveSchema = baseProductSchema
  .extend({
    sku: z.string().min(1, 'SKU este obligatoriu'),
  })
  .refine((data) => data.total_stock >= data.store_stock, {
    message: 'Stoc total trebuie să fie ≥ stoc magazin',
    path: ['total_stock'],
  });

export type GeneInput = z.infer<typeof geneSchema>;
export type AdhesiveInput = z.infer<typeof adhesiveSchema>;
export type BaseInput = z.infer<typeof baseProductSchema>;

export type CategoryKey =
  | 'adezive'
  | 'preparate'
  | 'consumabile'
  | 'ingrijire-personala'
  | 'accesorii'
  | 'gene'
  | 'ustensile'
  | 'tehnologie_led'
  | 'hena_sprancene'
  | 'vopsele_profesionale'
  | 'pensule_instrumente_speciale'
  | 'solutii_laminare'
  | 'adezive_laminare'
  | 'accesorii_specifice';

// Optional map for special categories; others fall back to base schema
export const schemasByCategory: Partial<Record<CategoryKey, z.ZodTypeAny>> = {
  gene: geneSchema,
  adezive: adhesiveSchema,
};

export function getSchemaForCategory(category: CategoryKey) {
  return schemasByCategory[category] ?? baseProductSchema;
}
