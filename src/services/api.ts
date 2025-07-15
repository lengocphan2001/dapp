import { TelegramUser, User, ApiResponse } from '../types';
import { mockAuthService, mockAdminService } from './mockApi';

// For demo purposes, we're using mock services
// In production, replace these with actual API calls
export const authService = mockAuthService;
export const adminService = mockAdminService;

// Real API service (commented out for demo)
/*
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  authenticateWithTelegram: async (telegramUser: TelegramUser): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post('/auth/telegram', telegramUser);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Authentication failed',
      };
    }
  },

  register: async (telegramUser: TelegramUser): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post('/auth/register', telegramUser);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  },

  logout: async (): Promise<ApiResponse<void>> => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('authToken');
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Logout failed',
      };
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get user info',
      };
    }
  },
};

export const adminService = {
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch users',
      };
    }
  },

  updateUserRole: async (userId: string, role: 'user' | 'admin'): Promise<ApiResponse<User>> => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update user role',
      };
    }
  },

  toggleUserStatus: async (userId: string): Promise<ApiResponse<User>> => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update user status',
      };
    }
  },

  deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
    try {
      await api.delete(`/admin/users/${userId}`);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete user',
      };
    }
  },
};

export default api;
*/ 