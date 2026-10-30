import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CatalogService } from '../catalog/catalog.service';
import { CartLine, Product, SelectedOptions } from '../core/models';
import { SafeStorage } from '../core/storage';
import { ToastService } from '../shared/toast.service';
import * as logic from './cart.logic';

const KEY = 'relik.bag.v1';

export interface ResolvedLine extends CartLine {
  product: Product | undefined;
  lineTotal: number;
}

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly storage = inject(SafeStorage);
  private readonly catalog = inject(CatalogService);
  private readonly toast = inject(ToastService);

  private readonly _lines = signal<CartLine[]>(this.storage.read(KEY, [], logic.isCartLines));
  readonly lines = this._lines.asReadonly();

  readonly count = computed(() => logic.itemCount(this._lines()));
  readonly resolved = computed<ResolvedLine[]>(() =>
    this._lines().map((l) => {
      const product = this.catalog.getById(l.productId);
      return { ...l, product, lineTotal: (product?.price ?? 0) * l.quantity };
    }),
  );
  readonly subtotal = computed(() => logic.subtotal(this._lines(), (id) => this.catalog.getById(id)?.price));
  /** Lines that can't be bought as-is (sold out or option no longer available). */
  readonly blocked = computed(() =>
    this.resolved().filter((l) => !l.product || logic.validateSelection(l.product, l.options).length > 0),
  );

  constructor() {
    effect(() => this.storage.write(KEY, this._lines()));
  }

  /** Validates, adds and announces. Returns validation errors (empty on success). */
  add(product: Product, options: SelectedOptions, qty = 1): logic.OptionError[] {
    const errors = logic.validateSelection(product, options);
    if (errors.length) return errors;
    const before = this._lines().find((l) => l.key === logic.lineKey(product.id, options))?.quantity ?? 0;
    this._lines.update((ls) => logic.addLine(ls, product.id, options, qty));
    const capped = before + qty > logic.MAX_QTY;
    const opts = Object.values(options).join(', ');
    this.toast.show(
      capped
        ? `Quantity limit reached for ${product.name}.`
        : `${product.name}${opts ? ` (${opts})` : ''} added to your bag.`,
      { label: 'View bag', link: '/bag' },
    );
    return [];
  }

  setQuantity(key: string, qty: number): void {
    this._lines.update((ls) => logic.setQuantity(ls, key, qty));
  }

  remove(key: string): void {
    const line = this.resolved().find((l) => l.key === key);
    this._lines.update((ls) => logic.removeLine(ls, key));
    if (line?.product) this.toast.show(`${line.product.name} removed from your bag.`);
  }

  clear(): void {
    this._lines.set([]);
  }
}
