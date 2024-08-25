import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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

  constructor() {}

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
        })
      );
  }

  getCatalogoPeliculas(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(`${this.apiUrl}/Movies`);
  }

  getCatalogoSeries(): Observable<Serie[]> {
    return this.http.get<Serie[]>(`${this.apiUrl}/Series`);
  }

  private setSession(authResult: LoginResponse) {
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('userId', authResult.userId);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}