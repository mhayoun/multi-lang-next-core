'use client';

import React from 'react';
import { LANGUAGES } from '@/lib/data';
import { useMenuManager } from '@/lib/useMenuManager';
import Navbar from '@/components/Navbar';
import AdminInterface from '@/components/AdminInterface';
import UserInterface from '@/components/UserInterface';
import Footer from '@/components/Footer';

export default function Home() {
  const logic = useMenuManager();

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
      {/* Navbar stays at the top */}
      <Navbar logic={logic} uiText={uiText} />

      {/* Main area expands to fill empty space */}
      <main className="flex-grow max-w-7xl mx-auto p-6 w-full">
        {logic.view === 'admin' ? (
          <AdminInterface logic={logic} currentLang={logic.lang} />
        ) : (
          <UserInterface logic={logic} uiText={uiText} />
        )}
      </main>

      {/*
         FIX: Removed hardcoded DEFAULT_FOOTER.
         logic.footerData now automatically pulls from the correct
         client folder via useMenuManager.
      */}
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