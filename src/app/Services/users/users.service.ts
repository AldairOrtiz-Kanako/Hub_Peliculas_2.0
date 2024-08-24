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
}