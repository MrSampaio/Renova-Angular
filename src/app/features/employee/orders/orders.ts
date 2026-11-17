import { Component, Inject, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { OrderService } from '../../../shared/services/order.service';
import { Order, OrderStatus, PaymentMethod } from '../../../shared/models/order.model';
import { Product } from '../../../shared/models/product.model';
import { environment } from '../../../../environments/environment.development';

type StatusFilter = 'ALL' | OrderStatus;

interface PendingOrderAction {
  order: Order;
  type: 'COMPLETE' | 'CANCEL';
}

@Component({
  selector: 'app-employee-orders',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './orders.html',
})
export class EmployeeOrders implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly apiUrl = environment.apiUrl;

  orders = signal<Order[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  searchTerm = signal<string>('');
  selectedStatus = signal<StatusFilter>('ALL');

  expandedOrderIds = signal<Set<string>>(new Set());
  pendingAction = signal<PendingOrderAction | null>(null);
  isProcessingAction = signal<boolean>(false);
  brokenImageIds = signal<Set<string>>(new Set());

  statusCounts = computed(() => {
    const all = this.orders();
    return {
      ALL: all.length,
      RESERVED: all.filter((o) => o.status === 'RESERVED').length,
      COMPLETED: all.filter((o) => o.status === 'COMPLETED').length,
      CANCELLED: all.filter((o) => o.status === 'CANCELLED').length,
    };
  });

  filteredOrders = computed(() => {
    const term = this.normalizeText(this.searchTerm().trim().replace(/^#/, ''));
    const status = this.selectedStatus();

    return this.orders().filter((order) => {
      if (status !== 'ALL' && order.status !== status) {
        return false;
      }

      if (!term) {
        return true;
      }

      const matchesNumber = String(order.orderNumber).includes(term);
      const matchesCustomer =
        this.normalizeText(order.customerName).includes(term) ||
        this.normalizeText(order.customerEmail).includes(term);
      const matchesProduct = order.items.some((item) =>
        this.normalizeText(item.productName).includes(term)
      );

      return matchesNumber || matchesCustomer || matchesProduct;
    });
  });

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadOrders();
    }
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.orderService
      .getAllOrders()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          this.orders.set(data);
          // abre automaticamente as reservas pendentes mais recentes
          const firstReserved = data.find((o) => o.status === 'RESERVED');
          if (firstReserved) {
            this.expandedOrderIds.set(new Set([firstReserved.orderId]));
          }
        },
        error: () => {
          this.errorMessage.set('Não foi possível carregar os pedidos do bazar.');
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

  isExpired(order: Order): boolean {
    return order.status === 'RESERVED' && new Date(order.expiresAt).getTime() < Date.now();
  }

  openActionModal(order: Order, type: 'COMPLETE' | 'CANCEL', event: Event): void {
    event.stopPropagation();
    this.pendingAction.set({ order, type });
  }

  closeActionModal(): void {
    if (this.isProcessingAction()) {
      return;
    }
    this.pendingAction.set(null);
  }

  confirmAction(): void {
    const action = this.pendingAction();
    if (!action || this.isProcessingAction()) {
      return;
    }

    this.isProcessingAction.set(true);

    const request$ =
      action.type === 'COMPLETE'
        ? this.orderService.completeOrder(action.order.orderId)
        : this.orderService.cancelOrder(action.order.orderId);

    request$.subscribe({
      next: (updatedOrder) => {
        this.orders.update((list) =>
          list.map((o) => (o.orderId === updatedOrder.orderId ? updatedOrder : o))
        );
        this.isProcessingAction.set(false);
        this.pendingAction.set(null);
      },
      error: (err) => {
        this.isProcessingAction.set(false);
        this.pendingAction.set(null);
        this.errorMessage.set(
          err.error?.message || 'Não foi possível atualizar o status do pedido.'
        );
      },
    });
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
      CASH: 'Dinheiro',
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