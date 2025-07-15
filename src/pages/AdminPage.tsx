import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { adminService } from '../services/api';
import { User } from '../types';
import { telegramAuth } from '../utils/telegramAuth';
import './AdminPage.css';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      telegramAuth.showAlert('Access denied. Admin privileges required.');
      navigate('/dashboard');
      return;
    }

    loadUsers();
  }, [user, navigate]);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await adminService.getAllUsers();
      
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.error || 'Failed to load users');
      }
    } catch (error) {
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const response = await adminService.updateUserRole(userId, newRole);
      
      if (response.success && response.data) {
        setUsers(users.map(user => 
          user.id === userId ? response.data! : user
        ));
        telegramAuth.showAlert(`User role updated to ${newRole}`);
      } else {
        telegramAuth.showAlert(response.error || 'Failed to update role');
      }
    } catch (error) {
      telegramAuth.showAlert('Failed to update role');
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      const response = await adminService.toggleUserStatus(userId);
      
      if (response.success && response.data) {
        setUsers(users.map(user => 
          user.id === userId ? response.data! : user
        ));
        telegramAuth.showAlert('User status updated');
      } else {
        telegramAuth.showAlert(response.error || 'Failed to update status');
      }
    } catch (error) {
      telegramAuth.showAlert('Failed to update status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const confirmed = await telegramAuth.showConfirm(
      'Are you sure you want to delete this user? This action cannot be undone.'
    );
    
    if (!confirmed) return;

    try {
      const response = await adminService.deleteUser(userId);
      
      if (response.success) {
        setUsers(users.filter(user => user.id !== userId));
        telegramAuth.showAlert('User deleted successfully');
      } else {
        telegramAuth.showAlert(response.error || 'Failed to delete user');
      }
    } catch (error) {
      telegramAuth.showAlert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.telegramId.toString().includes(searchTerm)
  );

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/dashboard')}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              Back to Dashboard
            </button>
            <h1>Admin Panel</h1>
          </div>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-number">{users.length}</span>
              <span className="stat-label">Total Users</span>
            </div>
            <div className="stat">
              <span className="stat-number">{users.filter(u => u.role === 'admin').length}</span>
              <span className="stat-label">Admins</span>
            </div>
            <div className="stat">
              <span className="stat-number">{users.filter(u => u.isActive).length}</span>
              <span className="stat-label">Active</span>
            </div>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-controls">
          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="currentColor" className="search-icon">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="refresh-button" onClick={loadUsers} disabled={isLoading}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            Refresh
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Telegram ID</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="user-cell">
                      <div className="user-avatar">
                        {user.photoUrl ? (
                          <img src={user.photoUrl} alt="User avatar" />
                        ) : (
                          <div className="avatar-placeholder">
                            {user.firstName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="user-info">
                        <div className="user-name">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="user-username">@{user.username}</div>
                      </div>
                    </td>
                    <td>{user.telegramId}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value as 'user' | 'admin')}
                        className={`role-select ${user.role}`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`status-toggle ${user.isActive ? 'active' : 'inactive'}`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(user.lastLoginAt).toLocaleString()}</td>
                    <td className="actions-cell">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                        className="action-button view"
                        title="View Details"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="action-button delete"
                        title="Delete User"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="user-detail-row">
                <label>Name:</label>
                <span>{selectedUser.firstName} {selectedUser.lastName}</span>
              </div>
              <div className="user-detail-row">
                <label>Username:</label>
                <span>@{selectedUser.username}</span>
              </div>
              <div className="user-detail-row">
                <label>Telegram ID:</label>
                <span>{selectedUser.telegramId}</span>
              </div>
              <div className="user-detail-row">
                <label>Role:</label>
                <span className={`role-badge ${selectedUser.role}`}>
                  {selectedUser.role.toUpperCase()}
                </span>
              </div>
              <div className="user-detail-row">
                <label>Status:</label>
                <span className={`status-badge ${selectedUser.isActive ? 'active' : 'inactive'}`}>
                  {selectedUser.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="user-detail-row">
                <label>Joined:</label>
                <span>{new Date(selectedUser.createdAt).toLocaleString()}</span>
              </div>
              <div className="user-detail-row">
                <label>Last Login:</label>
                <span>{new Date(selectedUser.lastLoginAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage; 