import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;
  constructor(private http: HttpClient) {}

  login(credentials: { login: string; passwordHash: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  register(userData: { code: string; login: string; passwordHash: string; isActive: boolean }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}