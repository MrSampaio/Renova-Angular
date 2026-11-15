import { Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { finalize } from 'rxjs';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { Product } from '../../shared/models/product.model';
import { ProductService } from '../../shared/services/product.service';
import { NewProduct } from '../employee/new-product/new-product';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [ProductCard, NewProduct],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {

  products = signal<Product[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  editingProduct = signal<Product | null>(null);

  constructor(
    private readonly catalogService: ProductService,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProducts();
    }
  }

  onEditProduct(product: Product): void {
    this.editingProduct.set(product);
  }

  closeEditModal(): void {
    this.editingProduct.set(null);
  }

  onProductUpdated(updatedProduct: Product): void {
    // Atualiza o card na lista imediatamente sem precisar recarregar a página
    this.products.update(list =>
      list.map(p => (p.productId === updatedProduct.productId ? updatedProduct : p))
    );
    this.closeEditModal();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.catalogService
      .listProducts()
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
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