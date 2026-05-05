'use client';
import { useState, useEffect } from 'react';

export default function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    // 1. Initial Check
    console.log("PWA Debug: Hook mounted. Checking environment...");

    if (typeof window === 'undefined') return;

    // 2. Event Listener
    const handler = (e) => {
      console.log("PWA Debug: 'beforeinstallprompt' event caught! Site is now installable.");
      e.preventDefault();
      setInstallPrompt(e);
    };

    // 3. Check if already installed
    window.addEventListener('beforeinstallprompt', handler);

    // 4. Debug: Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log("PWA Debug: App is already running in standalone mode (Installed).");
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    console.log("PWA Debug: handleInstall called.");

    if (!installPrompt) {
      console.warn("PWA Debug: No install prompt saved in state.");
      return;
    }

    try {
      console.log("PWA Debug: Triggering native prompt...");
      installPrompt.prompt();

      const { outcome } = await installPrompt.userChoice;
      console.log(`PWA Debug: User choice outcome: ${outcome}`);

      if (outcome === 'accepted') {
        setInstallPrompt(null);
      }
    } catch (err) {
      console.error("PWA Debug: Prompt failed", err);
    }
  };

  // Boolean helper to make the UI response clear
  const isInstallable = installPrompt !== null;

  return { isInstallable, handleInstall };
}