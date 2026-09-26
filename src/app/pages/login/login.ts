import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginData = { login: '', passwordHash: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // Salva o token gerado pela API no localStorage
          localStorage.setItem('token', res.data); 
          
          this.router.navigate(['/users']); 
        } else {
          alert(res.message || 'Erro ao logar');
        }
      },
      error: () => alert('Usuário ou senha inválidos.')
    });
  }
}