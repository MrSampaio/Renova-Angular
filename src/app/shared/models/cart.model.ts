import { Product } from './product.model';

export interface Cart {
  cartId: string;
  items: Product[];
  itemCount: number;
  totalPrice: number;
}