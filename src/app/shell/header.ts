import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { CartStore } from '../cart/cart.store';
import { WishlistStore } from '../wishlist/wishlist.store';
import { Icon } from '../shared/icon';
import { MobileMenu } from './mobile-menu';
import { SearchDialog } from './search-dialog';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Icon, MobileMenu, SearchDialog],
  host: { '(window:scroll)': 'onScroll()' },
  template: `
    <header class="bar" [class.compact]="compact()">
      <div class="glass">
        <a routerLink="/" class="wordmark" aria-label="RELIK, home">RELIK</a>

        <nav class="links" aria-label="Primary">
          <a routerLink="/shop" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Shop</a>
          <a routerLink="/collections/chains" routerLinkActive="active">Collections</a>
          <a routerLink="/our-story" routerLinkActive="active">Our Story</a>
        </nav>

        <div class="tools">
          <button class="icon-btn" type="button" (click)="searchOpen.set(true)" aria-label="Search products">
            <app-icon name="search" />
          </button>
          <a class="icon-btn hide-sm" routerLink="/wishlist" [attr.aria-label]="'Wishlist, ' + wishlist.count() + ' saved'">
            <app-icon name="heart" />
            @if (wishlist.count()) { <span class="dot" aria-hidden="true"></span> }
          </a>
          <a class="icon-btn" routerLink="/bag" [attr.aria-label]="'Shopping bag, ' + cart.count() + (cart.count() === 1 ? ' item' : ' items')">
            <app-icon name="bag" />
            <span class="count" aria-hidden="true">{{ cart.count() }}</span>
          </a>
          <button class="icon-btn menu-btn" type="button" (click)="menuOpen.set(true)" aria-label="Open menu"
            aria-haspopup="dialog" [attr.aria-expanded]="menuOpen()">
            <app-icon name="menu" />
          </button>
        </div>
      </div>
    </header>

    @if (menuOpen()) { <app-mobile-menu (closed)="menuOpen.set(false)" /> }
    @if (searchOpen()) { <app-search-dialog (closed)="searchOpen.set(false)" /> }
  `,
  styles: `
    .bar {
      position: fixed; z-index: 50; left: 0; right: 0; top: 0;
      padding: 16px var(--gutter);
      transition: padding .35s var(--ease);
      pointer-events: none;
    }
    .bar.compact { padding-top: 10px; padding-bottom: 10px; }
    .glass {
      pointer-events: auto;
      max-width: var(--max); margin: 0 auto;
      height: var(--nav-h);
      display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
      padding: 0 10px 0 24px;
      border-radius: 999px;
      background: linear-gradient(180deg, rgba(28,28,28,.62), rgba(14,14,14,.55));
      backdrop-filter: blur(18px) saturate(1.1);
      -webkit-backdrop-filter: blur(18px) saturate(1.1);
      border: 1px solid #ffffff22;
      box-shadow: inset 0 1px 0 #ffffff1f, inset 0 -1px 0 #00000080, 0 10px 30px -12px #000;
      position: relative;
    }
    /* understated metallic hairline along the top edge */
    .glass::before {
      content: ''; position: absolute; left: 12%; right: 12%; top: -1px; height: 1px;
      background: linear-gradient(90deg, transparent, #c7ccd1aa, transparent);
    }
    .wordmark {
      font-family: var(--display); font-size: 22px; letter-spacing: .38em; text-decoration: none;
      justify-self: start; padding: 8px 0;
    }
    .links { display: flex; gap: clamp(20px, 3vw, 44px); }
    .links a {
      font-size: 14px; letter-spacing: .06em; text-decoration: none; color: var(--ink-2);
      padding: 10px 2px; transition: color .2s; position: relative;
    }
    .links a:hover, .links a.active { color: var(--ink); }
    .links a.active::after { content: ''; position: absolute; left: 0; right: 0; bottom: 4px; height: 1px; background: var(--silver); }
    .tools { justify-self: end; display: flex; gap: 2px; align-items: center; }
    .count {
      position: absolute; top: 4px; right: 2px; min-width: 18px; height: 18px; padding: 0 5px;
      border-radius: 9px; background: var(--ink); color: #0b0b0b;
      font-size: 11px; font-weight: 600; line-height: 18px; text-align: center;
    }
    .dot { position: absolute; top: 11px; right: 11px; width: 6px; height: 6px; border-radius: 50%; background: var(--silver); }
    .menu-btn { display: none; }
    @media (max-width: 860px) {
      .glass { grid-template-columns: 1fr auto; padding-left: 20px; }
      .links { display: none; }
      .menu-btn { display: inline-grid; }
      .hide-sm { display: none; }
    }
  `,
})
export class Header {
  protected readonly cart = inject(CartStore);
  protected readonly wishlist = inject(WishlistStore);
  protected readonly compact = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly searchOpen = signal(false);

  constructor() {
    inject(Router)
      .events.pipe(filter((e) => e instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => {
        this.menuOpen.set(false);
        this.searchOpen.set(false);
      });
  }

  protected onScroll(): void {
    this.compact.set(window.scrollY > 24);
  }
}
