import { Component, signal } from '@angular/core';
import { LandingPage } from './features/landing-page/landing-page';
import { LandingPageFooter } from './layout/landing-page-footer/landing-page-footer';
import { LandingPageNavbar } from './layout/landing-page-navbar/landing-page-navbar';
import { RouterOutlet } from '@angular/router'; // 1. Importe o RouterOutlet

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // 2. Coloque-o nos imports
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'renova-frontend';
}
