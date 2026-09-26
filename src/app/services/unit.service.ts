import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultViewModel, UnitModel, CreateUnitCommand, UpdateUnitCommand } from '../models/models';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UnitService {

  private apiUrl = `${environment.apiUrl}/units`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ResultViewModel<UnitModel[]>> {
    return this.http.get<ResultViewModel<UnitModel[]>>(this.apiUrl);
  }

  create(command: CreateUnitCommand): Observable<ResultViewModel> {
    return this.http.post<ResultViewModel>(this.apiUrl, command);
  }

  update(id: number, command: UpdateUnitCommand): Observable<ResultViewModel> {
    return this.http.put<ResultViewModel>(`${this.apiUrl}/${id}`, command);
  }

  inactivate(id: number): Observable<ResultViewModel> {
    return this.http.patch<ResultViewModel>(`${this.apiUrl}/${id}/inactivate`, {});
  }

  delete(id: number): Observable<ResultViewModel> {
    return this.http.delete<ResultViewModel>(`${this.apiUrl}/${id}`);
  }
}