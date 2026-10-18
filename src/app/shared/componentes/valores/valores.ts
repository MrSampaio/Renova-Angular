import { Input, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-valores',
  styleUrl: './valores.css',
  templateUrl: './valores.html',
})

export class Valores {
  @Input() icone: string = ''
  @Input() titulo: string = ''
  @Input() legenda: string = ''
}
