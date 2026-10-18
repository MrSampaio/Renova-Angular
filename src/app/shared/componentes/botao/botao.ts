import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  standalone: true,
  selector: 'app-botao',
  styleUrl: './botao.css',
  templateUrl: './botao.html',
})
export class Botao {
  // o texto que vai aparecer no botão
  @Input() texto: string = 'Clique aqui';

  // // recebe a cor ou estilo (ex: 'primary', 'danger', 'success')
  // @Input() variante: string = 'primary';

  @Input() btnClass: string = '';

  @Input() icone: string = ''
  // define se o botão está bloqueado
  @Input() desabilitado: boolean = false;

  // emite um evento para o componente pai quando clicado
  @Output() acaoClique = new EventEmitter<void>();

  aoClicar() {
    if (!this.desabilitado) {
      this.acaoClique.emit();
    }
  }
}
