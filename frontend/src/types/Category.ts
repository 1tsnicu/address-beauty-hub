export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
  parentId?: string; // For sub-categories
  imageUrl?: string; // For category thumbnail
  order?: number; // For controlling display order
  attributes?: {
    type?: string;
    color?: string;
    size?: string;
    [key: string]: string | number | boolean | undefined;
  }; // For additional filtering attributes
}
