import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, User, TelegramUser } from '../types';
import { authService } from '../services/api';
import { telegramAuth } from '../utils/telegramAuth';

interface AuthContextType extends AuthState {
  login: (telegramUser: TelegramUser) => Promise<void>;
  register: (telegramUser: TelegramUser) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  autoAuthFromTelegram: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const autoAuthFromTelegram = async () => {
    // Check if we're in Telegram Web App
    if (!telegramAuth.isTelegramWebApp()) {
      return;
    }

    // Get Telegram user data
    const telegramUser = telegramAuth.getCurrentUser();
    if (!telegramUser) {
      console.log('No Telegram user data found');
      return;
    }

    // Validate Telegram authentication
    if (!telegramAuth.validateTelegramAuth(telegramUser)) {
      console.log('Invalid Telegram authentication data');
      return;
    }

    // Auto-authenticate the user
    await login(telegramUser);
  };

  const login = async (telegramUser: TelegramUser) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await authService.authenticateWithTelegram(telegramUser);
      
      if (response.success && response.data) {
        // Store auth token if provided
        if (response.data) {
          localStorage.setItem('authToken', 'demo-token'); // In real app, use actual token
          localStorage.setItem('telegramUser', JSON.stringify(telegramUser));
        }
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.error || 'Login failed' });
      }
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'Login failed' });
    }
  };

  const register = async (telegramUser: TelegramUser) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await authService.register(telegramUser);
      
      if (response.success && response.data) {
        // Store auth token if provided
        if (response.data) {
          localStorage.setItem('authToken', 'demo-token'); // In real app, use actual token
          localStorage.setItem('telegramUser', JSON.stringify(telegramUser));
        }
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.error || 'Registration failed' });
      }
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'Registration failed' });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('telegramUser');
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      dispatch({ type: 'AUTH_LOGOUT' });
      return;
    }

    try {
      const response = await authService.getCurrentUser();
      
      if (response.success && response.data) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('telegramUser');
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('telegramUser');
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  useEffect(() => {
    // Initialize Telegram Web App
    telegramAuth.initTelegramApp();
    
    // Check for existing authentication first
    checkAuth().then(() => {
      // If not authenticated, try auto-auth from Telegram
      if (!state.isAuthenticated) {
        autoAuthFromTelegram();
      }
    });
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    checkAuth,
    autoAuthFromTelegram,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 