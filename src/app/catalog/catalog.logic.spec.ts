import { PRODUCTS } from './catalog.data';
import { DEFAULT_FILTERS, applyFilters, filtersToParams, parseFilters } from './catalog.logic';

describe('catalog logic', () => {
  it('has 16 products across all four categories with unique slugs', () => {
    expect(PRODUCTS.length).toBe(16);
    expect(new Set(PRODUCTS.map((p) => p.category)).size).toBe(4);
    expect(new Set(PRODUCTS.map((p) => p.slug)).size).toBe(16);
  });

  it('filters by category, price and availability', () => {
    const out = applyFilters(PRODUCTS, { ...DEFAULT_FILTERS, category: 'rings', inStock: true });
    expect(out.every((p) => p.category === 'rings' && p.availability !== 'sold-out')).toBeTrue();
    const priced = applyFilters(PRODUCTS, { ...DEFAULT_FILTERS, min: 150, max: 200 });
    expect(priced.every((p) => p.price >= 15000 && p.price <= 20000)).toBeTrue();
  });

  it('searches name and description case-insensitively', () => {
    expect(applyFilters(PRODUCTS, { ...DEFAULT_FILTERS, q: 'SIGNET' }).map((p) => p.slug)).toContain('monolith-signet');
  });

  it('sorts by price and name', () => {
    const asc = applyFilters(PRODUCTS, { ...DEFAULT_FILTERS, sort: 'price-asc' }).map((p) => p.price);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    const names = applyFilters(PRODUCTS, { ...DEFAULT_FILTERS, sort: 'name' }).map((p) => p.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it('round-trips filters through URL params and ignores junk', () => {
    const f = { ...DEFAULT_FILTERS, q: 'chain', category: 'chains' as const, min: 100, inStock: true, sort: 'name' as const };
    expect(parseFilters(filtersToParams(f))).toEqual(f);
    const junk = parseFilters({ category: 'hats', sort: 'random', min: '-5', max: 'abc' });
    expect(junk).toEqual(DEFAULT_FILTERS);
  });
});
