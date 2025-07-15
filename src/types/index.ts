export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface User {
  id: string;
  telegramId: number;
  username: string;
  firstName: string;
  lastName?: string;
  photoUrl?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: Date;
  lastLoginAt: Date;
}
 
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AdminUserManagement {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 