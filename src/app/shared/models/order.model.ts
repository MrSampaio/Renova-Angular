import { Product } from './product.model';

export type OrderStatus = 'RESERVED' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'DEBIT_CARD' | 'CREDIT_CARD' | 'PIX';

export interface CreateOrderRequest {
  productIds: string[];
  paymentMethod: PaymentMethod;
}

export interface Order {
  orderId: string;
  orderNumber: number;
  items: Product[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  expiresAt: string;
}