import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastService } from '../shared/toast.service';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  template: `
    <div class="region" role="status" aria-live="polite">
      @if (toast.current(); as t) {
        <div class="toast" [attr.data-id]="t.id">
          <span>{{ t.message }}</span>
          @if (t.action) { <a class="link" [routerLink]="t.action.link" (click)="toast.dismiss()">{{ t.action.label }}</a> }
          <button class="icon-btn" type="button" (click)="toast.dismiss()" aria-label="Dismiss notification"><app-icon name="close" /></button>
        </div>
      }
    </div>
  `,
  styles: `
    .region { position: fixed; z-index: 95; left: 50%; bottom: 24px; transform: translateX(-50%); width: min(calc(100% - 32px), 560px); }
    .toast {
      display: flex; align-items: center; gap: 16px; padding: 8px 8px 8px 20px;
      background: rgba(21,21,21,.92); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
      border: 1px solid var(--line-strong); border-radius: 999px; font-size: 14px;
      box-shadow: 0 20px 40px -20px #000;
      animation: up .35s var(--ease);
    }
    span { flex: 1; }
    a { white-space: nowrap; font-size: 14px; }
    @keyframes up { from { transform: translateY(12px); opacity: 0; } }
  `,
})
export class Toast {
  protected readonly toast = inject(ToastService);
}
