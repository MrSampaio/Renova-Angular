import { Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { finalize } from 'rxjs';

import { ProductCard } from '../../shared/components/product-card/product-card';
import { Product } from '../../shared/interfaces/product-model';
import { CatalogService } from '../../shared/services/catalog-service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [ProductCard],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {

  // 1. Convertido para Signals
  products = signal<Product[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor(
    private readonly catalogService: CatalogService,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProducts();
    }
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.catalogService
      .listProducts()
      .pipe(
        finalize(() => {
          this.isLoading.set(false); // O Angular será notificado na hora!
        })
      )
      .subscribe({
        next: (data: Product[]) => {
          this.products.set(data);
        },
        error: (error) => {
          if (error.status === 401 || error.status === 403) {
            this.errorMessage.set('Você precisa estar autenticado para acessar o catálogo.');
          } else {
            this.errorMessage.set('Não foi possível carregar os produtos.');
          }
        }
      });
  }

  onAddToCart(product: Product): void {
    console.log('Produto adicionado ao carrinho:', product);
  }
}