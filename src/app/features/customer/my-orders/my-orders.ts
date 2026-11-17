import { Component, Inject, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { OrderService } from '../../../shared/services/order.service';
import { Order, OrderStatus, PaymentMethod } from '../../../shared/models/order.model';
import { Product } from '../../../shared/models/product.model';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './my-orders.html',
})
export class MyOrders implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly apiUrl = environment.apiUrl;

  orders = signal<Order[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  expandedOrderIds = signal<Set<string>>(new Set());
  selectedOrderForDetails = signal<Order | null>(null);
  brokenImageIds = signal<Set<string>>(new Set());

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadOrders();
    }
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.orderService
      .getMyOrders()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          this.orders.set(data);
          if (data.length > 0) {
            this.expandedOrderIds.set(new Set([data[0].orderId]));
          }
        },
        error: () => {
          this.errorMessage.set('Não foi possível carregar seus pedidos.');
        },
      });
  }

  isExpanded(orderId: string): boolean {
    return this.expandedOrderIds().has(orderId);
  }

  toggleExpand(orderId: string): void {
    this.expandedOrderIds.update((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  }

  openDetailsModal(order: Order): void {
    this.selectedOrderForDetails.set(order);
  }

  closeDetailsModal(): void {
    this.selectedOrderForDetails.set(null);
  }

  formatDate(isoDate: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(isoDate));
  }

  getStatusConfig(status: OrderStatus): { label: string; icon: string; classes: string } {
    switch (status) {
      case 'RESERVED':
        return {
          label: 'Aguardando retirada',
          icon: 'fa-regular fa-clock',
          classes: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'COMPLETED':
        return {
          label: 'Retirado',
          icon: 'fa-solid fa-circle-check',
          classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'CANCELLED':
        return {
          label: 'Cancelado',
          icon: 'fa-solid fa-circle-xmark',
          classes: 'bg-red-50 text-red-700 border-red-200',
        };
    }
  }

  getPaymentLabel(method: PaymentMethod): string {
    const labels: Record<PaymentMethod, string> = {
      CASH: 'Dinheiro (na retirada)',
      DEBIT_CARD: 'Cartão de débito',
      CREDIT_CARD: 'Cartão de crédito',
      PIX: 'PIX',
    };
    return labels[method];
  }

  getImageUrl(product: Product): string {
    if (!product.imageUrls || product.imageUrls.length === 0) {
      return '';
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
}