import { User, Transaction, Deposit, AdminUser } from '../types';

// Mock admin users
export const adminUsers: AdminUser[] = [
  {
    id: '1',
    email: 'admin@defi.com',
    name: 'Admin User',
    role: 'super_admin',
    isActive: true,
    lastLoginAt: new Date(),
  },
  {
    id: '2',
    email: 'moderator@defi.com',
    name: 'Moderator',
    role: 'admin',
    isActive: true,
    lastLoginAt: new Date(),
  },
];

// Mock users
export const users: User[] = [
  {
    id: '1',
    telegramId: 123456789,
    username: 'crypto_trader',
    firstName: 'John',
    lastName: 'Doe',
    photoUrl: 'https://via.placeholder.com/150',
    role: 'user',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    lastLoginAt: new Date(),
    email: 'john@example.com',
    phone: '+1234567890',
    totalDeposits: 5000,
    totalTransactions: 25,
    balance: 2500,
  },
  {
    id: '2',
    telegramId: 987654321,
    username: 'defi_enthusiast',
    firstName: 'Jane',
    lastName: 'Smith',
    photoUrl: 'https://via.placeholder.com/150',
    role: 'user',
    isActive: true,
    createdAt: new Date('2024-02-20'),
    lastLoginAt: new Date(),
    email: 'jane@example.com',
    phone: '+0987654321',
    totalDeposits: 3000,
    totalTransactions: 15,
    balance: 1800,
  },
  {
    id: '3',
    telegramId: 555666777,
    username: 'newbie_investor',
    firstName: 'Bob',
    lastName: 'Johnson',
    photoUrl: 'https://via.placeholder.com/150',
    role: 'user',
    isActive: false,
    createdAt: new Date('2024-03-10'),
    lastLoginAt: new Date('2024-03-15'),
    email: 'bob@example.com',
    phone: '+1122334455',
    totalDeposits: 500,
    totalTransactions: 3,
    balance: 200,
  },
  {
    id: '4',
    telegramId: 111222333,
    username: 'whale_trader',
    firstName: 'Alice',
    lastName: 'Brown',
    photoUrl: 'https://via.placeholder.com/150',
    role: 'admin',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    lastLoginAt: new Date(),
    email: 'alice@example.com',
    phone: '+1555666777',
    totalDeposits: 50000,
    totalTransactions: 150,
    balance: 35000,
  },
];

// Mock transactions
export const transactions: Transaction[] = [
  {
    id: '1',
    userId: '1',
    type: 'deposit',
    amount: 1000,
    token: 'USDT',
    status: 'completed',
    createdAt: new Date('2024-01-15'),
    txHash: '0x1234567890abcdef',
  },
  {
    id: '2',
    userId: '1',
    type: 'swap',
    amount: 500,
    token: 'ETH',
    status: 'completed',
    createdAt: new Date('2024-01-16'),
    txHash: '0xabcdef1234567890',
  },
  {
    id: '3',
    userId: '2',
    type: 'stake',
    amount: 2000,
    token: 'USDT',
    status: 'pending',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '4',
    userId: '4',
    type: 'deposit',
    amount: 10000,
    token: 'USDT',
    status: 'completed',
    createdAt: new Date('2024-01-01'),
    txHash: '0x9876543210fedcba',
  },
];

// Mock deposits
export const deposits: Deposit[] = [
  {
    id: '1',
    userId: '1',
    amount: 1000,
    currency: 'USDT',
    method: 'crypto',
    status: 'completed',
    createdAt: new Date('2024-01-15'),
    completedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    userId: '2',
    amount: 3000,
    currency: 'USDT',
    method: 'card',
    status: 'completed',
    createdAt: new Date('2024-02-20'),
    completedAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    userId: '3',
    amount: 500,
    currency: 'USDT',
    method: 'bank',
    status: 'pending',
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    userId: '4',
    amount: 10000,
    currency: 'USDT',
    method: 'crypto',
    status: 'completed',
    createdAt: new Date('2024-01-01'),
    completedAt: new Date('2024-01-01'),
  },
];

// Helper functions
export const findUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const findAdminByEmail = (email: string): AdminUser | undefined => {
  return adminUsers.find(admin => admin.email === email);
};

export const getUsersWithFilters = (
  filters: any,
  page: number = 1,
  limit: number = 20
) => {
  let filteredUsers = [...users];

  // Apply search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredUsers = filteredUsers.filter(user =>
      user.username.toLowerCase().includes(searchTerm) ||
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm)
    );
  }

  // Apply role filter
  if (filters.role) {
    filteredUsers = filteredUsers.filter(user => user.role === filters.role);
  }

  // Apply status filter
  if (filters.status) {
    const isActive = filters.status === 'active';
    filteredUsers = filteredUsers.filter(user => user.isActive === isActive);
  }

  // Apply sorting
  if (filters.sortBy) {
    filteredUsers.sort((a, b) => {
      const aValue = a[filters.sortBy as keyof User];
      const bValue = b[filters.sortBy as keyof User];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return filters.sortOrder === 'desc' 
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return filters.sortOrder === 'desc'
          ? bValue.getTime() - aValue.getTime()
          : aValue.getTime() - bValue.getTime();
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return filters.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
      }
      
      return 0;
    });
  }

  const total = filteredUsers.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return {
    data: paginatedUsers,
    pagination: {
      page,
      limit,
      total,
    },
  };
}; 