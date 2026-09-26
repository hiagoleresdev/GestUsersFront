import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  user = {
    code: '',
    login: '',
    passwordHash: '',
    isActive: true
  };

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.authService.register(this.user).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          alert('Cadastro realizado com sucesso! Faça login.');
          this.router.navigate(['/login']);
        } else {
          alert(res.message || 'Erro ao registrar.');
        }
      },
      error: () => alert('Erro de conexão ou dados inválidos ao cadastrar.')
    });
  }
}