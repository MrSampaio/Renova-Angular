import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product-model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'  
})

export class CatalogService {

    private apiUrl = `${environment.apiUrl}/catalog`;

    constructor(private http: HttpClient) {}

    listProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl);
    }

}


