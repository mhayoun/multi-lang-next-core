//This file handles the interaction with
// LocalStorage and the Cloud (Upstash/Redis).

import { useEffect, useRef, useState } from 'react';

export const useMenuManagerSync = (states) => {
    const [mounted, setMounted] = useState(false);
    const { menuData, setMenuData, newsData, setNewsData, logo, setLogo, footerData, setFooterData, homeData, setHomeData } = states;

    // true only if the cloud answered correctly: we never save over Redis after a failed load
    const cloudLoadedRef = useRef(false);
    // Last payload known to match Redis: saving only happens when the data really changed
    const lastSavedRef = useRef(null);

    // Load Data
    useEffect(() => {
        const syncData = async () => {
            try {
                const response = await fetch('/api/settings');
                const cloudData = await response.json();

                if (!response.ok || !cloudData || cloudData.error) {
                    throw new Error(cloudData?.error || `HTTP ${response.status}`);
                }
                cloudLoadedRef.current = true;

                if (Object.keys(cloudData).length > 0) {
                    if (cloudData.menuData) setMenuData(cloudData.menuData);
                    if (cloudData.newsData) setNewsData(cloudData.newsData);
                    if (cloudData.logo) setLogo(cloudData.logo);
                    if (cloudData.footerData) setFooterData(cloudData.footerData);
                    if (cloudData.homeData) setHomeData(cloudData.homeData);
                } else {
                    // New site with nothing in Redis yet: start from local data
                    const savedData = localStorage.getItem('siteData');
                    const savedNews = localStorage.getItem('siteNews');
                    const savedLogo = localStorage.getItem('siteLogo');
                    const savedFooter = localStorage.getItem('siteFooter');
                    const savedHome = localStorage.getItem('siteHome');

                    if (savedData) setMenuData(JSON.parse(savedData));
                    if (savedNews) setNewsData(JSON.parse(savedNews));
                    if (savedLogo) setLogo(savedLogo);
                    if (savedFooter) setFooterData(JSON.parse(savedFooter));
                    if (savedHome) setHomeData(JSON.parse(savedHome));
                }
            } catch (err) {
                console.error("Sync failed, cloud saving disabled for this session:", err);
            } finally {
                setMounted(true);
            }
        };
        syncData();
    }, []);

    // Save Data
    useEffect(() => {
        if (!mounted || !cloudLoadedRef.current) return;

        const payload = JSON.stringify({ menuData, newsData, logo, footerData, homeData });

        // First run after loading: remember what Redis holds, don't write it back
        if (lastSavedRef.current === null) {
            lastSavedRef.current = payload;
            return;
        }
        if (payload === lastSavedRef.current) return;

        localStorage.setItem('siteData', JSON.stringify(menuData));
        localStorage.setItem('siteNews', JSON.stringify(newsData));
        localStorage.setItem('siteFooter', JSON.stringify(footerData));
        localStorage.setItem('siteHome', JSON.stringify(homeData));
        if (logo) localStorage.setItem('siteLogo', logo);

        const saveData = async () => {
            try {
                const response = await fetch('/api/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: payload
                });
                if (response.ok) lastSavedRef.current = payload;
                else console.error("Cloud save refused:", response.status);
            } catch (err) {
                console.error("Cloud save failed:", err);
            }
        };
        saveData();
    }, [menuData, newsData, logo, footerData, homeData, mounted]);

    return { mounted };
};
