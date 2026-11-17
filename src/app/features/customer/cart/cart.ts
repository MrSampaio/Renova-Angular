import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../shared/services/cart.service';
import { Product } from '../../../shared/models/product.model';
import { Button } from '../../../shared/components/button/button';
import { environment } from '../../../../environments/environment.development';
import { OrderService } from '../../../shared/services/order.service';

export type PaymentMethod = 'CASH' | 'DEBIT_CARD' | 'CREDIT_CARD' | 'PIX';

interface PaymentOption {
  value: PaymentMethod;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, Button],
  templateUrl: './cart.html',
})
export class Cart implements OnInit {
  readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;
  private readonly orderService = inject(OrderService);

  errorMessage = signal<string>('');
  selectedIds = signal<Set<string>>(new Set());
  selectedPaymentMethod = signal<PaymentMethod>('PIX');
  isSubmitting = signal<boolean>(false);
  removingItemId = signal<string | null>(null);
  brokenImageIds = signal<Set<string>>(new Set());

  paymentOptions: PaymentOption[] = [
    { value: 'CASH', label: 'Dinheiro', icon: 'fa-solid fa-money-bill-wave' },
    { value: 'DEBIT_CARD', label: 'Cartão de débito', icon: 'fa-regular fa-credit-card' },
    { value: 'CREDIT_CARD', label: 'Cartão de crédito', icon: 'fa-solid fa-credit-card' },
    { value: 'PIX', label: 'PIX', icon: 'fa-solid fa-qrcode' },
  ];

  items = this.cartService.items;

  availableItems = computed(() =>
    this.items().filter((item) => item.status === 'AVAILABLE')
  );

  selectedItems = computed(() =>
    this.availableItems().filter((item) => this.selectedIds().has(item.productId))
  );

  selectedCount = computed(() => this.selectedItems().length);

  selectedTotal = computed(() =>
    this.selectedItems().reduce((sum, item) => sum + item.price, 0)
  );

  allAvailableSelected = computed(() => {
    const available = this.availableItems();
    return available.length > 0 && this.selectedCount() === available.length;
  });

  submitButtonClass = computed(() => {
    const base =
      'min-h-12 w-full rounded-xl px-5 py-3.5 text-sm sm:text-base font-bold text-white shadow-sm';

    if (this.selectedCount() === 0 || this.isSubmitting()) {
      return `${base} cursor-not-allowed bg-slate-400 opacity-70`;
    }

    return `${base} bg-renova-primaria hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2`;
  });

  constructor() {
    // sincroniza a seleção sempre que os itens do carrinho são carregados ou atualizados
    effect(() => {
      const currentItems = this.items();
      const validAvailableIds = new Set(
        currentItems
          .filter((item) => item.status === 'AVAILABLE')
          .map((item) => item.productId)
      );

      this.selectedIds.update((prev) => {
        // se estava vazio no primeiro carregamento, seleciona todos os disponíveis por padrão
        if (prev.size === 0 && validAvailableIds.size > 0) {
          return validAvailableIds;
        }
        const next = new Set<string>();
        prev.forEach((id) => {
          if (validAvailableIds.has(id)) {
            next.add(id);
          }
        });
        return next;
      });
    });
  }

  ngOnInit(): void {
    if (!this.cartService.cart()) {
      this.cartService.loadCart().subscribe({
        error: (err) => console.error('Error when loading path:', err),
      });
    }
  }

  isSelected(productId: string): boolean {
    return this.selectedIds().has(productId);
  }

  toggleItem(product: Product): void {
    if (product.status !== 'AVAILABLE') {
      return;
    }

    this.selectedIds.update((prev) => {
      const next = new Set(prev);
      if (next.has(product.productId)) {
        next.delete(product.productId);
      } else {
        next.add(product.productId);
      }
      return next;
    });
  }

  toggleSelectAll(): void {
    if (this.allAvailableSelected()) {
      this.selectedIds.set(new Set());
    } else {
      const allIds = new Set(this.availableItems().map((item) => item.productId));
      this.selectedIds.set(allIds);
    }
  }

  removeItem(productId: string): void {
    if (this.removingItemId()) {
      return;
    }

    this.removingItemId.set(productId);
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.removingItemId.set(null);
      },
      error: (err) => {
        this.removingItemId.set(null);
        console.error('Erro ao remover item do carrinho:', err);
      },
    });
  }

  showClearCartModal = signal<boolean>(false);
  isClearing = signal<boolean>(false);

  openClearCartModal(): void {
    if (this.items().length === 0 || this.isSubmitting()) {
      return;
    }
    this.showClearCartModal.set(true);
  }

  closeClearCartModal(): void {
    if (this.isClearing()) {
      return;
    }
    this.showClearCartModal.set(false);
  }

  confirmClearCart(): void {
    if (this.items().length === 0 || this.isClearing()) {
      return;
    }

    this.isClearing.set(true);

    this.cartService.clearCart().subscribe({
      next: () => {
        this.selectedIds.set(new Set());
        this.isClearing.set(false);
        this.showClearCartModal.set(false);
      },
      error: (err) => {
        this.isClearing.set(false);
        console.error('Erro ao limpar carrinho:', err);
      },
    });
  }

  clearCart(): void {
    if (this.items().length === 0 || this.isSubmitting()) {
      return;
    }

    this.cartService.clearCart().subscribe({
      next: () => {
        this.selectedIds.set(new Set());
      },
      error: (err) => console.error('Erro ao limpar carrinho:', err),
    });
  }

  getImageUrl(product: Product): string {
    if (!product.imageUrls || product.imageUrls.length === 0) {
      return 'assets/placeholder.jpg';
    }

    const url = product.imageUrls[0].replace(/^\/uploads/, '');
    if (url.startsWith('http')) {
      return url;
    }

    return url.startsWith('/') ? `${this.apiUrl}${url}` : `${this.apiUrl}/${url}`;
  }

  onImageError(productId: string): void {
    this.brokenImageIds.update((prev) => new Set(prev).add(productId));
  }

  hasImageError(productId: string): boolean {
    return this.brokenImageIds().has(productId);
  }

  finalizeOrder(): void {
    if (this.selectedCount() === 0 || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.orderService
      .createOrder({
        productIds: Array.from(this.selectedIds()),
        paymentMethod: this.selectedPaymentMethod(),
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.selectedIds.set(new Set());
          this.router.navigate(['/my-orders']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(
            err.error?.message || 'Não foi possível concluir sua reserva. Tente novamente.'
          );
          // recarrega o carrinho para refletir caso alguma peça tenha acabado de ser reservada
          this.cartService.loadCart().subscribe();
        },
      });
  }
}