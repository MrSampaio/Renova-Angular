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

  constructor(private router: Router) {}

  selectedFiles = signal<File[]>([]);
  imagePreviews = signal<string[]>([]);

  name = signal<string>('');
  category = signal<string>('');
  price = signal<string>('');
  condition = signal<string>('');
  description = signal<string>('');

  sizeType = signal<'standard' | 'numeric'>('standard');
  selectedSize = signal<string>('');
  
  selectSize(size: string): void {
    this.selectedSize.set(size);
  }

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
    // const productPayload = {
    //   name: this.name(),
    //   category: this.category(),
    //   price: parseFloat(this.price().replace(',', '.')),
    //   condition: this.condition(),
    //   sizeType: this.sizeType(),
    //   sizes: this.sizeType() === 'standard' ? this.selectedStandardSizes() : this.numericSizesInput().split(',').map(s => s.trim()),
    //   description: this.description()
    // };

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



  }


  



  // muda isso pra uma interface
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

}