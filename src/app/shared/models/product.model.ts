export type ProductStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD';
export type ProductCondition = 'NEW' | 'PREOWNED' | 'USED';

export interface Product {
  productId: string;
  productName: string;
  description: string;
  category: string;
  price: number;
  condition: ProductCondition;
  sizeType: 'standard' | 'numeric'; 
  size: string;
  imageUrls: string[];
  status: ProductStatus;
}

