import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/** Fades/lifts an element in once it enters the viewport. CSS handles reduced motion. */
@Directive({ selector: '[appReveal]', host: { class: 'reveal' } })
export class Reveal {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    let io: IntersectionObserver | undefined;
    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) {
        el.classList.add('is-in');
        return;
      }
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add('is-in');
            io?.disconnect();
          }
        },
        { rootMargin: '0px 0px -10% 0px' },
      );
      io.observe(el);
    });
    inject(DestroyRef).onDestroy(() => io?.disconnect());
  }
}
