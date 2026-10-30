import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CatalogService } from '../catalog/catalog.service';
import { matchesQuery } from '../catalog/catalog.logic';
import { MoneyPipe } from '../core/money';
import { FocusTrap } from '../shared/focus-trap';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-search-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FocusTrap, Icon, MoneyPipe],
  template: `
    <div class="scrim" (click)="closed.emit()" aria-hidden="true"></div>
    <div class="panel" role="dialog" aria-modal="true" aria-labelledby="search-title" appFocusTrap (escape)="closed.emit()">
      <form class="wrap row" role="search" (submit)="submit($event)">
        <h2 id="search-title" class="sr-only">Search products</h2>
        <label for="q" class="sr-only">Search</label>
        <app-icon name="search" class="lead" />
        <input id="q" type="search" placeholder="Search chains, rings, bracelets…" autocomplete="off" autofocus
          [value]="q()" (input)="q.set($any($event.target).value)" aria-describedby="search-status" />
        <button class="icon-btn" type="button" (click)="closed.emit()" aria-label="Close search"><app-icon name="close" /></button>
      </form>
      <div class="wrap results">
        <p id="search-status" class="eyebrow" aria-live="polite">
          @if (catalog.status() === 'loading') { Loading catalog… }
          @else if (!q().trim()) { Popular: chains, signet, cuff }
          @else { {{ results().length }} {{ results().length === 1 ? 'result' : 'results' }} }
        </p>
        @if (q().trim() && results().length) {
          <ul role="list">
            @for (p of results().slice(0, 6); track p.id) {
              <li>
                <a [routerLink]="['/product', p.slug]">
                  <img [src]="p.images[0].src" alt="" width="64" height="64" loading="lazy" />
                  <span class="name">{{ p.name }}</span>
                  <span class="muted cat">{{ p.category }}</span>
                  <span class="price">{{ p.price | money }}</span>
                </a>
              </li>
            }
          </ul>
          <a class="link all" [routerLink]="['/shop']" [queryParams]="{ q: q().trim() }">See all results</a>
        } @else if (q().trim() && catalog.status() === 'ready') {
          <p class="muted empty">Nothing matches “{{ q().trim() }}”. Try a category like rings or pendants.</p>
        }
      </div>
    </div>
  `,
  styles: `
    :host { position: fixed; inset: 0; z-index: 90; }
    .scrim { position: absolute; inset: 0; background: #000c; animation: fade .25s var(--ease); }
    .panel { position: relative; background: var(--bg); border-bottom: 1px solid var(--line); padding: 20px 0 32px; animation: drop .35s var(--ease); max-height: 90vh; overflow: auto; }
    .row { display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--line-strong); padding-bottom: 12px; }
    .lead { width: 24px; height: 24px; color: var(--ink-2); }
    input { flex: 1; min-width: 0; background: none; border: 0; font-family: var(--display); font-size: clamp(24px, 4vw, 44px); padding: 8px 0; }
    input:focus { outline: none; }
    input::placeholder { color: #6d6a64; }
    .results { padding-top: 20px; }
    ul { margin: 16px 0 20px; display: grid; gap: 2px; }
    li a { display: grid; grid-template-columns: 64px 1fr auto; grid-template-rows: auto auto; column-gap: 16px; align-items: center; text-decoration: none; padding: 8px; border-radius: 4px; }
    li a:hover, li a:focus-visible { background: var(--surface); }
    img { grid-row: span 2; width: 64px; height: 64px; object-fit: cover; border-radius: 2px; background: var(--surface); }
    .name { font-size: 17px; }
    .cat { font-size: 13px; text-transform: capitalize; grid-column: 2; }
    .price { grid-row: 1 / span 2; grid-column: 3; }
    .empty { margin-top: 12px; }
    @keyframes drop { from { transform: translateY(-16px); opacity: 0; } }
    @keyframes fade { from { opacity: 0; } }
  `,
})
export class SearchDialog {
  protected readonly catalog = inject(CatalogService);
  private readonly router = inject(Router);
  readonly closed = output<void>();
  protected readonly q = signal('');
  protected readonly results = computed(() => this.catalog.products().filter((p) => matchesQuery(p, this.q())));

  protected submit(e: Event): void {
    e.preventDefault();
    void this.router.navigate(['/shop'], { queryParams: { q: this.q().trim() || null } });
  }
}
