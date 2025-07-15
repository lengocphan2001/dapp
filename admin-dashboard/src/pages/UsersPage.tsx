import React, { useState, useEffect } from 'react';
import { User, UserFilters, PaginatedResponse } from '../types';
import apiService from '../services/api';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Crown,
  User as UserIcon,
  Calendar,
  DollarSign
} from 'lucide-react';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [filters, setFilters] = useState<UserFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getUsers(filters, pagination.page, pagination.limit);
      if (response.success && response.data) {
        setUsers(response.data.data);
        setPagination(prev => ({ ...prev, total: response.data!.pagination.total }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const response = await apiService.updateUserRole(userId, newRole);
      if (response.success) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleStatusToggle = async (userId: string) => {
    try {
      const response = await apiService.toggleUserStatus(userId);
      if (response.success) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, isActive: !user.isActive } : user
        ));
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await apiService.deleteUser(userId);
        if (response.success) {
          setUsers(prev => prev.filter(user => user.id !== userId));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const UserCard: React.FC<{ user: User }> = ({ user }) => (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            {user.photoUrl ? (
              <img src={user.photoUrl} alt={user.username} className="w-12 h-12 rounded-full" />
            ) : (
              <UserIcon className="h-6 w-6 text-white" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">@{user.username}</h3>
              {user.role === 'admin' && (
                <Crown className="h-4 w-4 text-yellow-500" />
              )}
              <span className={`px-2 py-1 text-xs rounded-full ${
                user.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-sm text-gray-600">{user.firstName} {user.lastName}</p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                ${user.totalDeposits || 0}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={user.role}
            onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'admin')}
            className="text-xs border border-gray-300 rounded px-2 py-1"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          
          <button
            onClick={() => handleStatusToggle(user.id)}
            className={`p-1 rounded ${
              user.isActive 
                ? 'text-red-600 hover:bg-red-50' 
                : 'text-green-600 hover:bg-green-50'
            }`}
          >
            {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
          </button>
          
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="p-1 rounded text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
              <p className="text-gray-600">Manage your platform users</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {pagination.total} total users
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="input pl-10"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-secondary"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={filters.role || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as any }))}
                    className="input"
                  >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                    className="input"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={filters.sortBy || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                    className="input"
                  >
                    <option value="createdAt">Registration Date</option>
                    <option value="lastLoginAt">Last Login</option>
                    <option value="username">Username</option>
                    <option value="totalDeposits">Total Deposits</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Users List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage; 