'use client'; // Indispensable ici

import { SessionProvider } from "next-auth/react";
import { useEffect } from 'react';

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