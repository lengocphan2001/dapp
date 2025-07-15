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
  email?: string;
  phone?: string;
  totalDeposits?: number;
  totalTransactions?: number;
  balance?: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
  lastLoginAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'swap' | 'stake' | 'unstake';
  amount: number;
  token: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  txHash?: string;
}

export interface Deposit {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  method: 'crypto' | 'card' | 'bank';
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    newToday: number;
    newThisWeek: number;
  };
  transactions: {
    total: number;
    today: number;
    thisWeek: number;
    totalVolume: number;
  };
  deposits: {
    total: number;
    today: number;
    thisWeek: number;
    totalAmount: number;
  };
  revenue: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserFilters {
  search?: string;
  role?: 'user' | 'admin';
  status?: 'active' | 'inactive';
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'lastLoginAt' | 'username' | 'totalDeposits';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationParams;
} 