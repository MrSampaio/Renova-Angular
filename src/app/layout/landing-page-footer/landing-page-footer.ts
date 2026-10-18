import { Component } from '@angular/core';
import { Botao } from '../../shared/componentes/botao/botao';

@Component({
  imports: [
    Botao
  ],
  selector: 'app-landing-page-footer',
  styleUrl: './landing-page-footer.css',
  templateUrl: './landing-page-footer.html',
})
export class LandingPageFooter {}
