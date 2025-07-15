import React from 'react';
import { useAuth } from './AuthContext';
import { telegramAuth } from '../utils/telegramAuth';

const TelegramProfile: React.FC = () => {
  const { user } = useAuth();
  const telegramUser = telegramAuth.getCurrentUser();

  if (!telegramAuth.isTelegramWebApp() || !telegramUser) {
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      borderRadius: '8px',
      margin: '10px 0',
      border: '1px solid rgba(102, 126, 234, 0.2)'
    }}>
      {telegramUser.photo_url && (
        <img 
          src={telegramUser.photo_url} 
          alt="Profile" 
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
      )}
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontWeight: 'bold', 
          fontSize: '14px',
          color: '#333'
        }}>
          {telegramUser.first_name} {telegramUser.last_name || ''}
        </div>
        {telegramUser.username && (
          <div style={{ 
            fontSize: '12px', 
            color: '#666',
            fontStyle: 'italic'
          }}>
            @{telegramUser.username}
          </div>
        )}
      </div>
      <div style={{
        fontSize: '12px',
        color: '#667eea',
        fontWeight: 'bold'
      }}>
        🔗 Telegram
      </div>
    </div>
  );
};

export default TelegramProfile; 