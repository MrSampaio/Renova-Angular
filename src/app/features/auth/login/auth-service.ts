import { Service } from '@angular/core';
import { Injectable } from '@angular/core';
import { AuthRequest } from './auth-request';
import { LoginResponse } from './loginResponse';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';


//@Service()
@Injectable({
    providedIn: 'root'
})

export class AuthService {
   private apiUrl = `${environment.apiUrl}/auth`;

    constructor(private http: HttpClient) {}

    // funcao de login
    login(data: AuthRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
    }
}
