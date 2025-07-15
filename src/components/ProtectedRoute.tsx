import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { telegramAuth } from '../utils/telegramAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireAdmin = false,
}) => {
  const { user, isAuthenticated, isLoading, autoAuthFromTelegram } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // If we're in Telegram Web App and not authenticated, try auto-auth
    if (telegramAuth.isTelegramWebApp() && !isAuthenticated && !isLoading) {
      autoAuthFromTelegram();
    }
  }, [isAuthenticated, isLoading, autoAuthFromTelegram]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div>Loading DeFi DApp...</div>
        {telegramAuth.isTelegramWebApp() && (
          <div style={{ fontSize: '14px', color: '#999' }}>
            Authenticating with Telegram...
          </div>
        )}
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // If we're in Telegram Web App, show a message instead of redirecting
    if (telegramAuth.isTelegramWebApp()) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          color: '#666',
          flexDirection: 'column',
          gap: '10px',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div>🔐 Authentication Required</div>
          <div style={{ fontSize: '14px', color: '#999' }}>
            Please open this app from Telegram to continue.
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      );
    }
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin role is required but user is not admin
  if (requireAdmin && (!user || user.role !== 'admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is authenticated but trying to access login page, redirect to dashboard
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 