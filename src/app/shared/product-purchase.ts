import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { CartStore } from '../cart/cart.store';
import { OptionError } from '../cart/cart.logic';
import { Product, SelectedOptions } from '../core/models';
import { MoneyPipe } from '../core/money';
import { WishlistStore } from '../wishlist/wishlist.store';
import { Icon } from './icon';
import { OptionPicker } from './option-picker';
import { QtyStepper } from './qty-stepper';

/** Option selection, quantity and add-to-bag for one product. Rules live in CartStore. */
@Component({
  selector: 'app-product-purchase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoneyPipe, Icon, OptionPicker, QtyStepper],
  template: `
    @let p = product();
    <div class="buy">
      <p class="price">{{ p.price | money }}</p>
      @if (p.availability === 'low-stock') { <p class="stock">Low stock</p> }

      @for (o of p.options; track o.id) {
        <app-option-picker [option]="o" [name]="p.slug" [selected]="selected()[o.id]"
          [error]="errorFor(o.id)" (picked)="pick(o.id, $event)" />
      }

      @if (p.availability === 'sold-out') {
        <p class="notice"><strong>Sold out.</strong> Save it to your wishlist to keep it close.</p>
      } @else {
        <div class="row">
          <app-qty-stepper [value]="qty()" [label]="p.name" (changed)="setQty($event)" />
          <button class="btn btn-primary grow" type="button" (click)="add()">
            Add to bag <app-icon name="arrow" />
          </button>
        </div>
      }
      <button class="btn btn-ghost" type="button" (click)="wishlist.toggle(p)" [attr.aria-pressed]="saved()">
        <app-icon name="heart" [class.filled]="saved()" /> {{ saved() ? 'Saved to wishlist' : 'Save to wishlist' }}
      </button>
    </div>
  `,
  styles: `
    .buy { display: grid; gap: 24px; }
    .price { font-size: 24px; }
    .stock { font-size: 12px; letter-spacing: .2em; text-transform: uppercase; color: var(--silver); margin-top: -14px; }
    .row { display: flex; gap: 12px; flex-wrap: wrap; }
    .grow { flex: 1; min-width: 200px; }
  `,
})
export class ProductPurchase {
  readonly product = input.required<Product>();
  private readonly cart = inject(CartStore);
  protected readonly wishlist = inject(WishlistStore);

  /** Reset selection whenever the product changes. */
  protected readonly selected = linkedSignal<Product, SelectedOptions>({ source: this.product, computation: () => ({}) });
  protected readonly qty = linkedSignal({ source: this.product, computation: () => 1 });
  private readonly errors = signal<OptionError[]>([]);
  protected readonly saved = computed(() => this.wishlist.ids().includes(this.product().id));

  protected errorFor(id: string): string | undefined {
    return this.errors().find((e) => e.optionId === id)?.message;
  }

  protected pick(id: string, value: string): void {
    this.selected.update((s) => ({ ...s, [id]: value }));
    this.errors.update((es) => es.filter((e) => e.optionId !== id));
  }

  protected setQty(n: number): void {
    this.qty.set(Math.max(1, n));
  }

  protected add(): void {
    this.errors.set(this.cart.add(this.product(), this.selected(), this.qty()));
  }
}
