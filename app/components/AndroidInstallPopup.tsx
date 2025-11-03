'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function AndroidInstallPopup() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if Android
    const userAgent = navigator.userAgent.toLowerCase();
    const android = /android/.test(userAgent);
    setIsAndroid(android);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user already dismissed the popup
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      return;
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show popup after 2 seconds
      setTimeout(() => {
        setShowPopup(true);
      }, 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show install prompt
    deferredPrompt.prompt();

    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setIsInstalled(true);
    }

    // Hide popup
    setShowPopup(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPopup(false);
    // Remember dismissal for 7 days
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if not Android or already installed or no prompt available
  if (!isAndroid || isInstalled || !deferredPrompt || !showPopup) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-[9998] animate-fade-in"
        onClick={handleDismiss}
      />
      
      {/* Popup Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up">
        <div className="mx-4 mb-4 bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Content */}
          <div className="p-4 flex items-center gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">CPK</span>
            </div>
            
            {/* Text */}
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 font-semibold text-sm leading-tight">
                Als App installieren
              </h3>
              <p className="text-gray-600 text-xs mt-0.5">
                Schneller Zugriff vom Startbildschirm
              </p>
            </div>
            
            {/* Buttons */}
            <div className="flex-shrink-0 flex gap-2">
              <button
                onClick={handleDismiss}
                className="px-3 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded transition-colors"
              >
                Später
              </button>
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
              >
                Installieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

