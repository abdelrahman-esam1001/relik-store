import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

type State = 'idle' | 'invalid' | 'demo-ok';

/** No newsletter backend is connected, so a valid submission is acknowledged as a demo only. */
@Component({
  selector: 'app-newsletter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <div class="nl">
      <div>
        <p class="eyebrow">Letters</p>
        <h2 id="nl-title" class="display h3">First to know.<br />Rarely in your inbox.</h2>
      </div>
      <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div class="field">
          <label for="nl-email">Email address</label>
          <div class="row">
            <input id="nl-email" type="email" formControlName="email" autocomplete="email"
              [attr.aria-invalid]="state() === 'invalid'" aria-describedby="nl-msg nl-note" />
            <button class="btn btn-primary" type="submit">Sign up</button>
          </div>
        </div>
        <p id="nl-msg" class="msg" role="status" aria-live="polite">
          @switch (state()) {
            @case ('invalid') { <span class="err">Enter a valid email address, like name&#64;example.com.</span> }
            @case ('demo-ok') { <span class="ok">Looks good — but this is a demo. No newsletter service is connected, so your email was not saved or sent anywhere.</span> }
          }
        </p>
        <p id="nl-note" class="muted note">Demo form: nothing you enter here is stored.</p>
      </form>
    </div>
  `,
  styles: `
    .nl { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: end; border-top: 1px solid var(--line); padding-top: 56px; }
    .row { display: flex; gap: 10px; }
    .row input { flex: 1; min-width: 0; }
    .msg { min-height: 24px; margin-top: 12px; font-size: 14px; }
    .err { color: var(--danger); }
    .ok { color: var(--ok); }
    .note { font-size: 12px; margin-top: 6px; }
    .h3 { margin-top: 14px; }
    @media (max-width: 760px) { .nl { grid-template-columns: 1fr; } .row { flex-direction: column; } }
  `,
})
export class Newsletter {
  protected readonly form = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email, Validators.pattern(/.+@.+\..+/)]],
  });
  protected readonly state = signal<State>('idle');

  constructor() {
    this.form.valueChanges.subscribe(() => this.state() === 'invalid' && this.form.valid && this.state.set('idle'));
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.state.set('invalid');
      return;
    }
    this.state.set('demo-ok');
    this.form.reset();
  }
}
