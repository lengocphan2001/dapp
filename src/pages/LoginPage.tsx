import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { telegramAuth } from '../utils/telegramAuth';
import { TelegramUser } from '../types';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isLoading, error } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    // Try to get Telegram user data
    let user = telegramAuth.getUserFromTelegramApp();
    if (!user) {
      user = telegramAuth.getTelegramUserFromUrl();
    }

    if (user && telegramAuth.validateTelegramAuth(user)) {
      setTelegramUser(user);
    }
  }, [isAuthenticated, navigate]);

  const handleTelegramLogin = async () => {
    if (!telegramUser) {
      telegramAuth.showAlert('No Telegram user data found. Please open this app from Telegram.');
      return;
    }

    try {
      if (isRegistering) {
        await register(telegramUser);
      } else {
        await login(telegramUser);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleDemoLogin = async (isAdmin: boolean = false) => {
    // Demo user for testing purposes
    const demoUser: TelegramUser = {
      id: isAdmin ? 987654321 : 123456789,
      first_name: isAdmin ? 'Demo' : 'Demo',
      last_name: isAdmin ? 'Admin' : 'User',
      username: isAdmin ? 'demo_admin' : 'demo_user',
      photo_url: 'https://via.placeholder.com/150',
      auth_date: Math.floor(Date.now() / 1000),
      hash: 'demo-hash',
    };

    setTelegramUser(demoUser);
    
    try {
      if (isRegistering) {
        await register(demoUser);
      } else {
        await login(demoUser);
      }
    } catch (error) {
      console.error('Demo authentication error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="currentColor" className="telegram-icon">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.27-.48.74-.74 2.87-1.25 4.79-2.09 5.76-2.5 2.7-1.15 3.26-1.36 3.63-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
          </div>
          <h1>Telegram DApp</h1>
          <p>Connect with your Telegram account</p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <div className="login-options">
          {telegramUser ? (
            <div className="user-info">
              <div className="user-avatar">
                {telegramUser.photo_url ? (
                  <img src={telegramUser.photo_url} alt="User avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    {telegramUser.first_name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="user-details">
                <h3>{telegramUser.first_name} {telegramUser.last_name}</h3>
                {telegramUser.username && <p>@{telegramUser.username}</p>}
              </div>
              <button 
                className="login-button telegram"
                onClick={handleTelegramLogin}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
              </button>
            </div>
          ) : (
            <>
              <div className="telegram-notice">
                <div className="notice-icon">📱</div>
                <h3>Telegram Required</h3>
                <p>This app works best when opened from Telegram. However, you can try the demo mode below.</p>
              </div>
              
              <button 
                className="login-button telegram disabled"
                onClick={() => telegramAuth.showAlert('Please open this app from Telegram for full functionality.')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="button-icon">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.27-.48.74-.74 2.87-1.25 4.79-2.09 5.76-2.5 2.7-1.15 3.26-1.36 3.63-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
                Login with Telegram
              </button>
              
              <div className="demo-section">
                <div className="demo-header">
                  <h3>🎮 Demo Mode</h3>
                  <p>Try the app with demo data</p>
                </div>
                <div className="demo-buttons">
                  <button 
                    className="login-button demo primary"
                    onClick={() => handleDemoLogin(false)}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Demo User'}
                  </button>
                  <button 
                    className="login-button demo admin"
                    onClick={() => handleDemoLogin(true)}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Demo Admin'}
                  </button>
                </div>
                <div className="demo-features">
                  <span>✅ Full DeFi features</span>
                  <span>✅ Deposit system</span>
                  <span>✅ Admin panel (Admin demo)</span>
                  <span>✅ User management</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mode-toggle">
          <button 
            className={`toggle-button ${!isRegistering ? 'active' : ''}`}
            onClick={() => setIsRegistering(false)}
          >
            Login
          </button>
          <button 
            className={`toggle-button ${isRegistering ? 'active' : ''}`}
            onClick={() => setIsRegistering(true)}
          >
            Register
          </button>
        </div>

        <div className="login-footer">
          <p>💡 <strong>Tip:</strong> For full Telegram integration, open this app from your Telegram bot</p>
          <p>🤖 <strong>Bot Setup:</strong> Message your bot and use the menu button to access the app</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 