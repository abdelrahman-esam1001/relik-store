import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CatalogService } from '../catalog/catalog.service';
import { Product } from '../core/models';
import { SafeStorage } from '../core/storage';
import { ToastService } from '../shared/toast.service';

const KEY = 'relik.wishlist.v1';
const isIds = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string');

@Injectable({ providedIn: 'root' })
export class WishlistStore {
  private readonly storage = inject(SafeStorage);
  private readonly catalog = inject(CatalogService);
  private readonly toast = inject(ToastService);

  private readonly _ids = signal<string[]>(this.storage.read(KEY, [], isIds));
  readonly ids = this._ids.asReadonly();
  readonly count = computed(() => this._ids().length);
  readonly products = computed(() =>
    this._ids()
      .map((id) => this.catalog.getById(id))
      .filter((p): p is Product => !!p),
  );

  constructor() {
    effect(() => this.storage.write(KEY, this._ids()));
  }

  has(id: string): boolean {
    return this._ids().includes(id);
  }

  toggle(product: Product): void {
    const saved = this.has(product.id);
    this._ids.update((ids) => (saved ? ids.filter((x) => x !== product.id) : [...ids, product.id]));
    this.toast.show(saved ? `${product.name} removed from wishlist.` : `${product.name} saved to wishlist.`);
  }
}
