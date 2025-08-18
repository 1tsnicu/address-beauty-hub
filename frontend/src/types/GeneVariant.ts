/**
 * Tipuri pentru sistemul de variante gene
 */

export interface GeneVariant {
  id: number;
  sale_price: number | null;
  discount: number | null;
  store_stock: number | null;
  image_url: string | null;
  curbura: string | null;
  grosime: string | null;
  lungime: string | null;
  culoare: string | null;
  descriere?: string | null;
}

export interface GeneGroup {
  slug: string;
  name: string;
  image_url: string | null;
  from_price: number | null;
  total_stock: number;
  variant_count: number;
  descriere?: string | null;
}

export interface GeneVariantOptions {
  curburi: string[];
  grosimi: string[];
  lungimi: string[];
  culori: string[];
}

export interface VariantSelection {
  curbura?: string;
  grosime?: string;
  lungime?: string;
  culoare?: string;
}

export interface SelectedVariant extends GeneVariant {
  isComplete: boolean;
  isAvailable: boolean;
}
