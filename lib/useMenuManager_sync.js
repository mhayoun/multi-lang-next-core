//This file handles the interaction with
// LocalStorage and the Cloud (Upstash/Redis).

import { useEffect, useState } from 'react';

export const useMenuManagerSync = (states) => {
    const [mounted, setMounted] = useState(false);
    const { menuData, setMenuData, newsData, setNewsData, logo, setLogo, footerData, setFooterData, homeData, setHomeData } = states;

    // Load Data
    useEffect(() => {
        const syncData = async () => {
            try {
                const response = await fetch('/api/settings');
                const cloudData = await response.json();

                if (cloudData && !cloudData.error && Object.keys(cloudData).length > 0) {
                    if (cloudData.menuData) setMenuData(cloudData.menuData);
                    if (cloudData.newsData) setNewsData(cloudData.newsData);
                    if (cloudData.logo) setLogo(cloudData.logo);
                    if (cloudData.footerData) setFooterData(cloudData.footerData);
                    if (cloudData.homeData) setHomeData(cloudData.homeData);
                } else {
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
                console.error("Sync failed:", err);
            } finally {
                setMounted(true);
            }
        };
        syncData();
    }, []);

    // Save Data
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('siteData', JSON.stringify(menuData));
            localStorage.setItem('siteNews', JSON.stringify(newsData));
            localStorage.setItem('siteFooter', JSON.stringify(footerData));
            localStorage.setItem('siteHome', JSON.stringify(homeData));
            if (logo) localStorage.setItem('siteLogo', logo);

            const saveData = async () => {
                await fetch('/api/settings', {
                    method: 'POST',
                    body: JSON.stringify({ menuData, newsData, logo, footerData, homeData })
                });
            };
            saveData();
        }
    }, [menuData, newsData, logo, footerData, homeData, mounted]);

    return { mounted };
};