import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnitService } from '../../services/unit.service';
import { EmployeeService } from '../../services/employee.service';
import { UnitModel, CreateUnitCommand, EmployeeModel } from '../../models/models';
import { Observable, BehaviorSubject, switchMap, map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './units.html',
  styleUrl: './units.css'
})
export class UnitsComponent implements OnInit {
  private refresh$ = new BehaviorSubject<void>(undefined);

  units$: Observable<UnitModel[]> = this.refresh$.pipe(
    switchMap(() => this.unitService.getAll()),
    map(res => {
      const list = res?.data || (Array.isArray(res) ? res : []);
      // Ordena pelo code do menor para o maior (alfanumérico natural)
      list.sort((a, b) => a.code.localeCompare(b.code, 'pt-BR', { numeric: true }));
      return list;
    })
  );

  newUnit: CreateUnitCommand = { code: '', name: '' };
  editingId: number | null = null;
  editingUnit = { code: '', name: '', isActive: true };

  // Variáveis para o modal de visualização de colaboradores
  selectedUnitName: string = '';
  unitEmployees: EmployeeModel[] = [];
  showModal: boolean = false;

  constructor(
    private unitService: UnitService, 
    private employeeService: EmployeeService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      alert('Acesso negado! Faça login primeiro.');
      this.router.navigate(['/login']);
      return;
    }

    this.loadUnits();
  }

  loadUnits(): void {
    this.refresh$.next();
  }

  create(): void {
    if (!this.newUnit.code || !this.newUnit.name) {
      alert('Preencha código e nome!');
      return;
    }

    this.unitService.create(this.newUnit).subscribe({
      next: (res) => {
        alert(res.message);
        if (res.isSuccess) {
          this.newUnit = { code: '', name: '' };
          this.loadUnits();
        }
      },
      error: (err) => alert(err.error?.message || 'Erro ao cadastrar.')
    });
  }

  startEdit(unit: UnitModel): void {
    this.editingId = unit.id;
    this.editingUnit = { code: unit.code, name: unit.name, isActive: unit.isActive };
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editingUnit = { code: '', name: '', isActive: true };
  }

  update(): void {
    if (!this.editingId || !this.editingUnit.code || !this.editingUnit.name) {
      alert('Preencha código e nome!');
      return;
    }

    this.unitService.update(this.editingId, this.editingUnit).subscribe({
      next: (res: any) => {
        alert(res.message || 'Unidade atualizada com sucesso!');
        if (res?.isSuccess !== false) {
          this.cancelEdit();
          this.loadUnits();
        }
      },
      error: (err) => alert('Erro na requisição: ' + (err.error?.message || err.message))
    });
  }

  toggleStatus(unit: UnitModel): void {
    const novoStatus = !unit.isActive;
    const acao = novoStatus ? 'ativar' : 'inativar';

    if (!confirm(`Deseja ${acao} esta unidade?`)) return;

    const command = { code: unit.code, name: unit.name, isActive: novoStatus };

    this.unitService.update(unit.id, command).subscribe({
      next: (res: any) => {
        alert(res.message || `Unidade ${novoStatus ? 'ativada' : 'inativada'} com sucesso!`);
        if (res?.isSuccess !== false) {
          this.loadUnits();
        }
      },
      error: (err) => alert('Erro na requisição: ' + (err.error?.message || err.message))
    });
  }

  delete(id: number): void {
    if (!confirm('Deseja excluir permanentemente esta unidade?')) return;

    this.unitService.delete(id).subscribe({
      next: (res) => {
        alert(res.message);
        if (res.isSuccess) {
          this.loadUnits();
        }
      },
      error: (err) => alert(err.error?.message || 'Erro ao excluir.')
    });
  }

  // Métodos do Modal de Colaboradores
  viewEmployees(unit: UnitModel): void {
    this.selectedUnitName = unit.name;
    this.showModal = true;
    
    const targetUnitId = Number((unit as any).id || (unit as any).unitId);

    this.employeeService.getAll().subscribe(res => {
      const allEmployees = Array.isArray(res) ? res : (res?.data || []);
      
      this.unitEmployees = allEmployees.filter((e: any) => Number(e.unitId) === targetUnitId);
      
      // Força a atualização da tela para desenhar o modal corretamente
      this.cdr.detectChanges();
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.unitEmployees = [];
  }
}