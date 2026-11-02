import { Component } from '@angular/core';

import { ProductCard } from '../../shared/components/product-card/product-card';
import { Product } from '../../shared/interfaces/product-model';
import { CatalogService } from '../../shared/services/catalog-service';

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
    
  ];

  onAddToCart(product: Product): void {
    console.log('Produto adicionado ao carrinho:', product);

    // this.cartService.addProduct(product);
  }
}