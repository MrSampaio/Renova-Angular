import { Component } from '@angular/core';
import { Botao } from '../../shared/componentes/botao/botao';

@Component({
  imports: [
    Botao
  ],
  selector: 'app-landing-page',
  styleUrl: './landing-page.css',
  templateUrl: './landing-page.html',
})
export class LandingPage {}
