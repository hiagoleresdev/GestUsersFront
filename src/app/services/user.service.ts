import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultViewModel, UserListModel, CreateUserCommand, UpdateUserCommand } from '../models/models';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`; // Ajuste a porta da sua API se necessário

  constructor(private http: HttpClient) {}

  getAll(): Observable<ResultViewModel<UserListModel[]>> {
    return this.http.get<ResultViewModel<UserListModel[]>>(this.apiUrl);
  }

  create(command: CreateUserCommand): Observable<ResultViewModel> {
    return this.http.post<ResultViewModel>(this.apiUrl, command);
  }

  update(id: number, command: UpdateUserCommand): Observable<ResultViewModel> {
    return this.http.put<ResultViewModel>(`${this.apiUrl}/${id}`, command);
  }

  delete(id: number): Observable<ResultViewModel> {
    return this.http.delete<ResultViewModel>(`${this.apiUrl}/${id}`);
  }
}