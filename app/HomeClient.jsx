'use client';

import React from 'react';
import { LANGUAGES } from '@/lib/data';
import { useMenuManager } from '@/lib/useMenuManager';
import Navbar from '@/components/Navbar';
import AdminInterface from '@/components/AdminInterface';
import UserInterface from '@/components/UserInterface';
import Footer from '@/components/Footer';

/**
 * HomeClient Component
 * This is a Client Component responsible for UI logic and interactivity.
 * It is meant to be rendered by a Server Component (page.jsx).
 */
export default function HomeClient() {
  const logic = useMenuManager();

  // Prevent hydration mismatch by waiting until the hook has mounted
  if (!logic.mounted) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  const uiText = LANGUAGES[logic.lang];
  const isHe = logic.lang === 'he';

  return (
    <div
      className="flex flex-col min-h-screen bg-slate-50 text-slate-900 transition-all duration-300"
      dir={uiText.dir}
    >
      {/* 1. Navbar: Handles navigation and language toggles */}
      <Navbar logic={logic} uiText={uiText} />

      {/* 2. Main Content: Toggles between User and Admin views */}
      <main className="flex-grow max-w-7xl mx-auto p-6 w-full">
        {logic.view === 'admin' ? (
          <AdminInterface logic={logic} currentLang={logic.lang} />
        ) : (
          <UserInterface logic={logic} uiText={uiText} />
        )}
      </main>

      {/* 3. Footer: Displayed only in User view when footerData is present */}
      {logic.view !== 'admin' && logic.footerData && (
        <Footer
          data={logic.footerData}
          isHe={isHe}
          menuData={logic.menuData}
          setActiveSubItem={logic.setActiveSubItem}
        />
      )}
    </div>
  );
}