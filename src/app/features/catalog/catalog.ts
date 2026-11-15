import { Component, Inject, OnInit, PLATFORM_ID, computed, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { Product, ProductStatus } from '../../shared/models/product.model';
import { ProductService } from '../../shared/services/product.service';
import { AuthService } from '../../shared/services/auth.service';
import { CATEGORY_OPTIONS } from '../../shared/models/product-categories';
import { NewProduct } from '../employee/new-product/new-product';
import { Router } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';

type SortOption = 'default' | 'price-asc' | 'price-desc';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [FormsModule, ProductCard, NewProduct],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {

  constructor(
    private readonly catalogService: ProductService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cartService: CartService,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  products = signal<Product[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  // signals da barra de pesquisa e filtros
  searchTerm = signal<string>('');
  selectedCategory = signal<string>('');
  selectedStatus = signal<ProductStatus | ''>('');
  sortBy = signal<SortOption>('default');

  categories = CATEGORY_OPTIONS;

  statusOptions: { value: ProductStatus; label: string }[] = [
    { value: 'AVAILABLE', label: 'Disponível' },
    { value: 'RESERVED', label: 'Reservada' },
    { value: 'SOLD', label: 'Vendida' },
  ];

  isEmployee = computed(() => this.authService.currentUser()?.userRole === 'EMPLOYEE');

  editingProduct = signal<Product | null>(null);
  productToDelete = signal<Product | null>(null);
  isDeleting = signal<boolean>(false);

  hasActiveFilters = computed(() =>
    this.searchTerm().trim() !== '' ||
    this.selectedCategory() !== '' ||
    (this.isEmployee() && this.selectedStatus() !== '') ||
    this.sortBy() !== 'default'
  );

  filteredProducts = computed(() => {
    const term = this.normalizeText(this.searchTerm().trim());
    const category = this.selectedCategory();
    const status = this.selectedStatus();
    const sort = this.sortBy();

    let result = [...this.products()];

    if (term) {
      result = result.filter(product =>
        this.normalizeText(product.productName).includes(term) ||
        this.normalizeText(product.description ?? '').includes(term)
      );
    }

    if (category) {
      result = result.filter(product => product.category === category);
    }

    if (this.isEmployee() && status) {
      result = result.filter(product => product.status === status);
    }

    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  });


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProducts();
    }
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('');
    this.selectedStatus.set('');
    this.sortBy.set('default');
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

  onEditProduct(product: Product): void {
    this.editingProduct.set(product);
  }

  closeEditModal(): void {
    this.editingProduct.set(null);
  }

  onProductUpdated(updatedProduct: Product): void {
    this.products.update(list =>
      list.map(p => (p.productId === updatedProduct.productId ? updatedProduct : p))
    );
    this.closeEditModal();
  }

  onDeleteProduct(product: Product): void {
    this.productToDelete.set(product);
  }

  closeDeleteModal(): void {
    if (this.isDeleting()) {
      return;
    }
    this.productToDelete.set(null);
  }

  confirmDeleteProduct(): void {
    const product = this.productToDelete();
    if (!product || this.isDeleting()) {
      return;
    }

    this.isDeleting.set(true);

    this.catalogService.deleteProduct(product.productId).subscribe({
      next: () => {
        this.products.update(list =>
          list.filter(p => p.productId !== product.productId)
        );
        this.isDeleting.set(false);
        this.productToDelete.set(null);
      },
      error: (err) => {
        this.isDeleting.set(false);
        this.productToDelete.set(null);
        this.errorMessage.set('Não foi possível apagar o produto.');
        console.error('Error when trying to delete product:', err);
      }
    });
  }

  cartFeedback = signal<{ message: string; type: 'success' | 'warning' } | null>(null);

  private showCartFeedback(message: string, type: 'success' | 'warning'): void {
    this.cartFeedback.set({ message, type });
    setTimeout(() => {
      this.cartFeedback.set(null);
    }, 3500);
  }

  onAddToCart(product: Product): void {
    const user = this.authService.currentUser();

    if (!user) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/catalog' },
      });
      return;
    }

    this.cartService.addToCart(product.productId).subscribe({
      next: () => {
        this.showCartFeedback(`"${product.productName}" foi adicionada ao carrinho!`, 'success');
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: '/catalog' },
          });
        } else if (err.status === 409) {
          this.showCartFeedback('Esta peça já está no seu carrinho.', 'warning');
        } else {
          this.showCartFeedback('Não foi possível adicionar a peça ao carrinho.', 'warning');
        }
      },
    });
  }
}