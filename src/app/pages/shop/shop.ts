import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CatalogService } from '../../catalog/catalog.service';
import { CATEGORY_IDS, applyFilters, filtersToParams, parseFilters } from '../../catalog/catalog.logic';
import { CategoryId, ShopFilters, SortKey } from '../../core/models';
import { FocusTrap } from '../../shared/focus-trap';
import { Icon } from '../../shared/icon';
import { ProductCard } from '../../shared/product-card';

@Component({
  selector: 'app-shop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgTemplateOutlet, ProductCard, Icon, FocusTrap],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export class Shop {
  protected readonly catalog = inject(CatalogService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);

  /** Route param from /collections/:collection (absent on /shop). */
  readonly collection = input<string>();

  private readonly query = toSignal(this.route.queryParamMap, { requireSync: true });
  protected readonly routeCategory = computed<CategoryId | null>(() => {
    const c = this.collection() as CategoryId | undefined;
    return c && CATEGORY_IDS.includes(c) ? c : null;
  });
  protected readonly unknownCategory = computed(() => !!this.collection() && !this.routeCategory());
  protected readonly filters = computed<ShopFilters>(() => {
    const q = this.query();
    const params = Object.fromEntries(q.keys.map((k) => [k, q.get(k)]));
    return parseFilters(params, this.routeCategory());
  });
  protected readonly results = computed(() => applyFilters(this.catalog.products(), this.filters()));
  protected readonly categoryInfo = computed(() => {
    const c = this.routeCategory();
    return c ? this.catalog.category(c) : undefined;
  });
  protected readonly activeCount = computed(() => {
    const f = this.filters();
    return [f.q, !this.routeCategory() && f.category, f.min != null, f.max != null, f.inStock].filter(Boolean).length;
  });
  protected readonly filtersOpen = signal(false);
  protected readonly sorts: { value: SortKey; label: string }[] = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: low to high' },
    { value: 'price-desc', label: 'Price: high to low' },
    { value: 'name', label: 'Name A–Z' },
  ];

  constructor() {
    // keep the document title meaningful on collection pages
    effect(() => {
      const info = this.categoryInfo();
      this.title.setTitle(info ? `${info.name} — RELIK` : this.unknownCategory() ? 'Not found — RELIK' : 'Shop — RELIK');
    });
  }

  protected update(patch: Partial<ShopFilters>, replaceUrl = false): void {
    const next = { ...this.filters(), ...patch };
    const params = filtersToParams(next, !this.routeCategory());
    if (patch.category !== undefined && this.routeCategory()) {
      // switching category from a collection page moves to that collection
      const target = patch.category ? ['/collections', patch.category] : ['/shop'];
      void this.router.navigate(target, { queryParams: filtersToParams({ ...next, category: null }, false) });
      return;
    }
    void this.router.navigate([], { relativeTo: this.route, queryParams: params, replaceUrl });
  }

  protected price(value: string): number | null {
    const n = Number(value);
    return value.trim() === '' || !Number.isFinite(n) || n < 0 ? null : Math.floor(n);
  }

  protected clear(): void {
    void this.router.navigate([], { relativeTo: this.route, queryParams: {} });
  }
}
