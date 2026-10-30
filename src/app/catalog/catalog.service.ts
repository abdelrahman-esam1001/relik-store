import { Injectable, computed, signal } from '@angular/core';
import { Category, CategoryId, Product } from '../core/models';
import { CATEGORIES, PRODUCTS } from './catalog.data';

type Status = 'loading' | 'ready' | 'error';

/**
 * Data access for the catalog. Today it reads the typed demo source; swap `fetchProducts`
 * for an HTTP call to a real commerce API without touching any component.
 */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly _products = signal<Product[]>([]);
  private readonly _status = signal<Status>('loading');

  readonly products = this._products.asReadonly();
  readonly status = this._status.asReadonly();
  readonly categories: Category[] = CATEGORIES;
  readonly featured = computed(() =>
    this._products()
      .filter((p) => p.featured != null)
      .sort((a, b) => a.featured! - b.featured!),
  );
  private readonly bySlug = computed(() => new Map(this._products().map((p) => [p.slug, p])));
  private readonly byId = computed(() => new Map(this._products().map((p) => [p.id, p])));

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this._status.set('loading');
    try {
      this._products.set(await this.fetchProducts());
      this._status.set('ready');
    } catch {
      this._status.set('error');
    }
  }

  private fetchProducts(): Promise<Product[]> {
    // Simulated network latency so loading states are exercised in the prototype.
    return new Promise((resolve) => setTimeout(() => resolve(structuredClone(PRODUCTS)), 250));
  }

  getBySlug(slug: string): Product | undefined {
    return this.bySlug().get(slug);
  }

  getById(id: string): Product | undefined {
    return this.byId().get(id);
  }

  category(id: CategoryId): Category | undefined {
    return CATEGORIES.find((c) => c.id === id);
  }
}
