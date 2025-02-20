export type UserRole = 'ADMIN' | 'CONCILIATOR' | 'RECEPTIONIST' | 'ARCHIVE' | 'REQUESTS' | 'NOTIFICATIONS';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  roles?: UserRole[];
}

export interface AuthResponse {
  user: User;
  token: string;
}