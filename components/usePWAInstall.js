'use client';
import { useState, useEffect } from 'react';

export default function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    console.log("PWA Debug: Hook mounted. Checking environment...");

    if (typeof window === 'undefined') return;

    // 1. Immediate Synchronous Check: Did the global window interceptor catch it early?
    if (window.deferredPWAInstallPrompt) {
      console.log("PWA Debug: Found globally captured install prompt instantly on mount!");
      setInstallPrompt(window.deferredPWAInstallPrompt);
    }

    // 2. Local Listener: For slower connections where the prompt fires *after* the hook mounts
    const handleNativePrompt = (e) => {
      console.log("PWA Debug: Direct native layout engine prompt caught.");
      e.preventDefault();
      setInstallPrompt(e);
    };

    // 3. Custom Event Listener: Fired by ClientProviders if the global prompt lands concurrently
    const handleGlobalReady = () => {
      if (window.deferredPWAInstallPrompt) {
        console.log("PWA Debug: Hook notified of early global prompt availability.");
        setInstallPrompt(window.deferredPWAInstallPrompt);
      }
    };

    window.addEventListener('beforeinstallprompt', handleNativePrompt);
    window.addEventListener('pwa-prompt-ready', handleGlobalReady);

    // 4. Debug check for active standalone display mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log("PWA Debug: App is already running in standalone mode (Installed).");
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleNativePrompt);
      window.removeEventListener('pwa-prompt-ready', handleGlobalReady);
    };
  }, []);

  const handleInstall = async () => {
    // Fallback lookups: check local React state first, then look at the shared window container
    const activePrompt = installPrompt || window.deferredPWAInstallPrompt;

    console.log("PWA Debug: handleInstall called.");

    if (!activePrompt) {
      console.warn("PWA Debug: No install prompt saved in state or global window context.");
      return;
    }

    try {
      console.log("PWA Debug: Triggering native prompt UI dialog...");
      await activePrompt.prompt();

      const { outcome } = await activePrompt.userChoice;
      console.log(`PWA Debug: User choice outcome: ${outcome}`);

      if (outcome === 'accepted') {
        // Clean both states on successful install
        setInstallPrompt(null);
        window.deferredPWAInstallPrompt = null;
      }
    } catch (err) {
      console.error("PWA Debug: Prompt execution failed", err);
    }
  };

  // True if either the local component state or global execution object exists
  const isInstallable = installPrompt !== null || (typeof window !== 'undefined' && window.deferredPWAInstallPrompt !== null);

  return { isInstallable, handleInstall };
}