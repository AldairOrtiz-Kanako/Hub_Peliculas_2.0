import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:5025/api/User'; // URL del backend
  private http = inject(HttpClient);

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userData);
  }

  constructor() {}
}
