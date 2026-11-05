import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './new-product.html',
})
export class NewProduct {
  
  name = signal<string>('');
  category = signal<string>('');
  price = signal<string>('');
  condition = signal<string>('');
  description = signal<string>('');

  sizeType = signal<'standard' | 'numeric'>('standard');
  selectedStandardSizes = signal<string[]>([]);
  numericSizesInput = signal<string>('');

  categories = [
    { value: 'CAMISETAS', label: 'Camisetas' },
    { value: 'CALCAS', label: 'Calças' },
    { value: 'SHORTS', label: 'Shorts' },
    { value: 'VESTIDOS', label: 'Vestidos' },
    { value: 'MOLETONS', label: 'Moletons' },
    { value: 'CAMISAS', label: 'Camisas' },
    { value: 'SAIAS', label: 'Saias' },
    { value: 'MEIAS', label: 'Meias' },
    { value: 'LUVAS', label: 'Luvas' },
    { value: 'ACESSORIOS', label: 'Acessorios' },
    { value: 'OUTROS', label: 'Outros' }
  ];

  conditions = [
    { value: 'NOVO', label: 'Novo (com etiqueta)' },
    { value: 'SEMI_NOVO', label: 'Semi-novo (excelente estado)' },
    { value: 'USADO', label: 'Usado (bom estado)' }
  ];

  standardSizes = ['P', 'M', 'G', 'GG'];

  constructor(private router: Router) {}

  toggleStandardSize(size: string): void {
    const current = this.selectedStandardSizes();
    if (current.includes(size)) {
      this.selectedStandardSizes.set(current.filter((s) => s !== size));
    } else {
      this.selectedStandardSizes.set([...current, size]);
    }
  }

  isStandardSizeSelected(size: string): boolean {
    return this.selectedStandardSizes().includes(size);
  }

  onSubmit(): void {
    const productPayload = {
      name: this.name(),
      category: this.category(),
      price: parseFloat(this.price().replace(',', '.')),
      condition: this.condition(),
      sizeType: this.sizeType(),
      sizes: this.sizeType() === 'standard' ? this.selectedStandardSizes() : this.numericSizesInput().split(',').map(s => s.trim()),
      description: this.description()
    };
    // Aqui entrará o this.productService.createProduct(...)
  }
}