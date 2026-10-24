import { Component } from '@angular/core';
import { Valores } from '../../shared/components/valores/valores';
import { Passos } from '../../shared/components/passos/passos';


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
