import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  standalone: true,
  selector: 'app-button',
  styleUrl: './button.css',
  templateUrl: './button.html',
})
export class Button {
  // o texto que vai aparecer no botão
  @Input() text: string = 'Clique aqui';

  // // recebe a cor ou estilo (ex: 'primary', 'danger', 'success')
  // @Input() variante: string = 'primary';

  @Input() btnClass: string = '';

  @Input() icon: string = ''
  // define se o botão está bloqueado
  @Input() disabled: boolean = false;

  // emite um evento para o componente pai quando clicado
  @Output() onClick = new EventEmitter<any>();

  onClickEvent() {
    if (!this.disabled) {
      this.onClick.emit();
    }
  }
}
