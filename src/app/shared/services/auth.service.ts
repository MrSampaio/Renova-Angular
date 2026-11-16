import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthRequest } from '../models/auth-request.model';
import { LoginResponse } from '../models/login-response.model';
import { signUpRequest } from '../models/sign-up-request';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  currentUser = signal<UserProfile | null>(null);

  login(data: AuthRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data, {
      withCredentials: true,
    });
  }

  register(data: signUpRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register-costumer`, data);
  }

  fetchUser(): Observable<UserProfile | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(null);
    }

    return this.http
      .get<UserProfile>(`${environment.apiUrl}/users/me`, {
        withCredentials: true,
      })
      .pipe(
        tap((profile) => {
          this.currentUser.set(profile);
        }),
        catchError(() => {
          this.currentUser.set(null);
          return of(null);
        })
      );
  }

  logout(redirectTo: string = '/catalog'): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.currentUser.set(null);
      return;
    }

    this.http
      .post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        finalize(() => {
          localStorage.clear();
          sessionStorage.clear();
          this.currentUser.set(null);
          this.router.navigate([redirectTo], { replaceUrl: true });
        })
      )
      .subscribe({
        error: (err) => console.error('Erro ao realizar logout no servidor:', err),
      });
  }
}