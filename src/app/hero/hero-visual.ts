import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild,
} from '@angular/core';
import { HeroRenderer, LOOP, createHeroRenderer } from './hero-renderer';

/**
 * Signature hero artwork. The static image is always present (fallback + LCP);
 * the animated canvas fades in over it when WebGL is ready. Playback pauses when the
 * hero is offscreen or the tab is hidden, and never starts under reduced motion.
 * Framing is fixed by CSS: no zoom, pan or scroll/mouse-driven transforms.
 */
@Component({
  selector: 'app-hero-visual',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <img class="plate" src="hero/base.webp" width="1586" height="992" alt="" fetchpriority="high" decoding="async" />
    <canvas #canvas class="plate" [class.on]="live()" aria-hidden="true"></canvas>
  `,
  styles: `
    :host { position: absolute; inset: 0; display: block; overflow: hidden; background: #000; }
    .plate {
      position: absolute; inset: 0; width: 100%; height: 100%;
      object-fit: cover; object-position: var(--hero-focus, 50% 50%);
    }
    canvas { opacity: 0; transition: opacity .8s ease; }
    canvas.on { opacity: 1; }
  `,
})
export class HeroVisual {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly live = signal(false);

  constructor() {
    let renderer: HeroRenderer | undefined;
    let raf = 0;
    let visible = true;
    let elapsed = 0; // seconds of loop already played; resumes seamlessly after pauses
    let last = 0;
    let io: IntersectionObserver | undefined;
    let disposed = false;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');

    const shouldRun = () => !!renderer && visible && !document.hidden && !reduced.matches;
    const tick = (now: number) => {
      elapsed = (elapsed + Math.min(0.1, (now - last) / 1000)) % LOOP;
      last = now;
      renderer!.render(elapsed);
      raf = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (shouldRun()) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else if (renderer && reduced.matches) {
        renderer.render(0); // static frame, identical to the plate
      }
    };

    afterNextRender(() => {
      createHeroRenderer(this.canvas().nativeElement)
        .then((r) => {
          if (disposed) return r.dispose();
          renderer = r;
          r.render(0);
          this.live.set(true);
          sync();
        })
        .catch(() => {
          /* WebGL or asset failure: the static <img> remains as the hero */
        });

      io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        sync();
      });
      io.observe(this.host);
      document.addEventListener('visibilitychange', sync);
      reduced.addEventListener('change', sync);
    });

    inject(DestroyRef).onDestroy(() => {
      disposed = true;
      cancelAnimationFrame(raf);
      io?.disconnect();
      document.removeEventListener('visibilitychange', sync);
      reduced.removeEventListener('change', sync);
      renderer?.dispose();
    });
  }
}
