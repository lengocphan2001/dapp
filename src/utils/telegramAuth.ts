import { TelegramUser } from '../types';

// Telegram Bot Token - In production, this should be stored securely
const BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN || '';

export const telegramAuth = {
  // Initialize Telegram Web App
  initTelegramApp: () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      
      // Set theme
      window.Telegram.WebApp.setHeaderColor('#667eea');
      window.Telegram.WebApp.setBackgroundColor('#0f0f23');
      
      return true;
    }
    return false;
  },

  // Get Telegram user data from URL parameters
  getTelegramUserFromUrl: (): TelegramUser | null => {
    const urlParams = new URLSearchParams(window.location.search);
    const userData = urlParams.get('tgWebAppData');
    
    if (!userData) return null;

    try {
      const decodedData = decodeURIComponent(userData);
      const data = new URLSearchParams(decodedData);
      
      const telegramUser: TelegramUser = {
        id: parseInt(data.get('id') || '0'),
        first_name: data.get('first_name') || '',
        last_name: data.get('last_name') || undefined,
        username: data.get('username') || undefined,
        photo_url: data.get('photo_url') || undefined,
        auth_date: parseInt(data.get('auth_date') || '0'),
        hash: data.get('hash') || '',
      };

      return telegramUser.id > 0 ? telegramUser : null;
    } catch (error) {
      console.error('Error parsing Telegram user data:', error);
      return null;
    }
  },

  // Validate Telegram authentication data
  validateTelegramAuth: (telegramUser: TelegramUser): boolean => {
    if (!telegramUser || !telegramUser.hash) {
      return false;
    }

    // In a real application, you would validate the hash on the backend
    // This is a simplified validation for demo purposes
    const requiredFields = ['id', 'first_name', 'auth_date', 'hash'];
    return requiredFields.every(field => telegramUser[field as keyof TelegramUser]);
  },

  // Get user from Telegram Web App
  getUserFromTelegramApp: (): TelegramUser | null => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
      return {
        id: tgUser.id,
        first_name: tgUser.first_name,
        last_name: tgUser.last_name,
        username: tgUser.username,
        photo_url: tgUser.photo_url,
        auth_date: Math.floor(Date.now() / 1000),
        hash: window.Telegram.WebApp.initData || '',
      };
    }
    return null;
  },

  // Check if running in Telegram Web App
  isTelegramWebApp: (): boolean => {
    return !!window.Telegram?.WebApp;
  },

  // Show Telegram alert
  showAlert: (message: string) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert(message);
    } else {
      window.alert(message);
    }
  },

  // Show Telegram confirm dialog
  showConfirm: (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showConfirm(message, (confirmed) => {
          resolve(confirmed);
        });
      } else {
        resolve(window.confirm(message));
      }
    });
  },

  // Get bot token (for backend validation)
  getBotToken: (): string => {
    return BOT_TOKEN;
  },

  // Check if user is authenticated via Telegram
  isAuthenticated: (): boolean => {
    return !!telegramAuth.getUserFromTelegramApp() || !!telegramAuth.getTelegramUserFromUrl();
  },

  // Get current user (prefer WebApp over URL)
  getCurrentUser: (): TelegramUser | null => {
    return telegramAuth.getUserFromTelegramApp() || telegramAuth.getTelegramUserFromUrl();
  },
};

// Extend Window interface for Telegram Web App
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        showAlert: (message: string) => void;
        showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
          };
        };
      };
    };
  }
} 