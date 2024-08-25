import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, PLATFORM_ID, Inject } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

export interface CatalogoItem {
  tipo: string;
  titulo: string;
  temporadas?: number;
  episodios?: number;
  fechaEstreno: Date;
  sinopsis: string;
  genero: string;
  director: string;
  poster: string;
  trailer: string;
  duracion?: number;
}

export interface Pelicula {
  titulo: string;
  fechaEstreno: Date;
  duracion: number;
  sinopsis: string;
  genero: string;
  director: string;
  poster: string;
  trailer: string;
}

export interface Serie {
  titulo: string;
  temporadas: number;
  episodios: number;
  fechaEstreno: Date;
  sinopsis: string;
  genero: string;
  director: string;
  poster: string;
  trailer: string;
}

export interface UsuarioDto {
  nombre: string;
  nombreUsuario: string;
  correo: string;
}

interface LoginResponse {
  isSuccess: boolean;
  token: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:5025/api';
  private http = inject(HttpClient);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private setItem(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }

  private getItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private removeItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/User`, userData);
  }

  getCatalogoCompleto(): Observable<CatalogoItem[]> {
    return this.http.get<CatalogoItem[]>(`${this.apiUrl}/PeliculasySeries`);
  }

  login(correo: string, contrasena: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Login`, { correo, contrasena })
      .pipe(
        tap(response => {
          if (response.isSuccess) {
            this.setSession(response);
          }
        }),
        catchError(this.handleError)
      );
  }

  getCatalogoPeliculas(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(`${this.apiUrl}/Movies`);
  }

  getCatalogoSeries(): Observable<Serie[]> {
    return this.http.get<Serie[]>(`${this.apiUrl}/Series`);
  }

  getUserInfo(): Observable<UsuarioDto | null> {
    return of(this.getUserId()).pipe(
      switchMap(userId => {
        if (!userId) {
          console.warn('Usuario no autenticado');
          return of(null);
        }
        return this.http.get<UsuarioDto>(`${this.apiUrl}/User/${userId}`).pipe(
          catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
              console.warn('Sesión expirada o token inválido');
              this.logout();
              return of(null);
            }
            return throwError(() => error);
          })
        );
      })
    );
  }

  private setSession(authResult: LoginResponse) {
    this.setItem('token', authResult.token);
    this.setItem('userId', authResult.userId);
    console.log('Session set:', { token: authResult.token, userId: authResult.userId });
  }

  logout() {
    this.removeItem('token');
    this.removeItem('userId');
    console.log('Logged out: token and userId removed');
  }

  getToken(): string | null {
    const token = this.getItem('token');
    console.log('Retrieved token:', token);
    return token;
  }

  getUserId(): string | null {
    const userId = this.getItem('userId');
    console.log('Retrieved userId:', userId);
    return userId;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const userId = this.getUserId();
    const isLoggedIn = token !== null && token !== '' && userId !== null && userId !== '';
    console.log('Is logged in:', isLoggedIn);
    return isLoggedIn;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}