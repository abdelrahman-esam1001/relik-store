import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../cart/cart.store';
import { Product } from '../core/models';
import { MoneyPipe } from '../core/money';
import { WishlistStore } from '../wishlist/wishlist.store';
import { Icon } from './icon';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MoneyPipe, Icon],
  template: `
    @let p = product();
    <article class="card" [class.sold]="p.availability === 'sold-out'">
      <a class="media" [routerLink]="['/product', p.slug]" [attr.aria-label]="p.name">
        <img [src]="p.images[0].src" [alt]="p.images[0].alt" width="1200" height="1200"
          [attr.loading]="eager() ? 'eager' : 'lazy'" decoding="async" />
        @if (p.images[1]) {
          <img class="alt" [src]="p.images[1].src" alt="" width="1200" height="1200" loading="lazy" decoding="async" />
        }
        @if (p.availability !== 'in-stock') {
          <span class="badge">{{ p.availability === 'sold-out' ? 'Sold out' : 'Low stock' }}</span>
        }
      </a>
      <button class="icon-btn wish" type="button" (click)="wishlist.toggle(p)"
        [attr.aria-pressed]="saved()" [attr.aria-label]="(saved() ? 'Remove ' : 'Save ') + p.name + (saved() ? ' from wishlist' : ' to wishlist')">
        <app-icon name="heart" [class.filled]="saved()" />
      </button>
      <div class="meta">
        <div>
          <p class="cat eyebrow">{{ p.category }}</p>
          <h3 class="name"><a [routerLink]="['/product', p.slug]">{{ p.name }}</a></h3>
        </div>
        <p class="price">{{ p.price | money }}</p>
      </div>
      @if (quickAdd()) {
        <button class="btn btn-ghost quick" type="button" (click)="cart.add(p, {})">Quick add</button>
      } @else if (p.availability !== 'sold-out') {
        <a class="choose link" [routerLink]="['/product', p.slug]">Select {{ p.options[0].id === 'length' ? 'length' : 'size' }}</a>
      }
    </article>
  `,
  styles: `
    .card { position: relative; display: grid; gap: 16px; }
    .media { position: relative; display: block; aspect-ratio: 4 / 5; overflow: hidden; background: var(--surface); }
    .media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1.1s var(--ease), opacity .6s var(--ease); }
    .media .alt { opacity: 0; }
    .media:hover img:first-child { transform: scale(1.04); }
    .media:hover .alt { opacity: 1; }
    .sold .media img { filter: grayscale(.6) brightness(.7); }
    .badge { position: absolute; left: 12px; top: 12px; font-size: 11px; letter-spacing: .18em; text-transform: uppercase; background: #080808cc; border: 1px solid var(--line-strong); padding: 6px 10px; }
    .wish { position: absolute; right: 8px; top: 8px; background: #080808aa; }
    .wish:hover { background: #080808; }
    .meta { display: flex; justify-content: space-between; gap: 16px; align-items: start; }
    .cat { font-size: 11px; }
    .name { font-family: var(--display); font-weight: 400; font-size: clamp(20px, 1.6vw, 26px); line-height: 1.1; margin-top: 6px; }
    .name a { text-decoration: none; }
    .price { white-space: nowrap; color: var(--ink); }
    .quick { --h: 44px; justify-self: start; font-size: 13px; padding: 0 20px; }
    .choose { justify-self: start; font-size: 14px; color: var(--ink-2); }
  `,
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly eager = input(false);
  protected readonly cart = inject(CartStore);
  protected readonly wishlist = inject(WishlistStore);
  protected readonly saved = computed(() => this.wishlist.ids().includes(this.product().id));
  /** Quick add only when nothing must be chosen and it's purchasable. */
  protected readonly quickAdd = computed(
    () => this.product().options.length === 0 && this.product().availability !== 'sold-out',
  );
}
