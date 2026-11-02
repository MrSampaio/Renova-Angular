import { Injectable } from '@angular/core';
import { AuthRequest } from '../interfaces/auth-request';
import { LoginResponse } from '../../features/login/login-response';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { signUpRequest } from '../../features/sign-up/sign-up-request';
@Injectable({
    providedIn: 'root'  
})

export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;

    constructor(private http: HttpClient) {}

    login(data: AuthRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
    }

    register(data: signUpRequest): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/register-costumer`, data);
    }
}
