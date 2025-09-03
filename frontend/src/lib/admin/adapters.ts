import { supabase } from '@/lib/supabaseClient';
import type { AdhesiveInput, GeneInput, CategoryKey, BaseInput } from './schemas';

export async function checkSkuUnique(sku: string) {
  const { data, error } = await supabase
    .from('adezive')
    .select('sku')
    .eq('sku', sku)
    .limit(1);
  if (error) throw error;
  return (data?.length ?? 0) === 0;
}

export async function createGene(input: GeneInput) {
  const { discount = 0, ...rest } = input;
  const payload = { ...rest, discount };
  const { data, error } = await supabase.from('gene').insert(payload).select('*').single();
  if (error) throw error;
  return data;
}

export async function createAdhesive(input: AdhesiveInput) {
  const { discount = 0, ...rest } = input;
  const payload = { ...rest, discount };
  const { data, error } = await supabase.from('adezive').insert(payload).select('*').single();
  if (error) throw error;
  return data;
}

export async function createGeneric(category: Exclude<CategoryKey, 'gene' | 'adezive'>, input: BaseInput) {
  const { discount = 0, ...rest } = input as BaseInput & { discount?: number };
  const payload = { ...rest, discount };
  const { data, error } = await supabase.from(category).insert(payload).select('*').single();
  if (error) throw error;
  return data;
}

// Overloads for better type inference
export async function createByCategory(category: 'gene', values: GeneInput): Promise<unknown>;
export async function createByCategory(category: 'adezive', values: AdhesiveInput): Promise<unknown>;
export async function createByCategory(category: Exclude<CategoryKey, 'gene' | 'adezive'>, values: BaseInput): Promise<unknown>;
export async function createByCategory(category: CategoryKey, values: GeneInput | AdhesiveInput | BaseInput): Promise<unknown> {
  if (category === 'gene') return createGene(values as GeneInput);
  if (category === 'adezive') {
    const skuOk = await checkSkuUnique((values as AdhesiveInput).sku);
    if (!skuOk) throw new Error('SKU deja există. Alege altul.');
    return createAdhesive(values as AdhesiveInput);
  }
  return createGeneric(category as Exclude<CategoryKey, 'gene' | 'adezive'>, values as BaseInput);
}
