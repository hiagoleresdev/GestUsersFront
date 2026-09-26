import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="d-flex" style="height: 100vh;">
      <!-- Sidebar -->
      <div class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style="width: 250px;">
        <span class="fs-4 fw-bold mb-3 border-bottom pb-1">SGC</span>
        <ul class="nav nav-pills flex-column mb-auto gap-2">
          <li class="nav-item">
            <a routerLink="/users" class="nav-link text-white" routerLinkActive="active">👤 Usuários</a>
          </li>
          <li>
            <a routerLink="/units" class="nav-link text-white" routerLinkActive="active">🏢 Unidades</a>
          </li>
          <li>
            <a routerLink="/employees" class="nav-link text-white" routerLinkActive="active">💼 Colaboradores</a>
          </li>
        </ul>

        <div class="mt-auto pt-3 border-top">
          <button (click)="logout()" class="btn btn-outline-danger w-100 text-start d-flex align-items-center gap-2">
            🚪 Sair
          </button>
        </div>
      </div>

      <!-- Conteúdo das telas internas -->
      <main class="flex-grow-1 p-4 bg-light" style="overflow-y: auto;">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class MainLayoutComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}