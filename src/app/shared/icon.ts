import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const PATHS = {
  search: ['M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z', 'm15.5 15.5 5 5'],
  heart: ['M12 20s-7.5-4.6-7.5-10.1A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z'],
  bag: ['M5 8h14l-1 12.5H6z', 'M9 10V7a3 3 0 0 1 6 0v3'],
  menu: ['M4 8h16M4 16h16'],
  close: ['m6 6 12 12M18 6 6 18'],
  arrow: ['M4 12h15m-5-5 5 5-5 5'],
  minus: ['M6 12h12'],
  plus: ['M12 6v12M6 12h12'],
  trash: ['M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13'],
} as const;

export type IconName = keyof typeof PATHS;

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    @for (d of paths(); track $index) { <path [attr.d]="d" /> }
  </svg>`,
  styles: `:host { display: inline-flex; width: 20px; height: 20px; } svg { width: 100%; height: 100%; }
    :host(.filled) path { fill: currentColor; }`,
})
export class Icon {
  readonly name = input.required<IconName>();
  protected readonly paths = computed(() => PATHS[this.name()]);
}
