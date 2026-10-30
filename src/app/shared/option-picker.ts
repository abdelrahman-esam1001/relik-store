import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ProductOption } from '../core/models';

/** Radio-group of option values. Unavailable values stay visible but can't be chosen. */
@Component({
  selector: 'app-option-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let o = option();
    <fieldset [attr.aria-describedby]="error() ? o.id + '-err' : null" [attr.aria-invalid]="!!error()">
      <legend>{{ o.label }} @if (selected()) { <span class="muted">— {{ selected() }}</span> }</legend>
      <div class="values">
        @for (v of o.values; track v.value) {
          <label class="chip" [class.off]="!v.available" [class.on]="selected() === v.value">
            <input type="radio" [name]="name() + '-' + o.id" [value]="v.value" [checked]="selected() === v.value"
              [disabled]="!v.available" (change)="picked.emit(v.value)" />
            <span>{{ v.label }}</span>
            @if (!v.available) { <span class="sr-only">(unavailable)</span> }
          </label>
        }
      </div>
      @if (error()) { <p class="err" [id]="o.id + '-err'" role="alert">{{ error() }}</p> }
    </fieldset>
  `,
  styles: `
    fieldset { border: 0; padding: 0; margin: 0; }
    legend { font-size: 13px; letter-spacing: .06em; color: var(--ink-2); margin-bottom: 12px; padding: 0; }
    .values { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip { position: relative; cursor: pointer; }
    .chip input { position: absolute; opacity: 0; inset: 0; margin: 0; cursor: inherit; }
    .chip span:not(.sr-only) {
      display: inline-grid; place-items: center; min-width: 52px; min-height: 46px; padding: 0 14px;
      border: 1px solid var(--line-strong); border-radius: 2px; font-size: 14px;
      transition: border-color .2s, background-color .2s, color .2s;
    }
    .chip:hover span { border-color: var(--silver); }
    .chip.on span { background: var(--ink); color: #0b0b0b; border-color: var(--ink); }
    .chip input:focus-visible + span { outline: 2px solid var(--silver); outline-offset: 2px; }
    .chip.off { cursor: not-allowed; }
    .chip.off span { color: #5f5c57; border-style: dashed; text-decoration: line-through; }
    .err { color: var(--danger); font-size: 13px; margin-top: 10px; }
  `,
})
export class OptionPicker {
  readonly option = input.required<ProductOption>();
  readonly selected = input<string | undefined>();
  readonly error = input<string | undefined>();
  readonly name = input('opt');
  readonly picked = output<string>();
}
