import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

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

  login(correo: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, { correo, contrasena });
  }

  getCatalogoPeliculas(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(`${this.apiUrl}/Movies`);
  }
}