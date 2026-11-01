import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Button } from '../button/button';
import { Product } from '../../interfaces/product-model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgOptimizedImage,
    Button,
  ],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  @Input({ required: true }) Product!: Product;

  @Output() addToCart = new EventEmitter<Product>();

  imageHasError = false;

  get isAvailable(): boolean {
    return this.Product.status === 'AVAILABLE';
  }

  get buttonText(): string {
    switch (this.Product.status) {
      case 'RESERVED':
        return 'Peça reservada';

      case 'SOLD':
        return 'Peça vendida';

      default:
        return 'Adicionar ao carrinho';
    }
  }

  get buttonIcon(): string {
    return this.isAvailable
      ? 'fa-solid fa-cart-shopping'
      : 'fa-solid fa-lock';
  }

  get buttonClass(): string {
    const baseClass =
      'min-h-12 rounded-xl px-4 py-3 text-sm sm:text-base text-white shadow-sm';

    if (!this.isAvailable) {
      return `${baseClass} cursor-not-allowed bg-slate-400 opacity-70`;
    }

    return `${baseClass} bg-renova-primaria hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2`;
  }

  onAddToCart(): void {
    if (!this.isAvailable) {
      return;
    }

    this.addToCart.emit(this.Product);
  }

  onImageError(): void {
    this.imageHasError = true;
  }
}
