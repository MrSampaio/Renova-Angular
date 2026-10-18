import { Component } from '@angular/core';
import { Valores } from '../../shared/componentes/valores/valores';
import { Passos } from '../../shared/componentes/passos/passos';


@Component({
  imports: [
    Valores,
    Passos
  ],
  selector: 'app-landing-page-infos-section',
  styleUrl: './landing-page-infos-section.css',
  templateUrl: './landing-page-infos-section.html',
})
export class LandingPageInfosSection {}
