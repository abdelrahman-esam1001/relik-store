import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../cart/cart.store';
import { CatalogService } from '../../catalog/catalog.service';
import { MoneyPipe } from '../../core/money';

/** Order summary only. Deliberately collects no personal or payment data. */
@Component({
  selector: 'app-checkout-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MoneyPipe],
  template: `
    <header class="page-head wrap">
      <span class="draft-banner">Demonstration</span>
      <h1 class="display h2">Checkout</h1>
      <p class="lede">This is a prototype. No payment is taken and no order is placed — this page only shows what an order summary would look like.</p>
    </header>

    <div class="wrap body">
      @if (catalog.status() === 'loading') {
        <p class="muted">Loading…</p>
      } @else if (!cart.lines().length) {
        <div class="empty">
          <p class="display h3">Nothing to check out.</p>
          <a class="btn btn-primary" routerLink="/shop">Explore the Collection</a>
        </div>
      } @else {
        <div class="layout">
          <section aria-labelledby="sum-h">
            <h2 id="sum-h" class="eyebrow">Order summary</h2>
            <table>
              <caption class="sr-only">Items in this demo order</caption>
              <thead><tr><th scope="col">Item</th><th scope="col">Qty</th><th scope="col" class="num">Total</th></tr></thead>
              <tbody>
                @for (l of cart.resolved(); track l.key) {
                  <tr>
                    <td>{{ l.product?.name ?? 'Unavailable item' }}
                      @if (optionText(l.options); as t) { <span class="muted"> — {{ t }}</span> }</td>
                    <td>{{ l.quantity }}</td>
                    <td class="num">{{ l.lineTotal | money }}</td>
                  </tr>
                }
              </tbody>
              <tfoot>
                <tr><th scope="row" colspan="2">Subtotal</th><td class="num">{{ cart.subtotal() | money }}</td></tr>
                <tr class="muted"><th scope="row" colspan="2">Shipping &amp; taxes</th><td class="num">Not calculated</td></tr>
              </tfoot>
            </table>
          </section>

          <aside class="notice what" aria-labelledby="next-h">
            <h2 id="next-h"><strong>What a live checkout needs</strong></h2>
            <ul>
              <li>A payment provider (e.g. a hosted, PCI-compliant checkout).</li>
              <li>An order service to reserve stock and record orders.</li>
              <li>Real shipping rates, taxes and approved policies.</li>
            </ul>
            <p>Your bag is untouched — nothing has been submitted.</p>
            <a class="btn btn-ghost" routerLink="/bag">Back to bag</a>
          </aside>
        </div>
      }
    </div>
  `,
  styles: `
    .page-head .h2 { margin-top: 20px; }
    .body { padding-top: 40px; padding-bottom: 120px; }
    .empty { display: grid; gap: 16px; justify-items: start; }
    .layout { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: clamp(32px, 5vw, 80px); align-items: start; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-variant-numeric: tabular-nums; }
    th, td { text-align: left; padding: 14px 8px 14px 0; border-bottom: 1px solid var(--line); font-weight: 400; vertical-align: top; }
    thead th { font-size: 12px; letter-spacing: .18em; text-transform: uppercase; color: var(--ink-2); }
    .num { text-align: right; padding-right: 0; }
    tfoot th, tfoot td { border-bottom: 0; }
    tfoot tr:first-child th, tfoot tr:first-child td { font-size: 20px; padding-top: 20px; }
    .what { display: grid; gap: 14px; }
    .what h2 { font-size: 16px; font-weight: 400; }
    .what ul { margin: 0; padding-left: 1.1em; }
    .what .btn { justify-self: start; }
    @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } }
  `,
})
export class CheckoutPage {
  protected readonly cart = inject(CartStore);
  protected readonly catalog = inject(CatalogService);

  protected optionText(o: Record<string, string>): string {
    return Object.values(o).join(', ');
  }
}
