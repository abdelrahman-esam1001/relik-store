import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <header class="page-head wrap">
      <p class="eyebrow">Contact</p>
      <h1 class="display h1">Talk to us.</h1>
      <p class="lede">Questions about a piece, sizing or an order.</p>
    </header>
    <div class="wrap body">
      <aside class="info">
        <h2 class="eyebrow">Direct</h2>
        <p class="muted">Contact details to be confirmed by the RELIK team before launch.</p>
        <p class="notice"><strong>Demo form.</strong> No message service is connected, so nothing you type here is sent or stored.</p>
      </aside>

      <form [formGroup]="form" (ngSubmit)="submit()" novalidate aria-labelledby="form-h">
        <h2 id="form-h" class="sr-only">Contact form</h2>
        <div class="field">
          <label for="c-name">Name</label>
          <input id="c-name" formControlName="name" autocomplete="name" [attr.aria-invalid]="bad('name')" aria-describedby="c-name-e" />
          @if (bad('name')) { <p id="c-name-e" class="error">Enter your name.</p> }
        </div>
        <div class="field">
          <label for="c-email">Email</label>
          <input id="c-email" type="email" formControlName="email" autocomplete="email" [attr.aria-invalid]="bad('email')" aria-describedby="c-email-e" />
          @if (bad('email')) { <p id="c-email-e" class="error">Enter a valid email address.</p> }
        </div>
        <div class="field">
          <label for="c-topic">Topic</label>
          <select id="c-topic" formControlName="topic">
            <option value="product">A product</option>
            <option value="sizing">Sizing</option>
            <option value="order">An order</option>
            <option value="other">Something else</option>
          </select>
        </div>
        <div class="field">
          <label for="c-msg">Message</label>
          <textarea id="c-msg" formControlName="message" [attr.aria-invalid]="bad('message')" aria-describedby="c-msg-e"></textarea>
          @if (bad('message')) { <p id="c-msg-e" class="error">Write at least 10 characters.</p> }
        </div>
        <button class="btn btn-primary" type="submit">Send message</button>
        <p class="status" role="status" aria-live="polite">
          @if (state() === 'invalid') { <span class="err">Please fix the highlighted fields.</span> }
          @if (state() === 'demo') { <span class="ok">Your message is valid — but this is a demo, so it was <strong>not sent</strong> and nothing was saved.</span> }
        </p>
      </form>
    </div>
  `,
  styles: `
    .body { display: grid; grid-template-columns: 1fr 1.4fr; gap: clamp(32px, 6vw, 96px); padding-top: 56px; padding-bottom: 140px; align-items: start; }
    .info { display: grid; gap: 16px; }
    form { display: grid; gap: 22px; }
    form .btn { justify-self: start; }
    .status { min-height: 24px; font-size: 14px; }
    .err { color: var(--danger); } .ok { color: var(--ok); }
    @media (max-width: 860px) { .body { grid-template-columns: 1fr; } }
  `,
})
export class Contact {
  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email, Validators.pattern(/.+@.+\..+/)]],
    topic: ['product'],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });
  protected readonly state = signal<'idle' | 'invalid' | 'demo'>('idle');
  private readonly submitted = signal(false);

  protected bad(name: 'name' | 'email' | 'message'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || this.submitted());
  }

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.state.set('invalid');
      return;
    }
    this.state.set('demo');
    this.form.reset();
    this.submitted.set(false);
  }
}
