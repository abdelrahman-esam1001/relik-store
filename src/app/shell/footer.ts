import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <footer class="wrap">
      <div class="top">
        <p class="mark display">RELIK</p>
        <p class="muted line">Sculptural silver for a bold, independent style.</p>
      </div>
      <div class="cols">
        <nav aria-labelledby="f-shop">
          <h2 id="f-shop" class="eyebrow">Shop</h2>
          <ul role="list">
            <li><a routerLink="/shop">All pieces</a></li>
            <li><a routerLink="/collections/chains">Chains</a></li>
            <li><a routerLink="/collections/rings">Rings</a></li>
            <li><a routerLink="/collections/bracelets">Bracelets</a></li>
            <li><a routerLink="/collections/pendants">Pendants</a></li>
          </ul>
        </nav>
        <nav aria-labelledby="f-brand">
          <h2 id="f-brand" class="eyebrow">RELIK</h2>
          <ul role="list">
            <li><a routerLink="/our-story">Our Story</a></li>
            <li><a routerLink="/care">Care Guide</a></li>
            <li><a routerLink="/wishlist">Wishlist</a></li>
          </ul>
        </nav>
        <nav aria-labelledby="f-help">
          <h2 id="f-help" class="eyebrow">Help</h2>
          <ul role="list">
            <li><a routerLink="/contact">Contact</a></li>
            <li><a routerLink="/shipping-returns">Shipping &amp; Returns</a></li>
            <li><a routerLink="/privacy">Privacy (draft)</a></li>
            <li><a routerLink="/terms">Terms (draft)</a></li>
          </ul>
        </nav>
      </div>
      <div class="base">
        <p>© {{ year }} RELIK. Demonstration storefront — products, prices and policies are placeholder content.</p>
      </div>
    </footer>
  `,
  styles: `
    footer { border-top: 1px solid var(--line); padding-top: clamp(56px, 8vw, 110px); padding-bottom: 32px; }
    .top { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: end; gap: 16px 40px; }
    .mark { font-size: clamp(64px, 14vw, 220px); letter-spacing: .12em; line-height: .8; color: var(--ink); }
    .line { max-width: 22em; }
    .cols { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px; margin-top: clamp(48px, 6vw, 88px); }
    ul { margin: 18px 0 0; display: grid; gap: 4px; }
    a { color: var(--ink); text-decoration: none; opacity: .85; display: inline-block; padding: 6px 0; }
    a:hover { opacity: 1; color: var(--silver); }
    .base { border-top: 1px solid var(--line); margin-top: 56px; padding-top: 20px; font-size: 13px; color: var(--ink-2); }
    @media (max-width: 640px) { .cols { grid-template-columns: 1fr 1fr; } }
  `,
})
export class Footer {
  protected readonly year = new Date().getFullYear();
}
