import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'  
})

export class ProductService {

    private apiUrl = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) {}

    listProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl);
    }

    // register(data: signUpRequest): Observable<void> {
    //     return this.http.post<void>(`${this.apiUrl}/register-costumer`, data);
    // }

    createProduct(data: FormData): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, data, {
            withCredentials: true
        });
    }

}


