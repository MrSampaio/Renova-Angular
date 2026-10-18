import { Component } from '@angular/core';
import { LandingPageNavbar } from '../../layout/landing-page-navbar/landing-page-navbar';
import { LandingPageHero } from '../../layout/landing-page-hero/landing-page-hero';

@Component({
  imports: [
    LandingPageNavbar,
    LandingPageHero
  ],
  selector: 'app-landing-page',
  styleUrl: './landing-page.css',
  templateUrl: './landing-page.html',
})
export class LandingPage {}
