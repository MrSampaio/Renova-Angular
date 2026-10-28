import { Component } from '@angular/core';
import { Button } from '../../shared/components/button/button';
import { Router } from '@angular/router';

@Component({
  imports: [
    Button
  ],
  selector: 'app-landing-page-hero',
  styleUrl: './landing-page-hero.css',
  templateUrl: './landing-page-hero.html',
})
export class LandingPageHero {
   constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
