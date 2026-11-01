export type ProductStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD';

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  size: string;
  imageUrl: string;
  status: ProductStatus;
}