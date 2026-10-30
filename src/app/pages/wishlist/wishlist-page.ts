import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../catalog/catalog.service';
import { ProductCard } from '../../shared/product-card';
import { WishlistStore } from '../../wishlist/wishlist.store';

@Component({
  selector: 'app-wishlist-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ProductCard],
  template: `
    <header class="page-head wrap">
      <p class="eyebrow">Saved</p>
      <h1 class="display h1">Wishlist</h1>
      <p class="lede">Saved on this device only.</p>
    </header>
    <section class="wrap body" aria-label="Saved pieces">
      @if (catalog.status() === 'loading') {
        <p class="muted" aria-busy="true">Loading…</p>
      } @else if (wishlist.products().length) {
        <div class="grid">@for (p of wishlist.products(); track p.id) { <app-product-card [product]="p" /> }</div>
      } @else {
        <div class="empty">
          <p class="display h3">Nothing saved yet.</p>
          <p class="muted">Tap the heart on any piece to keep it here.</p>
          <a class="btn btn-primary" routerLink="/shop">Explore the Collection</a>
        </div>
      }
    </section>
  `,
  styles: `
    .body { padding-top: 48px; padding-bottom: 120px; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 48px 24px; }
    .empty { display: grid; gap: 16px; justify-items: start; }
    @media (max-width: 1000px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 36px 12px; } }
  `,
})
export class WishlistPage {
  protected readonly wishlist = inject(WishlistStore);
  protected readonly catalog = inject(CatalogService);
}
