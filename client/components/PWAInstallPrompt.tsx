'use client';

import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useEffect, useState } from 'react';

export default function SmartPWAInstallPrompt() {
  const { isInstallable, isInstalled, showInstallPrompt } = usePWAInstall();
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed the prompt
    const wasDismissed = sessionStorage.getItem('pwaPromptDismissed');
    
    if (isInstallable && !isInstalled && !wasDismissed) {
      // Show custom prompt instead of automatically triggering install
      setShowCustomPrompt(true);
    }
  }, [isInstallable, isInstalled]);

  const handleInstallClick = async () => {
    await showInstallPrompt();
    setShowCustomPrompt(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwaPromptDismissed', 'true');
    setShowCustomPrompt(false);
  };

  // Don't show if already installed or not installable
  if (!showCustomPrompt || isInstalled) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      border: '1px solid #ddd'
    }}>
      <p style={{ margin: '0 0 12px 0' }}>Install our app for better experience!</p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={handleInstallClick}
          style={{
            padding: '8px 16px',
            background: '#d111c4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Install
        </button>
        <button 
          onClick={handleDismiss}
          style={{
            padding: '8px 16px',
            background: '#f0f0f0',
            color: '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Later
        </button>
      </div>
    </div>
  );
}