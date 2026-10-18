import { Component } from '@angular/core';
import { Botao } from '../../shared/componentes/botao/botao';

@Component({
  imports: [Botao],
  selector: 'app-landing-page-navbar',
  styleUrl: './landing-page-navbar.css',
  templateUrl: './landing-page-navbar.html',
})
export class LandingPageNavbar {}
