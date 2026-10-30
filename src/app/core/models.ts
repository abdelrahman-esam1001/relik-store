export type CategoryId = 'chains' | 'rings' | 'bracelets' | 'pendants';

export type Availability = 'in-stock' | 'low-stock' | 'sold-out';

export interface ProductImage {
  src: string;
  alt: string;
}

export interface OptionValue {
  value: string;
  label: string;
  available: boolean;
}

/** A single selectable dimension, e.g. ring size or chain length. */
export interface ProductOption {
  id: string;
  label: string;
  values: OptionValue[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  description: string;
  details: string[];
  /** Price in minor units (cents) to keep arithmetic exact. */
  price: number;
  currency: string;
  images: ProductImage[];
  options: ProductOption[];
  availability: Availability;
  featured: number | null;
}

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
}

export type SelectedOptions = Record<string, string>;

export interface CartLine {
  /** product id + serialized options; different options are different lines */
  key: string;
  productId: string;
  options: SelectedOptions;
  quantity: number;
}

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name';

export interface ShopFilters {
  q: string;
  category: CategoryId | null;
  min: number | null;
  max: number | null;
  inStock: boolean;
  sort: SortKey;
}
