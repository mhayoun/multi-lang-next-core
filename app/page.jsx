// app/page.jsx
'use client';

import React from 'react';
import { LANGUAGES } from '@/lib/data';
import { useMenuManager } from '@/lib/useMenuManager';
import Navbar from '@/components/Navbar';
import AdminInterface from '@/components/AdminInterface';
import UserInterface from '@/components/UserInterface';
import Footer from '@/components/Footer'; // 1. Import the Footer
import { DEFAULT_FOOTER } from '@/lib/footerData'; // 2. Import your generic data

export default function Home() {
  const logic = useMenuManager();

  if (!logic.mounted) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  const uiText = LANGUAGES[logic.lang];
  const isHe = logic.lang === 'he';

  return (
    <div
      /* 3. Changed to flex flex-col to enable "sticky" footer logic */
      className="flex flex-col min-h-screen bg-slate-50 text-slate-900 transition-all duration-300"
      dir={uiText.dir}
    >
      {/* Navbar stays at the top */}
      <Navbar logic={logic} uiText={uiText} />

      {/* 4. Added flex-grow so this main area expands to fill empty space */}
      <main className="flex-grow max-w-7xl mx-auto p-6 w-full">
        {logic.view === 'admin' ? (
          <AdminInterface logic={logic} currentLang={logic.lang} />
        ) : (
          <UserInterface logic={logic} uiText={uiText} />
        )}
      </main>

      {/* 5. Footer only shows for Users, or stays at bottom for both */}
      {logic.view !== 'admin' && (
        <Footer
          data={logic.footerData || DEFAULT_FOOTER}
          isHe={isHe}
          menuData={logic.menuData}           // <--- ADD THIS
          setActiveSubItem={logic.setActiveSubItem} // <--- ADD THIS
        />
      )}
    </div>
  );
}