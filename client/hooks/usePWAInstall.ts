'use client';

import { useState, useEffect } from 'react';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      // Clear the session storage when app is installed
      sessionStorage.removeItem('pwaPromptDismissed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [deferredPrompt]);
  // Add to your usePWAInstall hook
useEffect(() => {
  console.log('PWA Status:', {
    isInstallable,
    isInstalled,
    deferredPrompt: !!deferredPrompt,
    displayMode: window.matchMedia('(display-mode: standalone)').matches
  });
}, [isInstallable, isInstalled, deferredPrompt]);

  const showInstallPrompt = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setIsInstalled(true);
      sessionStorage.removeItem('pwaPromptDismissed'); // Clear if installed
    } else {
      console.log('User dismissed the install prompt');
      // STORE THE DISMISSAL IN SESSION STORAGE
      sessionStorage.setItem('pwaPromptDismissed', 'true');
    }
    
    // Clear the saved prompt since it can't be used again
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return {
    isInstallable,
    isInstalled,
    showInstallPrompt,
  };
}