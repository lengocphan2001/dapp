import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDemoLogin = async (isAdmin: boolean = false) => {
    const demoUser = {
      id: isAdmin ? 987654321 : 123456789,
      first_name: isAdmin ? 'Admin' : 'Demo',
      last_name: 'User',
      username: isAdmin ? 'admin_user' : 'demo_user',
      photo_url: undefined,
      auth_date: Math.floor(Date.now() / 1000),
      hash: 'demo-hash',
    };

    try {
      await login(demoUser);
      navigate('/dashboard');
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  const handleTelegramLogin = () => {
    // This would typically open Telegram OAuth
    // For now, we'll use demo login
    handleDemoLogin();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            💰
          </div>
          <h1 className="login-title">Welcome to DeFi DApp</h1>
          <p className="login-subtitle">Your gateway to decentralized finance</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="demo-buttons">
          <button
            className="demo-button"
            onClick={() => handleDemoLogin(false)}
            disabled={isLoading}
          >
            👤 Demo User
          </button>
          <button
            className="demo-button admin"
            onClick={() => handleDemoLogin(true)}
            disabled={isLoading}
          >
            👑 Demo Admin
          </button>
        </div>

        <div className="login-divider">
          or
        </div>

        <button
          className="telegram-login"
          onClick={handleTelegramLogin}
          disabled={isLoading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          Login with Telegram
        </button>

        <div className="login-footer">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
          <p>Need help? <a href="#support">Contact Support</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 