import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultViewModel, EmployeeModel, CreateEmployeeCommand, UpdateEmployeeCommand } from '../models/models';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  private apiUrl = `${environment.apiUrl}/employees`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ResultViewModel<EmployeeModel[]>> {
    return this.http.get<ResultViewModel<EmployeeModel[]>>(this.apiUrl);
  }

  create(command: CreateEmployeeCommand): Observable<ResultViewModel> {
    return this.http.post<ResultViewModel>(this.apiUrl, command);
  }

  update(id: number, command: UpdateEmployeeCommand): Observable<ResultViewModel> {
    return this.http.put<ResultViewModel>(`${this.apiUrl}/${id}`, command);
  }

  delete(id: number): Observable<ResultViewModel> {
    return this.http.delete<ResultViewModel>(`${this.apiUrl}/${id}`);
  }
}