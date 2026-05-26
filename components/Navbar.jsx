import React, {useEffect, useState, useMemo} from 'react';
import {Settings, User, LogOut, Menu, X, ChevronDown, Search, Download, Phone} from 'lucide-react';
import {LANGUAGES} from '@/lib/data';
import {signIn, signOut, useSession} from "next-auth/react";
import usePWAInstall from "@/components/usePWAInstall";
import {DesktopNavigation} from "@/components/utils/DesktopNavigation";

const Navbar = ({logic, uiText}) => {
    const {data: session} = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const {isInstallable, handleInstall} = usePWAInstall();

    // DEBUG: Log status changes
    useEffect(() => {
        console.log("[PWA Debug] isInstallable state changed:", isInstallable);
    }, [isInstallable]);

    const debugInstall = async () => {
        console.log("--- PWA DEBUG START ---");
        console.log("Current isInstallable state:", isInstallable);

        if (!isInstallable) {
            console.warn("Attempted to install, but isInstallable is false.");
            return;
        }

        try {
            console.log("Triggering handleInstall...");
            await handleInstall();
            console.log("handleInstall function completed.");

            // Close the mobile menu after trigger
            setIsMenuOpen(false);
        } catch (error) {
            console.error("Critical error during PWA installation:", error);
        }
    };

    // --- SEARCH LOGIC ---
    const filteredResults = useMemo(() => {
        if (!searchQuery.trim() || !Array.isArray(logic.menuData)) return [];

        const query = searchQuery.toLowerCase().trim();
        const allSubItems = logic.menuData.flatMap(menu => menu.subItems || []);

        // Helper to strip HTML tags so we search only actual text content
        const stripHtml = (html) => {
            if (!html || typeof html !== 'string') return "";
            return html.replace(/<[^>]*>?/gm, '');
        };

        return allSubItems.filter(item => {
            // 1. Search in the translated Title
            const translatedTitle = logic.t(item.title)?.toLowerCase() || "";

            // 2. Access the nested content object and strip HTML for clean searching
            const contentHe = stripHtml(item.content?.he).toLowerCase();
            const contentEn = stripHtml(item.content?.en).toLowerCase();

            return (
                translatedTitle.includes(query) ||
                contentHe.includes(query) ||
                contentEn.includes(query)
            );
        });
    }, [searchQuery, logic.menuData, logic.lang, logic.t]);

    const handleHomeClick = () => {
        logic.setActiveSubItem(null);
        logic.setView('user');
        setIsMenuOpen(false);
        // Smoothly scroll back to the coordinates (0, 0)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleSubItemClick = (sub) => {
        // 1. Check if the mode points directly to the contact form section
        if (sub.contentMode === 'contactus') {
            logic.setView('user');
            setIsMenuOpen(false);
            setSearchQuery("");

            // Timeout ensures the page flips layout state back to user view before scrolling
            setTimeout(() => {
                const targetElement = document.getElementById('contactus');
                if (targetElement) {
                    targetElement.scrollIntoView({behavior: 'smooth', block: 'start'});
                } else {
                    // Fallback to top if element is missing on screen
                    window.scrollTo({top: 0, behavior: 'smooth'});
                }
            }, 100);
            return; // Halt execution early
        }

        // 2. Original routing fallback branch conditions (Linker vs. Editor)
        if (sub.contentMode === 'linker' && sub.linkedItemId) {
            const targetSubItem = logic.menuData
                ?.flatMap(menu => menu.subItems || [])
                .find(item => String(item.id) === String(sub.linkedItemId));

            if (targetSubItem) {
                logic.setActiveSubItem(targetSubItem);
            } else {
                logic.setActiveSubItem(sub);
            }
        } else {
            logic.setActiveSubItem(sub);
        }

        logic.setView('user');
        setIsMenuOpen(false);
        setSearchQuery(""); // Reset search on navigation
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const handleSignOut = () => {
        logic.setView('user');
        signOut();
    };

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    return (
       <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-[99999] shadow-sm w-full">
            <div className="px-6 py-2.5 flex justify-between items-center relative z-10 bg-white">

                {/* --- LEFT SIDE --- */}
                <div className="flex items-center gap-2 md:gap-8">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        {isMenuOpen ? <X size={20}/> : <Menu size={20}/>}
                    </button>

                    <button
                        onClick={handleHomeClick}
                        className="flex items-center transition-all active:scale-95 outline-none hover:brightness-110"
                    >
                        {logic.logo ? (
                            <img src={logic.logo} alt="Logo" className="h-14 md:h-20 w-auto object-contain"/>
                        ) : (
                            <h1 className="font-black text-sm md:text-base tracking-tighter text-slate-800 uppercase group">
                                Dynamic<span className="text-blue-600 group-hover:text-blue-700">Port</span>
                            </h1>
                        )}
                    </button>

                    {/* Desktop Navigation */}
                    <DesktopNavigation
                        menuData={logic.menuData}
                        translate={logic.t}
                        onSubItemClick={handleSubItemClick}
                    />
                </div>

                {/* --- RIGHT SIDE --- */}
                <div className="flex items-center gap-3">
                    {/* Desktop PWA Install Button */}
                    {isInstallable && (
                        <button
                            onClick={debugInstall}
                            className="ms-6 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-600 font-black text-[10px] uppercase px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 transition-all active:scale-95"
                        >
                            <Download size={9}/>
                            <span>{logic.lang === 'he' ? 'התקן אפליקציה' : 'Install App'}</span>
                        </button>
                    )}

                    {session && (
                        <div className="hidden sm:flex bg-slate-100 rounded-full p-1 border border-slate-200">
                            <button
                                onClick={() => logic.setView('user')}
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 transition-all hover:scale-105 ${
                                    logic.view === 'user' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                <User size={12}/> {uiText.user}
                            </button>
                            <button
                                onClick={() => logic.setView('admin')}
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 transition-all hover:scale-105 ${
                                    logic.view === 'admin' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                <Settings size={12}/> {uiText.switch}
                            </button>
                        </div>
                    )}

                    {/* NEW: Phone Number Display */}
                    {logic.footerData?.contact?.phones?.[0]?.number && (
                        <a
                            href={`tel:${logic.footerData.contact.phones[0].number}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors group"
                        >
                            <Phone size={14} className="group-hover:animate-pulse flex-shrink-0"/>
                            <span className="hidden sm:inline text-[11px] font-black tracking-tight whitespace-nowrap">
                                {logic.footerData.contact.phones[0].number}
                            </span>
                        </a>
                    )}

                    {/* Desktop Search Bar */}
                    <div className="hidden lg:block relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-40 bg-slate-100 border-none rounded-full py-1.5 px-4 pl-9 text-[11px] font-bold focus:ring-2 focus:ring-blue-400 transition-all outline-none"
                        />
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        {searchQuery.trim() && (
                            <div dir="rtl"
                                 className="absolute top-full right-0 mt-2 w-64 bg-white shadow-2xl rounded-lg border border-slate-200 overflow-hidden z-[9999]">
                                {filteredResults.length > 0 ? (
                                    <div className="max-h-80 overflow-y-auto">
                                        {filteredResults.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleSubItemClick(item)}
                                                className="w-full text-right px-4 py-3 hover:bg-blue-50 border-b border-slate-50 last:border-none transition-colors"
                                            >
                                                <div
                                                    className="text-[12px] font-bold text-slate-700">{logic.t(item.title)}</div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-slate-400 text-[11px]">לא נמצאו תוצאות</div>
                                )}
                            </div>
                        )}
                    </div>

                    <select
                        value={logic.lang}
                        onChange={(e) => logic.setLang(e.target.value)}
                        className="bg-transparent font-bold text-[10px] uppercase tracking-tighter outline-none cursor-pointer border-none focus:ring-0 text-slate-600 hover:text-blue-600 transition-colors w-9"
                    >
                        {Object.entries(LANGUAGES).map(([code, info]) => (
                            <option key={code} value={code} className="font-bold text-sm">
                                {info.label === 'עברית' ? 'עב' : info.label === 'English' ? 'En' : info.label}
                            </option>
                        ))}
                    </select>

                    <div className="border-l border-slate-200 pl-3 h-6 flex items-center gap-3">
                        {session ? (
                            <div className="flex items-center gap-2">
                                <img src={session.user.image} className="w-7 h-7 rounded-full border border-slate-200"
                                     alt="P"/>
                                <button onClick={handleSignOut}
                                        className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                                    <LogOut size={16}/>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => signIn("google", {callbackUrl: window.location.origin})}
                                className="text-[10px] font-bold uppercase text-blue-600 hover:text-blue-800 transition-all"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* --- MOBILE MENU --- */}
            {isMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-white p-5 pt-24 space-y-5 overflow-y-auto z-[-1] min-h-screen pb-16 animate-in slide-in-from-top duration-200">

                    {/* Mobile Search Input */}
                    <div className="relative mb-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-100 border-none rounded-full py-2 px-4 pl-10 text-xs focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    </div>

                    {searchQuery ? (
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-blue-500 px-3 uppercase">Results
                                ({filteredResults.length})</p>
                            {filteredResults.length > 0 ? (
                                filteredResults.map(sub => (
                                    <button key={sub.id} onClick={() => handleSubItemClick(sub)}
                                            className="w-full text-start px-4 py-3 bg-slate-50 rounded-xl">
                                        <div className="text-xs font-black text-slate-800">{logic.t(sub.title)}</div>
                                    </button>
                                ))
                            ) : (
                                <p className="text-center py-4 text-xs text-slate-400">No matches found</p>
                            )}
                        </div>
                    ) : (
                        logic.menuData.map((menu) => (
                            <div key={menu.id} className="space-y-1">
                                <div
                                    className="text-[10px] font-black text-slate-400 px-3 uppercase tracking-[0.2em] pt-2">
                                    {logic.t(menu.title)}
                                </div>
                                {menu.subItems?.map((sub) => (
                                    <button
                                        key={sub.id}
                                        onClick={() => handleSubItemClick(sub)}
                                        className="w-full text-start px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:font-black rounded-lg text-xs font-bold transition-all"
                                    >
                                        {logic.t(sub.title)}
                                    </button>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
