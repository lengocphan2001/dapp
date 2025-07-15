import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { telegramAuth } from '../utils/telegramAuth';

const TestPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [telegramUser, setTelegramUser] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const updateDebugInfo = () => {
      const info = {
        isTelegramWebApp: telegramAuth.isTelegramWebApp(),
        telegramWebApp: window.Telegram?.WebApp,
        userData: telegramAuth.getCurrentUser(),
        urlParams: new URLSearchParams(window.location.search).toString(),
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };
      setDebugInfo(info);
      setTelegramUser(telegramAuth.getCurrentUser());
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleManualLogin = async () => {
    if (telegramUser) {
      try {
        await login(telegramUser);
        navigate('/dashboard');
      } catch (error) {
        console.error('Manual login failed:', error);
      }
    }
  };

  const handleDemoLogin = async () => {
    const demoUser = {
      id: 123456789,
      first_name: 'Demo',
      last_name: 'User',
      username: 'demo_user',
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

  if (isAuthenticated) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>✅ Already Authenticated!</h2>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '10px'
          }}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔍 Telegram Web App Test Page</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>Authentication Status</h3>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <p><strong>Is Telegram WebApp:</strong> {debugInfo.isTelegramWebApp ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Has User Data:</strong> {telegramUser ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Is Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Manual Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={handleManualLogin}
            disabled={!telegramUser}
            style={{
              backgroundColor: telegramUser ? '#667eea' : '#ccc',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: telegramUser ? 'pointer' : 'not-allowed'
            }}
          >
            Login with Telegram Data
          </button>
          
          <button 
            onClick={handleDemoLogin}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Demo Login
          </button>
        </div>
      </div>

      {telegramUser && (
        <div style={{ marginBottom: '30px' }}>
          <h3>Telegram User Data</h3>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '5px',
            overflow: 'auto'
          }}>
            {JSON.stringify(telegramUser, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h3>Debug Information</h3>
        <details>
          <summary>Click to expand debug info</summary>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '5px',
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </details>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Instructions</h3>
        <ol style={{ textAlign: 'left' }}>
          <li>If you're testing in Telegram, the app should automatically authenticate you</li>
          <li>If automatic authentication fails, try the "Login with Telegram Data" button</li>
          <li>If no Telegram data is available, use "Demo Login" to test the app</li>
          <li>Check the debug information to see what data is available</li>
        </ol>
      </div>
    </div>
  );
};

export default TestPage; 