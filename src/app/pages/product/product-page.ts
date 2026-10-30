import { ChangeDetectionStrategy, Component, computed, effect, inject, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CatalogService } from '../../catalog/catalog.service';
import { ProductCard } from '../../shared/product-card';
import { ProductPurchase } from '../../shared/product-purchase';

@Component({
  selector: 'app-product-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ProductCard, ProductPurchase],
  template: `
    @if (catalog.status() === 'loading') {
      <div class="wrap pdp" aria-busy="true"><div class="skeleton"></div><div></div></div>
    } @else if (catalog.status() === 'error') {
      <section class="page-head wrap"><h1 class="display h2">Couldn't load this piece.</h1>
        <p class="back"><button class="btn btn-ghost" type="button" (click)="catalog.load()">Try again</button></p></section>
    } @else if (product(); as p) {
      <div class="wrap pdp">
        <section class="gallery" aria-label="Product images">
          <div class="stage">
            <img [src]="p.images[active()].src" [alt]="p.images[active()].alt" width="1200" height="1200" fetchpriority="high" />
          </div>
          @if (p.images.length > 1) {
            <div class="thumbs" role="group" aria-label="Choose image">
              @for (img of p.images; track img.src; let i = $index) {
                <button type="button" [class.on]="active() === i" (click)="active.set(i)"
                  [attr.aria-pressed]="active() === i" [attr.aria-label]="'Show image ' + (i + 1) + ' of ' + p.images.length">
                  <img [src]="img.src" alt="" width="120" height="120" loading="lazy" />
                </button>
              }
            </div>
          }
        </section>

        <section class="info" aria-labelledby="pdp-title">
          <nav class="crumbs eyebrow" aria-label="Breadcrumb">
            <a routerLink="/shop">Shop</a> / <a [routerLink]="['/collections', p.category]">{{ categoryName() }}</a>
          </nav>
          <h1 id="pdp-title" class="display">{{ p.name }}</h1>
          <p class="desc">{{ p.description }}</p>
          <app-product-purchase [product]="p" />
          <div class="specs">
            <h2 class="eyebrow">Design notes</h2>
            <ul>@for (d of p.details; track d) { <li>{{ d }}</li> }</ul>
            <p class="muted small">Demo product. Materials, dimensions and stock will be confirmed with real product data.</p>
            <p class="small"><a class="link" routerLink="/care">Care guide</a> · <a class="link" routerLink="/shipping-returns">Shipping &amp; returns</a></p>
          </div>
        </section>
      </div>

      @if (related().length) {
        <section class="wrap related" aria-labelledby="rel-title">
          <h2 id="rel-title" class="display h3">Also in {{ categoryName() }}</h2>
          <div class="rel-grid">@for (r of related(); track r.id) { <app-product-card [product]="r" /> }</div>
        </section>
      }
    } @else {
      <section class="page-head wrap">
        <p class="eyebrow">404</p>
        <h1 class="display h2">This piece doesn't exist.</h1>
        <p class="lede">It may have been renamed or removed from the demo catalog.</p>
        <p class="back"><a class="btn btn-ghost" routerLink="/shop">Shop all pieces</a></p>
      </section>
    }
  `,
  styles: `
    .pdp { display: grid; grid-template-columns: 1.2fr 1fr; gap: clamp(32px, 5vw, 88px); padding-top: calc(var(--nav-h) + 56px); padding-bottom: 96px; }
    .skeleton { aspect-ratio: 1; background: var(--surface); }
    .stage { aspect-ratio: 1; background: var(--surface); overflow: hidden; }
    .stage img { width: 100%; height: 100%; object-fit: cover; }
    .thumbs { display: flex; gap: 10px; margin-top: 12px; }
    .thumbs button { padding: 0; border: 1px solid var(--line); background: none; cursor: pointer; width: 88px; height: 88px; opacity: .6; transition: opacity .2s, border-color .2s; }
    .thumbs button.on, .thumbs button:hover { opacity: 1; border-color: var(--silver); }
    .thumbs img { width: 100%; height: 100%; object-fit: cover; }
    .info { position: sticky; top: calc(var(--nav-h) + 40px); align-self: start; display: grid; gap: 24px; }
    .crumbs a { text-decoration: none; } .crumbs a:hover { color: var(--ink); }
    h1 { font-size: clamp(44px, 5vw, 80px); line-height: .95; }
    .desc { color: var(--ink-2); font-size: 17px; max-width: 34em; }
    .specs { border-top: 1px solid var(--line); padding-top: 24px; display: grid; gap: 12px; }
    .specs ul { padding-left: 1.1em; margin: 0; color: var(--ink); }
    .small { font-size: 13px; }
    .back { margin-top: 32px; }
    .related { padding-bottom: 120px; border-top: 1px solid var(--line); padding-top: 72px; }
    .rel-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; margin-top: 40px; }
    @media (max-width: 860px) {
      .pdp { grid-template-columns: 1fr; padding-top: calc(var(--nav-h) + 40px); }
      .info { position: static; }
      .rel-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
  `,
})
export class ProductPage {
  protected readonly catalog = inject(CatalogService);
  readonly slug = input.required<string>();
  protected readonly product = computed(() => this.catalog.getBySlug(this.slug()));
  protected readonly active = linkedSignal({ source: this.slug, computation: () => 0 });
  protected readonly categoryName = computed(() => {
    const p = this.product();
    return p ? (this.catalog.category(p.category)?.name ?? p.category) : '';
  });
  protected readonly related = computed(() => {
    const p = this.product();
    return p ? this.catalog.products().filter((x) => x.category === p.category && x.id !== p.id).slice(0, 3) : [];
  });

  constructor() {
    const title = inject(Title);
    effect(() => {
      const p = this.product();
      if (this.catalog.status() === 'ready') title.setTitle(p ? `${p.name} — RELIK` : 'Not found — RELIK');
    });
  }
}
