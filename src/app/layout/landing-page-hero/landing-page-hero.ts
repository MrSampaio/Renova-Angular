import { Component } from '@angular/core';
import { Botao } from '../../shared/componentes/botao/botao';

@Component({
  imports: [
    Botao
  ],
  selector: 'app-landing-page-hero',
  styleUrl: './landing-page-hero.css',
  templateUrl: './landing-page-hero.html',
})
export class LandingPageHero {}
