// Modelo genérico do ResultViewModel da API
export interface ResultViewModel<T = any> {
  isSuccess: boolean;
  message?: string;
  data?: T;
}

// Models de Usuário
export interface UserListModel {
  id: number;
  code: string; 
  login: string;
  isActive: boolean;
}

export interface CreateUserCommand {
  code: string;
  login: string;
  passwordHash: string;
  isActive: boolean;
}

export interface UpdateUserCommand {
  id: number;
  code: string;
  login: string;
  passwordHash: string; 
  isActive: boolean;
}

// Models de Unidade
export interface UnitModel {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  employees?: EmployeeModel[];
}

export interface CreateUnitCommand {
  code: string;
  name: string;
}

export interface UpdateUnitCommand {
  id?: number;
  name: string;
}

// Models de Colaborador
export interface EmployeeModel {
  id: number;
  code: string;
  name: string;
  unitId: number;
  unitName: string;
  userId: number;
  userLogin: string;
}

export interface CreateEmployeeCommand {
  code: string;
  name: string;
  unitId: number;
  userId: number;
}

export interface UpdateEmployeeCommand {
  id?: number;
  name: string;
  unitId: number;
}