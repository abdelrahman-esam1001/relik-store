import { CategoryId, Product, ShopFilters, SortKey } from '../core/models';

export const CATEGORY_IDS: CategoryId[] = ['chains', 'rings', 'bracelets', 'pendants'];
export const SORT_KEYS: SortKey[] = ['featured', 'price-asc', 'price-desc', 'name'];

export const DEFAULT_FILTERS: ShopFilters = {
  q: '',
  category: null,
  min: null,
  max: null,
  inStock: false,
  sort: 'featured',
};

const num = (v: string | null): number | null => {
  if (v == null || v.trim() === '') return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

/** URL query params → filters. Prices in the URL are whole currency units. */
export function parseFilters(params: Record<string, string | null>, category: CategoryId | null = null): ShopFilters {
  const cat = params['category'] as CategoryId | null;
  const sort = params['sort'] as SortKey | null;
  return {
    q: (params['q'] ?? '').slice(0, 80),
    category: category ?? (cat && CATEGORY_IDS.includes(cat) ? cat : null),
    min: num(params['min']),
    max: num(params['max']),
    inStock: params['stock'] === 'in',
    sort: sort && SORT_KEYS.includes(sort) ? sort : 'featured',
  };
}

/** Filters → URL query params (defaults omitted so URLs stay short and shareable). */
export function filtersToParams(f: ShopFilters, includeCategory = true): Record<string, string | null> {
  return {
    q: f.q.trim() || null,
    category: includeCategory ? f.category : null,
    min: f.min != null ? String(f.min) : null,
    max: f.max != null ? String(f.max) : null,
    stock: f.inStock ? 'in' : null,
    sort: f.sort !== 'featured' ? f.sort : null,
  };
}

export function matchesQuery(p: Product, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return [p.name, p.category, p.description].some((s) => s.toLowerCase().includes(needle));
}

export function applyFilters(products: Product[], f: ShopFilters): Product[] {
  const out = products.filter(
    (p) =>
      matchesQuery(p, f.q) &&
      (!f.category || p.category === f.category) &&
      (f.min == null || p.price >= f.min * 100) &&
      (f.max == null || p.price <= f.max * 100) &&
      (!f.inStock || p.availability !== 'sold-out'),
  );
  const byFeatured = (a: Product, b: Product) =>
    (a.featured ?? Infinity) - (b.featured ?? Infinity) || a.id.localeCompare(b.id);
  const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
    featured: byFeatured,
    'price-asc': (a, b) => a.price - b.price || byFeatured(a, b),
    'price-desc': (a, b) => b.price - a.price || byFeatured(a, b),
    name: (a, b) => a.name.localeCompare(b.name),
  };
  return out.sort(sorters[f.sort]);
}
