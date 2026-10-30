import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { CatalogService } from '../../catalog/catalog.service';
import { HeroVisual } from '../../hero/hero-visual';
import { Icon } from '../../shared/icon';
import { ProductCard } from '../../shared/product-card';
import { ProductPurchase } from '../../shared/product-purchase';
import { Reveal } from '../../shared/reveal';
import { Newsletter } from './newsletter';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, HeroVisual, Icon, ProductCard, ProductPurchase, Reveal, Newsletter],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly catalog = inject(CatalogService);
  protected readonly spotlight = computed(() => this.catalog.getBySlug('vertebra-link-chain'));
  private readonly heroCopy = viewChild.required<ElementRef<HTMLElement>>('heroCopy');

  constructor() {
    let ctx: gsap.Context | undefined;
    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      // Short staggered entrance for the hero copy only; the artwork never moves.
      ctx = gsap.context(() => {
        gsap.from('[data-in]', { y: 28, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.09, delay: 0.15 });
      }, this.heroCopy().nativeElement);
    });
    inject(DestroyRef).onDestroy(() => ctx?.revert());
  }
}
