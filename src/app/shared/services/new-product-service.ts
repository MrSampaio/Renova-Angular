import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product-model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'  
})


export class NewProductService {

    private apiUrl = `${environment.apiUrl}/catalog`;


    
}