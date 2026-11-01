import { Component } from '@angular/core';

import { ProductCard } from '../../shared/components/product-card/product-card';
import { Product } from '../../shared/interfaces/product-model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    ProductCard,
  ],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {

  // depois muda pra requisição da api
  products: Product[] = [
    {
      productId: '1',
      productName: 'Camiseta Básica Verde',
      category: 'Camisetas',
      price: 25,
      size: 'M',
      imageUrl: 'assets/images/camiseta-verde.jpg',
      status: 'AVAILABLE',
    },
    {
      productId: '2',
      productName: 'Calça Jeans',
      category: 'Calças',
      price: 60,
      size: '40',
      imageUrl: 'assets/images/calca-jeans.jpg',
      status: 'AVAILABLE',
    },
    {
      productId: '3',
      productName: 'Vestido Floral',
      category: 'Vestidos',
      price: 45,
      size: 'P',
      imageUrl: 'assets/images/vestido-floral.jpg',
      status: 'RESERVED',
    },
    {
      productId: '4',
      productName: 'Moletom Cinza',
      category: 'Moletons',
      price: 50,
      size: 'G',
      imageUrl: 'assets/images/moletom-cinza.jpg',
      status: 'SOLD',
    },
  ];

  onAddToCart(product: Product): void {
    console.log('Produto adicionado ao carrinho:', product);

    // this.cartService.addProduct(product);
  }
}