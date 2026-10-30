import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MAX_QTY } from '../cart/cart.logic';
import { Icon } from './icon';

@Component({
  selector: 'app-qty-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <div class="stepper" role="group" [attr.aria-label]="'Quantity for ' + label()">
      <button type="button" class="icon-btn" (click)="changed.emit(value() - 1)" [disabled]="value() <= min()"
        [attr.aria-label]="'Decrease quantity of ' + label()"><app-icon name="minus" /></button>
      <output aria-live="polite" [attr.aria-label]="'Quantity ' + value()">{{ value() }}</output>
      <button type="button" class="icon-btn" (click)="changed.emit(value() + 1)" [disabled]="value() >= max"
        [attr.aria-label]="'Increase quantity of ' + label()"><app-icon name="plus" /></button>
    </div>
  `,
  styles: `
    .stepper { display: inline-flex; align-items: center; border: 1px solid var(--line-strong); border-radius: 999px; }
    output { min-width: 32px; text-align: center; font-variant-numeric: tabular-nums; }
    button[disabled] { opacity: .35; cursor: not-allowed; }
  `,
})
export class QtyStepper {
  readonly value = input.required<number>();
  readonly label = input.required<string>();
  readonly min = input(1);
  readonly changed = output<number>();
  protected readonly max = MAX_QTY;
}
