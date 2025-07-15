import { TelegramUser, User, ApiResponse } from '../types';

// Mock data storage
let users: User[] = [
  {
    id: '1',
    telegramId: 123456789,
    username: 'demo_user',
    firstName: 'Demo',
    lastName: 'User',
    photoUrl: 'https://via.placeholder.com/150',
    role: 'user',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    lastLoginAt: new Date(),
  },
  {
    id: '2',
    telegramId: 987654321,
    username: 'admin_user',
    firstName: 'Admin',
    lastName: 'User',
    photoUrl: 'https://via.placeholder.com/150',
    role: 'admin',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    lastLoginAt: new Date(),
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  authenticateWithTelegram: async (telegramUser: TelegramUser): Promise<ApiResponse<User>> => {
    await delay(1000); // Simulate network delay
    
    const existingUser = users.find(u => u.telegramId === telegramUser.id);
    
    if (existingUser) {
      // Update last login
      existingUser.lastLoginAt = new Date();
      return {
        success: true,
        data: existingUser,
        message: 'Login successful',
      };
    }
    
    return {
      success: false,
      error: 'User not found. Please register first.',
    };
  },

  register: async (telegramUser: TelegramUser): Promise<ApiResponse<User>> => {
    await delay(1000);
    
    const existingUser = users.find(u => u.telegramId === telegramUser.id);
    
    if (existingUser) {
      return {
        success: false,
        error: 'User already exists. Please login instead.',
      };
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      telegramId: telegramUser.id,
      username: telegramUser.username || `user_${telegramUser.id}`,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      photoUrl: telegramUser.photo_url,
      role: 'user',
      isActive: true,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };
    
    users.push(newUser);
    
    return {
      success: true,
      data: newUser,
      message: 'Registration successful',
    };
  },

  logout: async (): Promise<ApiResponse<void>> => {
    await delay(500);
    return { success: true };
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    await delay(500);
    
    // In a real app, this would get the user from the token
    // For demo, return the first user
    const user = users[0];
    
    if (user) {
      return {
        success: true,
        data: user,
      };
    }
    
    return {
      success: false,
      error: 'User not found',
    };
  },
};

export const mockAdminService = {
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    await delay(800);
    return {
      success: true,
      data: users,
    };
  },

  updateUserRole: async (userId: string, role: 'user' | 'admin'): Promise<ApiResponse<User>> => {
    await delay(500);
    
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    
    user.role = role;
    
    return {
      success: true,
      data: user,
      message: 'Role updated successfully',
    };
  },

  toggleUserStatus: async (userId: string): Promise<ApiResponse<User>> => {
    await delay(500);
    
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    
    user.isActive = !user.isActive;
    
    return {
      success: true,
      data: user,
      message: 'Status updated successfully',
    };
  },

  deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
    await delay(500);
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    
    users.splice(userIndex, 1);
    
    return {
      success: true,
      message: 'User deleted successfully',
    };
  },
}; 