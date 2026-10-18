import { Component, signal } from '@angular/core';
import { LandingPage } from './features/landing-page/landing-page';
import { LandingPageFooter } from './layout/landing-page-footer/landing-page-footer';
import { LandingPageNavbar } from './layout/landing-page-navbar/landing-page-navbar';


@Component({
  imports: [
    LandingPage,
    LandingPageNavbar,
    LandingPageFooter

  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Renova-Angular');
}
