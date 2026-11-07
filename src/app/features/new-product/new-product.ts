import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../shared/services/product-service';
import { ProductCondition } from '../../shared/interfaces/product-model';
import { CATEGORY_OPTIONS } from '../../shared/interfaces/product-categories';
import { CONDITION_OPTIONS } from '../../shared/interfaces/product-conditions';
import { STANDARD_SIZE_OPTIONS } from '../../shared/interfaces/product-sizes';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './new-product.html',
})
export class NewProduct {

  constructor(private router: Router, private productService: ProductService) {}

  categories = CATEGORY_OPTIONS;
  conditions = CONDITION_OPTIONS;
  standardSizes = STANDARD_SIZE_OPTIONS;

  selectSize(size: string): void {
    this.selectedSize.set(size);
  }

  selectedFiles = signal<File[]>([]);
  imagePreviews = signal<string[]>([]);

  name = signal<string>('');
  category = signal<string>('');
  price = signal<string>('');
  condition = signal<string>('');
  description = signal<string>('');

  sizeType = signal<'standard' | 'numeric'>('standard');
  selectedSize = signal<string>('');

  numericSizesInput = signal<string>('');

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    // verifica se existe arquivos
    if (input.files && input.files.length > 0) {
      const filesArray = Array.from(input.files);
      
      // adiciona os arquivos no array existente
      this.selectedFiles.update(current => [...current, ...filesArray]);

      // cria urls temporárias para mostrar o preview
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      this.imagePreviews.update(current => [...current, ...newPreviews]);

      input.value = '';
    }
  }

  // funcao pra remover uma foto da lista antes de enviar
  removeImage(index: number): void {
    // libera a memória do navegador
    URL.revokeObjectURL(this.imagePreviews()[index]);

    // remove do array de previews e de arquivos
    this.imagePreviews.update(current => current.filter((_, i) => i !== index));
    this.selectedFiles.update(current => current.filter((_, i) => i !== index));
  }

  onSubmit(): void {

    const formData = new FormData()

    formData.append('productName', this.name());
    formData.append('category', this.category());
    formData.append('price', this.price().replace(',', '.'));
    formData.append('condition', this.condition());
    formData.append('sizeType', this.sizeType());
    formData.append('description', this.description() || '');

    const finalSize = this.sizeType() === 'standard' ? this.selectedSize() : this.numericSizesInput();
    formData.append('size', finalSize); 

    // lista de Imagens
    this.selectedFiles().forEach(file => {
      formData.append('images', file); // lembra que aqui tem que ser o mesmo nome do parametro da api
    });

    this.productService.createProduct(formData).subscribe({
      next: (response) => {
        console.log('Produto criado com sucesso', response);
        this.router.navigate(['/catalog']);
      },
      error: (err) => {
        console.error('Erro ao criar produto:', err);
      }
    });
  }

}