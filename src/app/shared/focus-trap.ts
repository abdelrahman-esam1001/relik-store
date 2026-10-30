import { DestroyRef, Directive, ElementRef, afterNextRender, inject, output } from '@angular/core';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab inside the host, closes on Escape, and restores focus to whatever
 * opened the overlay when the host is destroyed.
 */
@Directive({ selector: '[appFocusTrap]', host: { '(keydown)': 'onKey($event)' } })
export class FocusTrap {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly opener = document.activeElement as HTMLElement | null;
  readonly escape = output<void>();

  constructor() {
    afterNextRender(() => {
      const target = this.el.nativeElement.querySelector<HTMLElement>('[autofocus]') ?? this.items()[0];
      target?.focus();
    });
    inject(DestroyRef).onDestroy(() => {
      if (this.opener?.isConnected) this.opener.focus();
    });
  }

  private items(): HTMLElement[] {
    return [...this.el.nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((e) => e.offsetParent !== null);
  }

  protected onKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      e.stopPropagation();
      this.escape.emit();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = this.items();
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}
