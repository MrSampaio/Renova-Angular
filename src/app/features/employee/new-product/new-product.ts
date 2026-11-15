import { Component, EventEmitter, Input, OnInit, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { Product } from '../../../shared/models/product.model';
import { CATEGORY_OPTIONS } from '../../../shared/models/product-categories';
import { CONDITION_OPTIONS } from '../../../shared/models/product-conditions';
import { STANDARD_SIZE_OPTIONS } from '../../../shared/models/product-sizes';
import { environment } from '../../../../environments/environment.development';

interface ImageItem {
  previewUrl: string;
  file?: File;
  existingUrl?: string;
}

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './new-product.html',
})
export class NewProduct implements OnInit {

  @Input() productToEdit: Product | null = null;
  @Input() isModal = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() productSaved = new EventEmitter<Product>();

  constructor(private router: Router, private productService: ProductService) {}

  categories = CATEGORY_OPTIONS;
  conditions = CONDITION_OPTIONS;
  standardSizes = STANDARD_SIZE_OPTIONS;

  isEditMode = computed(() => this.productToEdit !== null);

  // unifica imagens já salvas no servidor e novos arquivos selecionados
  imageItems = signal<ImageItem[]>([]);
  imagePreviews = computed(() => this.imageItems().map(item => item.previewUrl));

  name = signal<string>('');
  category = signal<string>('');
  price = signal<string>('');
  condition = signal<string>('');
  description = signal<string>('');

  sizeType = signal<'standard' | 'numeric'>('standard');
  selectedSize = signal<string>('');
  numericSizesInput = signal<string>('');

  ngOnInit(): void {
    if (this.productToEdit) {
      this.populateForm(this.productToEdit);
    }
  }

  private populateForm(product: Product): void {
    this.name.set(product.productName);
    this.category.set(product.category);
    this.price.set(product.price.toFixed(2).replace('.', ','));
    this.condition.set(product.condition);
    this.description.set(product.description || '');

    if (product.sizeType === 'numeric') {
      this.sizeType.set('numeric');
      this.numericSizesInput.set(product.size);
    } else {
      this.sizeType.set('standard');
      this.selectedSize.set(product.size);
    }

    if (product.imageUrls?.length) {
      const existingItems: ImageItem[] = product.imageUrls.map(rawUrl => {
        const cleanPath = rawUrl.replace(/^\/uploads/, '');
        const fullUrl = cleanPath.startsWith('http')
          ? cleanPath
          : `${environment.apiUrl}${cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath}`;

        return {
          previewUrl: fullUrl,
          existingUrl: rawUrl, // preserva a string original salva no banco
        };
      });

      this.imageItems.set(existingItems);
    }
  }

  selectSize(size: string): void {
    this.selectedSize.set(size);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const newItems: ImageItem[] = Array.from(input.files).map(file => ({
        previewUrl: URL.createObjectURL(file),
        file,
      }));

      this.imageItems.update(current => [...current, ...newItems]);
      input.value = '';
    }
  }

  removeImage(index: number): void {
    const target = this.imageItems()[index];

    // revoga a URL apenas se for um arquivo novo em memória (blob)
    if (target?.file) {
      URL.revokeObjectURL(target.previewUrl);
    }

    this.imageItems.update(current => current.filter((_, i) => i !== index));
  }

  onCancel(): void {
    if (this.isModal) {
      this.closeModal.emit();
    } else {
      this.router.navigate(['/catalog']);
    }
  }

  onSubmit(): void {
    const formData = new FormData();

    formData.append('productName', this.name());
    formData.append('category', this.category());
    formData.append('price', this.price().replace(',', '.'));
    formData.append('condition', this.condition());
    formData.append('sizeType', this.sizeType());
    formData.append('description', this.description() || '');

    const finalSize = this.sizeType() === 'standard' ? this.selectedSize() : this.numericSizesInput();
    formData.append('size', finalSize);

    // separa imagens antigas mantidas dos novos arquivos enviados
    this.imageItems().forEach(item => {
      if (item.existingUrl) {
        formData.append('existingImages', item.existingUrl);
      } else if (item.file) {
        formData.append('images', item.file);
      }
    });

    if (this.isEditMode() && this.productToEdit) {
      this.productService.updateProduct(this.productToEdit.productId, formData).subscribe({
        next: (updatedProduct) => {
          this.productSaved.emit(updatedProduct);
        },
        error: (err) => {
          console.error('Erro ao atualizar produto:', err);
        }
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: (response) => {
          if (this.isModal) {
            this.productSaved.emit(response);
          } else {
            this.router.navigate(['/catalog']);
          }
        },
        error: (err) => {
          console.error('Erro ao criar produto:', err);
        }
      });
    }
  }
}