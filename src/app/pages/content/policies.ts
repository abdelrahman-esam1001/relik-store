import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

const draftNotice = `
  <p class="notice"><strong>Draft — not an active policy.</strong> Placeholder text for layout only. It must be written or approved by the RELIK team (and legal counsel where required) before launch.</p>`;

const styles = `
  .body { padding-top: 48px; padding-bottom: 140px; display: grid; gap: 32px; }
  .page-head .h2 { margin-top: 18px; }
`;

@Component({
  selector: 'app-shipping-returns',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <header class="page-head wrap"><span class="draft-banner">Draft</span><h1 class="display h2">Shipping &amp; Returns</h1></header>
    <div class="wrap body">
      ${draftNotice}
      <div class="prose">
        <h2>Shipping</h2>
        <p>Delivery regions, carriers, timeframes and costs: <em>to be confirmed.</em> No delivery promises are made by this prototype.</p>
        <h3>Questions to settle before launch</h3>
        <ul><li>Which countries do you ship to?</li><li>Flat rate, calculated rates or free over a threshold?</li><li>Dispatch time for in-stock pieces?</li></ul>
        <h2>Returns &amp; exchanges</h2>
        <p>Return window, condition requirements, exchange process and who pays return shipping: <em>to be confirmed.</em></p>
        <p>Questions in the meantime? <a routerLink="/contact">Contact us</a>.</p>
      </div>
    </div>`,
  styles,
})
export class ShippingReturns {}

@Component({
  selector: 'app-care-guide',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head wrap"><p class="eyebrow">Care</p><h1 class="display h2">Care Guide</h1>
      <p class="lede">General guidance for silver-tone jewelry. Piece-specific care will follow confirmed material details.</p></header>
    <div class="wrap body">
      <div class="prose">
        <h2>Everyday</h2>
        <ul>
          <li>Put jewelry on last — after perfume, lotion and hairspray.</li>
          <li>Take it off for swimming, the gym and cleaning with chemicals.</li>
          <li>Wipe with a soft, dry cloth after wearing.</li>
        </ul>
        <h2>Storage</h2>
        <ul>
          <li>Store pieces separately so they don't scratch each other.</li>
          <li>Keep them dry, away from humidity and direct sunlight.</li>
          <li>Lay chains flat or hang them to avoid knots.</li>
        </ul>
        <h2>Cleaning</h2>
        <p>Use a soft cloth intended for jewelry. Avoid abrasive pastes on textured or oxidised surfaces — they can remove the contrast that defines the design. When unsure, ask before cleaning.</p>
      </div>
    </div>`,
  styles,
})
export class CareGuide {}

@Component({
  selector: 'app-privacy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head wrap"><span class="draft-banner">Draft</span><h1 class="display h2">Privacy Policy</h1></header>
    <div class="wrap body">
      ${draftNotice}
      <div class="prose">
        <h2>What this prototype stores</h2>
        <p>Your bag and wishlist are saved in your browser's local storage on this device only. They are not sent to any server. Clearing your browser data removes them.</p>
        <p>The newsletter and contact forms are demonstrations: they validate input but do not send or store it.</p>
        <h2>To be completed before launch</h2>
        <ul><li>Data controller and contact details</li><li>What personal data is collected and why</li><li>Processors (payments, email, analytics, hosting)</li><li>Retention, user rights and cookie choices</li></ul>
      </div>
    </div>`,
  styles,
})
export class Privacy {}

@Component({
  selector: 'app-terms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head wrap"><span class="draft-banner">Draft</span><h1 class="display h2">Terms of Sale</h1></header>
    <div class="wrap body">
      ${draftNotice}
      <div class="prose">
        <h2>Current status</h2>
        <p>This site is a demonstration. Products, prices and availability are placeholders, and no orders can be placed.</p>
        <h2>To be completed before launch</h2>
        <ul><li>Seller identity and registered details</li><li>Pricing, taxes and currency</li><li>Order acceptance and cancellation</li><li>Delivery, returns and warranty terms</li><li>Governing law</li></ul>
      </div>
    </div>`,
  styles,
})
export class Terms {}
