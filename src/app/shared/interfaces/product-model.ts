export type ProductStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD';

export interface Product {
  productId: string;
  productName: string;
  category: string;
  price: number;
  size: string;
  imageUrl: string;
  status: ProductStatus;
}