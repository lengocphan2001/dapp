import axios, { AxiosInstance } from 'axios';
import { 
  User, 
  AdminStats, 
  Transaction, 
  Deposit, 
  ApiResponse, 
  LoginCredentials, 
  AdminUser,
  DashboardStats,
  UserFilters,
  PaginatedResponse
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('adminToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: AdminUser }>> {
    try {
      const response = await this.api.post('/admin/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      await this.api.post('/admin/auth/logout');
      localStorage.removeItem('adminToken');
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Logout failed',
      };
    }
  }

  async getCurrentAdmin(): Promise<ApiResponse<AdminUser>> {
    try {
      const response = await this.api.get('/admin/auth/me');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get admin info',
      };
    }
  }

  // Dashboard
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const response = await this.api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get dashboard stats',
      };
    }
  }

  async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    try {
      const response = await this.api.get('/admin/stats');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get admin stats',
      };
    }
  }

  // Users
  async getUsers(filters?: UserFilters, page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<User>>> {
    try {
      const params = { page, limit, ...filters };
      const response = await this.api.get('/admin/users', { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get users',
      };
    }
  }

  async getUserById(userId: string): Promise<ApiResponse<User>> {
    try {
      const response = await this.api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get user',
      };
    }
  }

  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<ApiResponse<User>> {
    try {
      const response = await this.api.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update user role',
      };
    }
  }

  async toggleUserStatus(userId: string): Promise<ApiResponse<User>> {
    try {
      const response = await this.api.put(`/admin/users/${userId}/status`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to toggle user status',
      };
    }
  }

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    try {
      await this.api.delete(`/admin/users/${userId}`);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete user',
      };
    }
  }

  // Transactions
  async getTransactions(page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    try {
      const response = await this.api.get('/admin/transactions', { params: { page, limit } });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get transactions',
      };
    }
  }

  async getTransactionById(transactionId: string): Promise<ApiResponse<Transaction>> {
    try {
      const response = await this.api.get(`/admin/transactions/${transactionId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get transaction',
      };
    }
  }

  // Deposits
  async getDeposits(page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<Deposit>>> {
    try {
      const response = await this.api.get('/admin/deposits', { params: { page, limit } });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get deposits',
      };
    }
  }

  async getDepositById(depositId: string): Promise<ApiResponse<Deposit>> {
    try {
      const response = await this.api.get(`/admin/deposits/${depositId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get deposit',
      };
    }
  }

  async updateDepositStatus(depositId: string, status: 'pending' | 'completed' | 'failed'): Promise<ApiResponse<Deposit>> {
    try {
      const response = await this.api.put(`/admin/deposits/${depositId}/status`, { status });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update deposit status',
      };
    }
  }

  // Analytics
  async getUserGrowthData(days: number = 30): Promise<ApiResponse<{ date: string; users: number }[]>> {
    try {
      const response = await this.api.get('/admin/analytics/user-growth', { params: { days } });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get user growth data',
      };
    }
  }

  async getTransactionVolumeData(days: number = 30): Promise<ApiResponse<{ date: string; volume: number }[]>> {
    try {
      const response = await this.api.get('/admin/analytics/transaction-volume', { params: { days } });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get transaction volume data',
      };
    }
  }

  async getRevenueData(days: number = 30): Promise<ApiResponse<{ date: string; revenue: number }[]>> {
    try {
      const response = await this.api.get('/admin/analytics/revenue', { params: { days } });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get revenue data',
      };
    }
  }
}

export const apiService = new ApiService();
export default apiService; 