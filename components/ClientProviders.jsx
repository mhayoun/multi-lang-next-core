'use client'; // Indispensable ici

import { SessionProvider } from "next-auth/react";
import { useEffect } from 'react';

// =========================================================================
// CRITICAL: GLOBAL WINDOW INTERCEPTOR
// This runs instantly when the file is loaded, bypassing React lifecycle delays.
// =========================================================================
if (typeof window !== 'undefined') {
  // Initialize the global container if it doesn't exist
  if (!('deferredPWAInstallPrompt' in window)) {
    window.deferredPWAInstallPrompt = null;
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    console.log("PWA Debug [Global]: 'beforeinstallprompt' intercepted early!");
    // Prevent the default mini-infobar from appearing automatically
    e.preventDefault();
    // Cache the event globally so hooks can read it whenever they mount
    window.deferredPWAInstallPrompt = e;

    // Notify any active hooks that the prompt is ready
    window.dispatchEvent(new CustomEvent('pwa-prompt-ready'));
  });
}

export default function ClientProviders({ children }) {
  useEffect(() => {
    // Only run in the browser and if Service Workers are supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('SW registered successfully with scope:', registration.scope);
        } catch (error) {
          console.error('SW registration failed:', error);
        }
      };

      // Register when the page has fully loaded
      if (document.readyState === 'complete') {
        registerServiceWorker();
      } else {
        window.addEventListener('load', registerServiceWorker);
        return () => window.removeEventListener('load', registerServiceWorker);
      }
    }
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}