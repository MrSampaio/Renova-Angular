import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CreateOrderRequest, Order } from '../models/order.model';
import { CartService } from './cart.service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly cartService = inject(CartService);
  private readonly apiUrl = `${environment.apiUrl}/orders`;

  createOrder(payload: CreateOrderRequest): Observable<Order> {
    return this.http
      .post<Order>(this.apiUrl, payload, { withCredentials: true })
      .pipe(
        tap(() => {
          this.cartService.loadCart().subscribe();
        })
      );
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/my`, {
      withCredentials: true,
    });
  }
  
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl, {
      withCredentials: true,
    });
  }

  completeOrder(orderId: string): Observable<Order> {
    return this.http.patch<Order>(
      `${this.apiUrl}/${orderId}/complete`,
      {},
      { withCredentials: true }
    );
  }

  cancelOrder(orderId: string): Observable<Order> {
    return this.http.patch<Order>(
      `${this.apiUrl}/${orderId}/cancel`,
      {},
      { withCredentials: true }
    );
  }
}