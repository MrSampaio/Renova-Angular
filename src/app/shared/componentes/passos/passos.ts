import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-passos',
  styleUrl: './passos.css',
  templateUrl: './passos.html',
})
export class Passos {
  @Input() numero: string = ''
  @Input() icone: string = ''
  @Input() titulo: string = ''
  @Input() legenda: string = ''
  @Input() temSeta: boolean = false
}
