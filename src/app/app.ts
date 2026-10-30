import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shell/header';
import { Footer } from './shell/footer';
import { Toast } from './shell/toast';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Header, Footer, Toast],
  template: `
    <a class="skip-link" href="#main">Skip to content</a>
    <app-header />
    <main id="main" tabindex="-1"><router-outlet /></main>
    <app-footer />
    <app-toast />
  `,
  styles: `main { display: block; min-height: 70vh; outline: none; }`,
})
export class App {}
