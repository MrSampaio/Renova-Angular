import { Injectable, signal } from '@angular/core';
import { AuthRequest } from '../interfaces/auth-request';
import { LoginResponse } from '../../features/login/login-response';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { signUpRequest } from '../../features/sign-up/sign-up-request';
import { UserProfile } from '../interfaces/user-profile';

@Injectable({
    providedIn: 'root'  
})

export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;

    constructor(private http: HttpClient) {}

    currentUser = signal<UserProfile | null>(null);

    login(data: AuthRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
    }

    register(data: signUpRequest): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/register-costumer`, data);
    }

    // o tap faz com que o dado que é lido possa ser armazenado na variável antes de ser modificado
    fetchUser(): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${this.apiUrl}/me`).pipe(
            tap((profile) => {
            this.currentUser.set(profile); 
        })
    );
    }
}
