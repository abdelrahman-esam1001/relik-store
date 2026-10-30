import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reveal } from '../../shared/reveal';

@Component({
  selector: 'app-story',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Reveal],
  template: `
    <header class="page-head wrap">
      <p class="eyebrow">Our Story</p>
      <h1 class="display h1">What remains<br />is character.</h1>
    </header>
    <section class="wrap intro">
      <p class="big display" appReveal>RELIK makes sculptural silver jewelry for people who dress to be recognised, not to fit in.</p>
      <div class="cols" appReveal>
        <p class="lede">The idea is simple: jewelry should have weight — visually and in how it makes you feel. We design pieces with strong silhouettes and deliberate contrast, then strip away anything that doesn't earn its place.</p>
        <p class="lede">Chains, rings, bracelets and pendants, each drawn as an object first. Dark, confident, slightly rebellious — and made to be worn every day, not saved for occasions.</p>
      </div>
    </section>
    <figure class="wide">
      <img src="products/link-chain-photo.webp" alt="Chunky silver oval-link chain against a dark background" width="1200" height="1200" loading="lazy" />
    </figure>
    <section class="wrap principles" aria-labelledby="pr-h">
      <h2 id="pr-h" class="eyebrow">What we hold to</h2>
      <dl>
        <div appReveal><dt class="display">Presence over polish.</dt><dd class="muted">A piece should change how an outfit reads.</dd></div>
        <div appReveal><dt class="display">Fewer, stronger pieces.</dt><dd class="muted">A tight collection where every form has a reason.</dd></div>
        <div appReveal><dt class="display">Worn, not kept.</dt><dd class="muted">Designed for daily wear, and for the marks that come with it.</dd></div>
      </dl>
      <p class="note muted">Brand copy for this prototype. Founding details, sourcing and production information to be added by the RELIK team.</p>
      <a class="btn btn-primary" routerLink="/shop">Explore the Collection</a>
    </section>
  `,
  styles: `
    .intro { padding-top: 72px; display: grid; gap: 56px; }
    .big { font-size: clamp(30px, 3.6vw, 56px); line-height: 1.08; max-width: 20em; }
    .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
    .cols .lede { color: var(--ink-2); }
    .wide { margin: clamp(72px, 10vw, 140px) 0; height: clamp(320px, 60vh, 640px); overflow: hidden; }
    .wide img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 40%; }
    .principles { padding-bottom: 140px; display: grid; gap: 40px; justify-items: start; }
    dl { margin: 0; width: 100%; display: grid; border-top: 1px solid var(--line); }
    dl div { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 28px 0; border-bottom: 1px solid var(--line); align-items: baseline; }
    dt { font-size: clamp(26px, 3vw, 44px); line-height: 1.05; }
    dd { margin: 0; }
    .note { font-size: 13px; }
    @media (max-width: 760px) { .cols, dl div { grid-template-columns: 1fr; } }
  `,
})
export class Story {}
