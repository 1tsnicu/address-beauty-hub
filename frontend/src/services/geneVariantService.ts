import { supabase } from '@/lib/supabaseClient';
import { GeneGroup, GeneVariant, GeneVariantOptions } from '@/types/GeneVariant';

/**
 * Serviciu pentru operațiuni cu variantele gene în Supabase
 */
export class GeneVariantService {
  /**
   * Obține toate grupurile de produse pentru listarea principală
   */
  static async getProductGroups(): Promise<GeneGroup[]> {
    // Încarcă toate produsele gene cu paginare
    let allData: any[] = [];
    let hasMore = true;
    let offset = 0;
    const limit = 100;
    
    while (hasMore) {
      const { data, error } = await supabase
        .from('gene')
        .select('id, name, image_url, sale_price, store_stock, descriere')
        .range(offset, offset + limit - 1)
        .order('id', { ascending: true });

      if (error) {
        break;
      }

      if (data && data.length > 0) {
        allData = [...allData, ...data];
        
        if (data.length < limit) {
          hasMore = false;
        } else {
          offset += limit;
        }
      } else {
        hasMore = false;
      }
    }

    if (allData.length === 0) return [];

    // Grupează produsele după nume
    const groups = new Map<string, {
      name: string;
      image_url: string | null;
      min_price: number;
      total_stock: number;
      variant_count: number;
      descriere: string | null;
    }>();

    allData.forEach(product => {
      const productName = product.name;
      if (!groups.has(productName)) {
        groups.set(productName, {
          name: productName,
          image_url: product.image_url,
          min_price: product.sale_price || 0,
          total_stock: product.store_stock || 0,
          variant_count: 1,
          descriere: product.descriere
        });
      } else {
        const group = groups.get(productName)!;
        group.min_price = Math.min(group.min_price, product.sale_price || 0);
        group.total_stock += (product.store_stock || 0);
        group.variant_count += 1;
        
        // Folosește prima imagine găsită dacă nu există una
        if (!group.image_url && product.image_url) {
          group.image_url = product.image_url;
        }
        
        // Folosește prima descriere găsită dacă nu există una
        if (!group.descriere && product.descriere) {
          group.descriere = product.descriere;
        }
      }
    });

    // Convertește în format GeneGroup
    const result = Array.from(groups.entries()).map(([name, group]) => ({
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
      name: group.name,
      image_url: group.image_url,
      from_price: group.min_price,
      total_stock: group.total_stock,
      variant_count: group.variant_count,
      descriere: group.descriere
    }));
    
    return result;
  }

  /**
   * Obține opțiunile disponibile pentru un produs (pentru chip-uri)
   */
  static async getVariantOptions(slug: string): Promise<GeneVariantOptions> {
    // Query pentru opțiunile distincte
    const { data, error } = await supabase
      .rpc('get_gene_variant_options', { product_slug: slug });

    if (error) {
      // Fallback la query direct dacă RPC nu există
      return this.getVariantOptionsFallback(slug);
    }

    return {
      curburi: data?.curburi || [],
      grosimi: data?.grosimi || [],
      lungimi: data?.lungimi || [],
      culori: data?.culori || []
    };
  }

  /**
   * Fallback pentru opțiunile variantelor (fără RPC)
   */
  private static async getVariantOptionsFallback(slug: string): Promise<GeneVariantOptions> {
    // Denormalizăm slug-ul pentru comparație
    const searchName = slug.replace(/-/g, ' ');
    
    const { data, error } = await supabase
      .from('gene')
      .select('curbura, grosime, lungime, culoare')
      .ilike('name', `%${searchName}%`)
      .limit(50);

    if (error) {
      return { curburi: [], grosimi: [], lungimi: [], culori: [] };
    }

    const variants = data || [];
    
    return {
      curburi: [...new Set(variants.map(v => v.curbura).filter(Boolean))].sort(),
      grosimi: [...new Set(variants.map(v => v.grosime).filter(Boolean))].sort(),
      lungimi: [...new Set(variants.map(v => v.lungime).filter(Boolean))].sort(),
      culori: [...new Set(variants.map(v => v.culoare).filter(Boolean))].sort()
    };
  }

  /**
   * Obține toate variantele pentru un produs
   */
  static async getProductVariants(slug: string): Promise<GeneVariant[]> {
    // Convertește slug-ul înapoi în numele produsului
    const productName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Găsește toate variantele cu numele exact sau similar, limitat la 20 de rezultate
    const { data, error } = await supabase
      .from('gene')
      .select('id, sale_price, discount, store_stock, image_url, curbura, grosime, lungime, culoare, name, descriere')
      .ilike('name', `%${productName}%`)
      .limit(20);

    if (error) {
      return []; // Returnează array gol în loc să arunce eroare
    }

    return (data || []).map(variant => ({
      id: variant.id,
      sale_price: variant.sale_price,
      discount: variant.discount,
      store_stock: variant.store_stock,
      image_url: variant.image_url,
      curbura: variant.curbura,
      grosime: variant.grosime,
      lungime: variant.lungime,
      culoare: variant.culoare,
      descriere: variant.descriere
    }));
  }

  /**
   * Obține informațiile despre grup pentru un slug specific
   */
  static async getProductGroup(slug: string): Promise<GeneGroup | null> {
    const { data, error } = await supabase
      .from('gene_groups')
      .select('slug, name, image_url, from_price, total_stock, variant_count')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Nu s-a găsit produsul
        return null;
      }
      throw new Error(`Eroare la încărcarea produsului: ${error.message}`);
    }

    return data;
  }
}

/**
 * Hook pentru încărcarea grupurilor de produse
 */
export async function useProductGroups() {
  return await GeneVariantService.getProductGroups();
}

/**
 * Hook pentru încărcarea unui produs specific
 */
export async function useProduct(slug: string) {
  const [group, variants, options] = await Promise.all([
    GeneVariantService.getProductGroup(slug),
    GeneVariantService.getProductVariants(slug),
    GeneVariantService.getVariantOptions(slug)
  ]);

  return { group, variants, options };
}
