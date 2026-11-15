import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Cart } from '../models/cart.model';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly apiUrl = `${environment.apiUrl}/cart`;

  cart = signal<Cart | null>(null);

  items = computed(() => this.cart()?.items ?? []);
  itemCount = computed(() => this.cart()?.itemCount ?? 0);
  totalPrice = computed(() => this.cart()?.totalPrice ?? 0);
  productIdsInCart = computed(() => new Set(this.items().map(item => item.productId)));

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user && user.userRole === 'CUSTOMER') {
        this.loadCart().subscribe({
          error: (err) => console.error('Error when fetching cart data:', err),
        });
      } else {
        queueMicrotask(() => this.cart.set(null));
      }
    });
  }

  loadCart(): Observable<Cart> {
    return this.http
      .get<Cart>(this.apiUrl, { withCredentials: true })
      .pipe(tap((cart) => this.cart.set(cart)));
  }

  addToCart(productId: string): Observable<Cart> {
    return this.http
      .post<Cart>(`${this.apiUrl}/items/${productId}`, {}, { withCredentials: true })
      .pipe(tap((cart) => this.cart.set(cart)));
  }

  removeFromCart(productId: string): Observable<Cart> {
    return this.http
      .delete<Cart>(`${this.apiUrl}/items/${productId}`, { withCredentials: true })
      .pipe(tap((cart) => this.cart.set(cart)));
  }

  clearCart(): Observable<Cart> {
    return this.http
      .delete<Cart>(this.apiUrl, { withCredentials: true })
      .pipe(tap((cart) => this.cart.set(cart)));
  }
}