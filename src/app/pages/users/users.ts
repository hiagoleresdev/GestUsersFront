import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserListModel, CreateUserCommand, UpdateUserCommand } from '../../models/models';
import { Observable, BehaviorSubject, switchMap, map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class UsersComponent implements OnInit {
  private refresh$ = new BehaviorSubject<void>(undefined);
  
  users$: Observable<UserListModel[]> = this.refresh$.pipe(
    switchMap(() => this.userService.getAll()),
    map(res => {
      const list = res?.data || (Array.isArray(res) ? res : []);
      if (this.statusFilter === 'active') return list.filter(u => u.isActive);
      if (this.statusFilter === 'inactive') return list.filter(u => !u.isActive);
      return list;
    })
  );

  statusFilter: string = 'all';

  newUser: CreateUserCommand = { code: '', login: '', passwordHash: '', isActive: true };
  editingUser: UpdateUserCommand | null = null;
  editingUserId: number | null = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      alert('Acesso negado! Faça login primeiro.');
      this.router.navigate(['/login']);
      return;
    }

    this.loadUsers();
  }

  loadUsers(): void {
    this.refresh$.next();
  }

  applyFilter(): void {
    this.loadUsers();
  }

  create(): void {
    if (!this.newUser.code || !this.newUser.login || !this.newUser.passwordHash) {
      alert('Preencha todos os campos!');
      return;
    }

    this.userService.create(this.newUser).subscribe({
      next: (res) => {
        alert(res.message);
        if (res.isSuccess) {
          this.newUser = { code: '', login: '', passwordHash: '', isActive: true };
          this.loadUsers();
        }
      },
      error: (err) => alert(err.error?.message || 'Erro ao cadastrar usuário.')
    });
  }

  startEdit(user: UserListModel): void {
    this.editingUserId = user.id;
    this.editingUser = { 
      id: user.id, 
      code: user.code,       
      login: user.login,     
      passwordHash: '',      
      isActive: user.isActive 
    };
  }

  cancelEdit(): void {
    this.editingUserId = null;
    this.editingUser = null;
  }

  update(): void {
    if (!this.editingUserId || !this.editingUser) return;

    this.userService.update(this.editingUserId, this.editingUser).subscribe({
      next: (res) => {
        alert(res.message);
        if (res.isSuccess) {
          this.cancelEdit();
          this.loadUsers();
        }
      },
      error: (err) => alert(err.error?.message || 'Erro ao atualizar usuário.')
    });
  }
}