import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthRequest } from '../models/auth-request.model';
import { LoginResponse } from '../models/login-response.model';
import { signUpRequest } from '../../features/sign-up/sign-up-request';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
    providedIn: 'root'  
})

export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private http = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);

    // constructor(private http: HttpClient) {}
    currentUser = signal<UserProfile | null>(null);

    login(data: AuthRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
    }

    register(data: signUpRequest): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/register-costumer`, data);
    }

    // o tap faz com que o dado que é lido possa ser armazenado na variável antes de ser modificado
    fetchUser(): Observable<UserProfile | null> {

        if (!isPlatformBrowser(this.platformId)) {
            return of(null);
        }

        return this.http.get<UserProfile>(
            `${environment.apiUrl}/users/me`, 
            { withCredentials: true }
        ).pipe(
            tap((profile) => {
                this.currentUser.set(profile);
            })
        );
    }
}
