import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../cart/cart.store';
import { WishlistStore } from '../wishlist/wishlist.store';
import { FocusTrap } from '../shared/focus-trap';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-mobile-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FocusTrap, Icon],
  template: `
    <div class="scrim" (click)="closed.emit()" aria-hidden="true"></div>
    <div class="panel" role="dialog" aria-modal="true" aria-label="Menu" appFocusTrap (escape)="closed.emit()">
      <div class="top">
        <span class="eyebrow">Menu</span>
        <button class="icon-btn" type="button" (click)="closed.emit()" aria-label="Close menu" autofocus>
          <app-icon name="close" />
        </button>
      </div>
      <nav aria-label="Mobile">
        <ul role="list">
          <li><a routerLink="/shop">Shop all</a></li>
          <li><a routerLink="/collections/chains">Chains</a></li>
          <li><a routerLink="/collections/rings">Rings</a></li>
          <li><a routerLink="/collections/bracelets">Bracelets</a></li>
          <li><a routerLink="/collections/pendants">Pendants</a></li>
          <li><a routerLink="/our-story">Our Story</a></li>
        </ul>
      </nav>
      <div class="foot">
        <a routerLink="/wishlist">Wishlist ({{ wishlist.count() }})</a>
        <a routerLink="/bag">Bag ({{ cart.count() }})</a>
        <a routerLink="/contact">Contact</a>
      </div>
    </div>
  `,
  styles: `
    :host { position: fixed; inset: 0; z-index: 90; }
    .scrim { position: absolute; inset: 0; background: #000a; animation: fade .3s var(--ease); }
    .panel {
      position: absolute; inset: 0 0 0 auto; width: min(100%, 440px);
      background: var(--bg); border-left: 1px solid var(--line);
      display: flex; flex-direction: column; padding: 20px var(--gutter) 32px;
      animation: slide .4s var(--ease);
    }
    .top { display: flex; justify-content: space-between; align-items: center; min-height: 64px; }
    nav { flex: 1; display: flex; align-items: center; }
    ul { margin: 0; display: grid; gap: 6px; }
    nav a { font-family: var(--display); font-size: clamp(34px, 9vw, 48px); line-height: 1.15; text-decoration: none; display: inline-block; padding: 4px 0; }
    nav a:hover { color: var(--silver); }
    .foot { display: flex; flex-wrap: wrap; gap: 8px 24px; border-top: 1px solid var(--line); padding-top: 20px; }
    .foot a { color: var(--ink-2); text-decoration: none; padding: 8px 0; }
    @keyframes slide { from { transform: translateX(40px); opacity: 0; } }
    @keyframes fade { from { opacity: 0; } }
  `,
})
export class MobileMenu {
  protected readonly cart = inject(CartStore);
  protected readonly wishlist = inject(WishlistStore);
  readonly closed = output<void>();
}
