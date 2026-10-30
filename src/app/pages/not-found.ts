import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="wrap nf">
      <p class="eyebrow">404</p>
      <h1 class="display">Nothing<br />remains here.</h1>
      <p class="lede muted">The page you're looking for doesn't exist or has moved.</p>
      <div class="ctas">
        <a class="btn btn-primary" routerLink="/">Back home</a>
        <a class="btn btn-ghost" routerLink="/shop">Shop all pieces</a>
      </div>
    </section>
  `,
  styles: `
    .nf { min-height: 80vh; padding-top: calc(var(--nav-h) + 120px); padding-bottom: 120px; display: grid; align-content: center; gap: 24px; }
    h1 { font-size: clamp(56px, 11vw, 180px); line-height: .88; }
    .ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px; }
  `,
})
export class NotFound {}
