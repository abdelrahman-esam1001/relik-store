import { Routes } from '@angular/router';

const page = (title: string) => `${title} — RELIK`;

export const routes: Routes = [
  { path: '', title: 'RELIK — Sculptural Silver Jewelry', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'shop', title: page('Shop'), loadComponent: () => import('./pages/shop/shop').then((m) => m.Shop) },
  { path: 'collections/:collection', title: page('Collection'), loadComponent: () => import('./pages/shop/shop').then((m) => m.Shop) },
  { path: 'collections', redirectTo: 'collections/chains', pathMatch: 'full' },
  { path: 'product/:slug', title: page('Product'), loadComponent: () => import('./pages/product/product-page').then((m) => m.ProductPage) },
  { path: 'wishlist', title: page('Wishlist'), loadComponent: () => import('./pages/wishlist/wishlist-page').then((m) => m.WishlistPage) },
  { path: 'bag', title: page('Bag'), loadComponent: () => import('./pages/bag/bag-page').then((m) => m.BagPage) },
  { path: 'checkout', title: page('Checkout demo'), loadComponent: () => import('./pages/checkout/checkout-page').then((m) => m.CheckoutPage) },
  { path: 'our-story', title: page('Our Story'), loadComponent: () => import('./pages/content/story').then((m) => m.Story) },
  { path: 'contact', title: page('Contact'), loadComponent: () => import('./pages/content/contact').then((m) => m.Contact) },
  { path: 'shipping-returns', title: page('Shipping & Returns'), loadComponent: () => import('./pages/content/policies').then((m) => m.ShippingReturns) },
  { path: 'care', title: page('Care Guide'), loadComponent: () => import('./pages/content/policies').then((m) => m.CareGuide) },
  { path: 'privacy', title: page('Privacy (draft)'), loadComponent: () => import('./pages/content/policies').then((m) => m.Privacy) },
  { path: 'terms', title: page('Terms (draft)'), loadComponent: () => import('./pages/content/policies').then((m) => m.Terms) },
  { path: '**', title: page('Not found'), loadComponent: () => import('./pages/not-found').then((m) => m.NotFound) },
];
