import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../cart/cart.store';
import { validateSelection } from '../../cart/cart.logic';
import { CatalogService } from '../../catalog/catalog.service';
import { CartLine, Product } from '../../core/models';
import { MoneyPipe } from '../../core/money';
import { Icon } from '../../shared/icon';
import { QtyStepper } from '../../shared/qty-stepper';

@Component({
  selector: 'app-bag-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MoneyPipe, Icon, QtyStepper],
  template: `
    <header class="page-head wrap">
      <p class="eyebrow">Your selection</p>
      <h1 class="display h1">Bag</h1>
    </header>

    <div class="wrap body">
      @if (catalog.status() === 'loading') {
        <p class="muted" aria-busy="true">Loading your bag…</p>
      } @else if (!cart.lines().length) {
        <div class="empty">
          <p class="display h3">Your bag is empty.</p>
          <p class="muted">Pieces you add will stay here, even after a refresh.</p>
          <a class="btn btn-primary" routerLink="/shop">Explore the Collection <app-icon name="arrow" /></a>
        </div>
      } @else {
        <div class="layout">
          <ul class="lines" role="list" aria-label="Items in your bag">
            @for (l of cart.resolved(); track l.key) {
              <li class="line">
                @if (l.product; as p) {
                  <a class="thumb" [routerLink]="['/product', p.slug]">
                    <img [src]="p.images[0].src" [alt]="p.images[0].alt" width="160" height="160" loading="lazy" />
                  </a>
                  <div class="meta">
                    <h2 class="name"><a [routerLink]="['/product', p.slug]">{{ p.name }}</a></h2>
                    @for (o of optionLabels(p, l); track o) { <p class="muted opt">{{ o }}</p> }
                    <p class="muted opt">{{ p.price | money }} each</p>
                    @if (problem(p, l); as msg) { <p class="warn" role="alert">{{ msg }}</p> }
                  </div>
                  <div class="act">
                    <app-qty-stepper [value]="l.quantity" [label]="lineLabel(p, l)" (changed)="cart.setQuantity(l.key, $event)" />
                    <p class="total" [attr.aria-label]="'Line total ' + (l.lineTotal | money)">{{ l.lineTotal | money }}</p>
                    <button class="icon-btn" type="button" (click)="cart.remove(l.key)" [attr.aria-label]="'Remove ' + lineLabel(p, l) + ' from bag'"><app-icon name="trash" /></button>
                  </div>
                } @else {
                  <div class="meta"><p class="warn">This item is no longer in the catalog.</p></div>
                  <div class="act"><button class="btn btn-ghost" type="button" (click)="cart.remove(l.key)">Remove</button></div>
                }
              </li>
            }
          </ul>

          <aside class="summary" aria-labelledby="sum-title">
            <h2 id="sum-title" class="eyebrow">Summary</h2>
            <dl>
              <div><dt>Items</dt><dd>{{ cart.count() }}</dd></div>
              <div class="sub"><dt>Subtotal</dt><dd>{{ cart.subtotal() | money }}</dd></div>
            </dl>
            <p class="muted small">Shipping and taxes would be calculated at checkout. Prices are demo values.</p>
            @if (cart.blocked().length) {
              <p class="warn small">Remove unavailable items to continue.</p>
            }
            <a class="btn btn-primary btn-block" routerLink="/checkout" [attr.aria-disabled]="cart.blocked().length > 0"
              (click)="cart.blocked().length && $event.preventDefault()">Continue to checkout demo</a>
            <a class="link small" routerLink="/shop">Keep shopping</a>
          </aside>
        </div>
      }
    </div>
  `,
  styles: `
    .body { padding-top: 40px; padding-bottom: 120px; }
    .empty { display: grid; gap: 16px; justify-items: start; }
    .layout { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: clamp(32px, 5vw, 80px); align-items: start; }
    .lines { margin: 0; border-top: 1px solid var(--line); }
    .line { display: grid; grid-template-columns: 120px minmax(0, 1fr) auto; gap: 24px; padding: 24px 0; border-bottom: 1px solid var(--line); align-items: start; }
    .thumb img { width: 120px; height: 120px; object-fit: cover; background: var(--surface); }
    .name { font-family: var(--display); font-weight: 400; font-size: 24px; line-height: 1.1; margin-bottom: 8px; }
    .name a { text-decoration: none; }
    .opt { font-size: 14px; }
    .warn { color: var(--danger); font-size: 14px; margin-top: 8px; }
    .act { display: grid; justify-items: end; gap: 10px; }
    .total { font-size: 18px; font-variant-numeric: tabular-nums; }
    .summary { position: sticky; top: calc(var(--nav-h) + 40px); background: var(--surface); padding: 28px; display: grid; gap: 18px; border: 1px solid var(--line); }
    dl { margin: 0; display: grid; gap: 10px; }
    dl div { display: flex; justify-content: space-between; }
    dt { color: var(--ink-2); } dd { margin: 0; font-variant-numeric: tabular-nums; }
    .sub { border-top: 1px solid var(--line); padding-top: 12px; font-size: 20px; }
    .sub dt { color: var(--ink); }
    .small { font-size: 13px; }
    .link { justify-self: center; }
    @media (max-width: 900px) {
      .layout { grid-template-columns: 1fr; }
      .summary { position: static; }
    }
    @media (max-width: 560px) {
      .line { grid-template-columns: 88px minmax(0, 1fr); }
      .thumb img { width: 88px; height: 88px; }
      .act { grid-column: 1 / -1; grid-auto-flow: column; justify-content: space-between; align-items: center; }
    }
  `,
})
export class BagPage {
  protected readonly cart = inject(CartStore);
  protected readonly catalog = inject(CatalogService);

  protected optionLabels(p: Product, l: CartLine): string[] {
    return p.options.filter((o) => l.options[o.id]).map((o) => `${o.label}: ${l.options[o.id]}`);
  }

  /** Name plus options, so controls for two variants of one product are distinguishable. */
  protected lineLabel(p: Product, l: CartLine): string {
    const opts = Object.values(l.options).join(', ');
    return opts ? `${p.name} (${opts})` : p.name;
  }

  protected problem(p: Product, l: CartLine): string | undefined {
    return validateSelection(p, l.options)[0]?.message;
  }
}
