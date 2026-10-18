import { Component } from '@angular/core';
import { LandingPageNavbar } from '../../layout/landing-page-navbar/landing-page-navbar';
import { LandingPageHero } from '../../layout/landing-page-hero/landing-page-hero';
import { LandingPageInfosSection } from '../../layout/landing-page-infos-section/landing-page-infos-section';

@Component({
  imports: [
    LandingPageNavbar,
    LandingPageHero,
    LandingPageInfosSection
  ],
  selector: 'app-landing-page',
  styleUrl: './landing-page.css',
  templateUrl: './landing-page.html',
})
export class LandingPage {}
