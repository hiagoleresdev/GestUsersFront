import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { UnitService } from '../../services/unit.service';
import { UserService } from '../../services/user.service';
import { EmployeeModel, CreateEmployeeCommand, UpdateEmployeeCommand, UnitModel, UserListModel } from '../../models/models';
import { Observable, BehaviorSubject, switchMap, map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html'
})
export class EmployeesComponent implements OnInit {
  private refresh$ = new BehaviorSubject<void>(undefined);

  employees$: Observable<EmployeeModel[]> = this.refresh$.pipe(
    switchMap(() => this.employeeService.getAll()),
    map(res => {
      const list = res?.data || (Array.isArray(res) ? res : []);
      
      list.sort((a, b) => a.code.localeCompare(b.code, 'pt-BR', { numeric: true }));
      
      return list;
    })
  );

  activeUnits$!: Observable<UnitModel[]>;
  activeUsers$!: Observable<UserListModel[]>;

  newEmployee: CreateEmployeeCommand = { code: '', name: '', unitId: 0, userId: 0 };
  editingId: number | null = null;
  editingEmployee: UpdateEmployeeCommand = { name: '', unitId: 0 };

  constructor(
    private employeeService: EmployeeService,
    private unitService: UnitService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      alert('Acesso negado! Faça login primeiro.');
      this.router.navigate(['/login']);
      return;
    }

    this.loadDependencies();
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.refresh$.next();
  }

  loadDependencies(): void {
    this.activeUnits$ = this.unitService.getAll().pipe(
      map(res => (res?.data || []).filter(u => u.isActive))
    );
    this.activeUsers$ = this.userService.getAll().pipe(
      map(res => (res?.data || []).filter(usr => usr.isActive))
    );
  }

  create(): void {
    if (!this.newEmployee.code || !this.newEmployee.name || !this.newEmployee.unitId || !this.newEmployee.userId) {
      alert('Preencha todos os campos!');
      return;
    }

    this.employeeService.create(this.newEmployee).subscribe({
      next: (res) => {
        alert(res.message);
        if (res.isSuccess) {
          this.newEmployee = { code: '', name: '', unitId: 0, userId: 0 };
          this.loadEmployees();
        }
      },
      error: (err) => alert(err.error?.message || 'Erro ao cadastrar.')
    });
  }

  startEdit(emp: EmployeeModel): void {
    this.editingId = emp.id;
    this.editingEmployee = { name: emp.name, unitId: emp.unitId };
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  update(): void {
    if (!this.editingId) return;

    this.employeeService.update(this.editingId, this.editingEmployee).subscribe({
      next: (res) => {
        alert(res.message);
        if (res.isSuccess) {
          this.cancelEdit();
          this.loadEmployees();
        }
      },
      error: (err) => alert(err.error?.message || 'Erro ao atualizar.')
    });
  }

  delete(id: number): void {
    if (!confirm('Deseja remover este colaborador?')) return;

    this.employeeService.delete(id).subscribe({
      next: (res) => {
        alert(res.message);
        if (res.isSuccess) {
          this.loadEmployees();
        }
      },
      error: (err) => alert(err.error?.message || 'Erro ao remover.')
    });
  }
}