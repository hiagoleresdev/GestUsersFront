import { Routes } from '@angular/router';
import { UsersComponent } from './pages/users/users';
import { UnitsComponent } from './pages/units/units';
import { EmployeesComponent } from './pages/employees/employees';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { MainLayoutComponent } from './components/main-layout/main-layout';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'units', component: UnitsComponent },
      { path: 'employees', component: EmployeesComponent },
      // Adiciona esta linha para quando entrarem na raiz vazia dentro do layout:
      { path: '', redirectTo: 'users', pathMatch: 'full' } 
    ]
  },

  // Mude o redirecionamento raiz para cair direto no layout (ex: /users)
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: '**', redirectTo: 'users' }
];