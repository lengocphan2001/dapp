import React, { useState, useEffect } from 'react';
import { telegramAuth } from '../utils/telegramAuth';

const TelegramDebug: React.FC = () => {
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
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const handleManualAuth = async () => {
    console.log('Manual auth triggered');
    const user = telegramAuth.getCurrentUser();
    console.log('Manual auth user:', user);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      width: '300px',
      maxHeight: '400px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px',
      overflow: 'auto',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#667eea' }}>🔍 Telegram Debug</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Is Telegram WebApp:</strong> {debugInfo.isTelegramWebApp ? '✅ Yes' : '❌ No'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>User Data:</strong>
        <pre style={{ fontSize: '10px', margin: '5px 0' }}>
          {JSON.stringify(debugInfo.userData, null, 2)}
        </pre>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>URL Params:</strong>
        <div style={{ fontSize: '10px', wordBreak: 'break-all' }}>
          {debugInfo.urlParams || 'None'}
        </div>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>WebApp Object:</strong>
        <pre style={{ fontSize: '10px', margin: '5px 0' }}>
          {JSON.stringify(debugInfo.telegramWebApp, null, 2)}
        </pre>
      </div>
      
      <button 
        onClick={handleManualAuth}
        style={{
          backgroundColor: '#667eea',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Test Auth
      </button>
      
      <div style={{ marginTop: '10px', fontSize: '10px', color: '#999' }}>
        Last updated: {debugInfo.timestamp}
      </div>
    </div>
  );
};

export default TelegramDebug; 