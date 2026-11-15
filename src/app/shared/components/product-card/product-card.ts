import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  inject,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Button } from '../button/button';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CurrencyPipe,
    Button,
  ],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  private readonly authService = inject(AuthService);

  @Input({ required: true }) product!: Product;

  @Output() addToCart = new EventEmitter<Product>();
  @Output() editProduct = new EventEmitter<Product>();
  @Output() deleteProduct = new EventEmitter<Product>();

  private apiUrl = `${environment.apiUrl}`;

  imageHasError = false;

  // atualiza automaticamente no template quando o usuário faz login ou logout
  isEmployee = computed(() => this.authService.currentUser()?.userRole === 'EMPLOYEE');

  get isAvailable(): boolean {
    return this.product.status === 'AVAILABLE';
  }

  get buttonText(): string {
    switch (this.product.status) {
      case 'RESERVED':
        return 'Peça reservada';

      case 'SOLD':
        return 'Peça vendida';

      default:
        return 'Adicionar ao carrinho';
    }
  }

  get buttonIcon(): string {
    return this.isAvailable ? 'fa-solid fa-cart-shopping' : 'fa-solid fa-lock';
  }

  get buttonClass(): string {
    const baseClass =
      'min-h-12 w-full rounded-xl px-4 py-3 text-sm sm:text-base text-white shadow-sm';

    if (!this.isAvailable) {
      return `${baseClass} cursor-not-allowed bg-slate-400 opacity-70`;
    }

    return `${baseClass} bg-renova-primaria hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2`;
  }

  get editButtonClass(): string {
    return 'min-h-12 w-full rounded-xl bg-slate-800 px-2.5 py-2.5 text-xs sm:text-sm text-white shadow-sm hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2';
  }

  get deleteButtonClass(): string {
    return 'min-h-12 w-full rounded-xl bg-red-600 px-2.5 py-2.5 text-xs sm:text-sm text-white shadow-sm hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2';
  }

  onAddToCart(): void {
    if (!this.isAvailable) {
      return;
    }

    this.addToCart.emit(this.product);
  }

  onEditProduct(): void {
    this.editProduct.emit(this.product);
  }

  onDeleteProduct(): void {
    this.deleteProduct.emit(this.product);
  }

  onImageError(): void {
    this.imageHasError = true;
  }

  getImageUrl(): string {
    if (!this.product.imageUrls || this.product.imageUrls.length === 0) {
      return 'assets/placeholder.jpg';
    }

    const url = this.product.imageUrls[0].replace(/^\/uploads/, '');

    if (url.startsWith('http')) {
      return url;
    }

    const baseUrl = `${this.apiUrl}`;
    return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
  }
}