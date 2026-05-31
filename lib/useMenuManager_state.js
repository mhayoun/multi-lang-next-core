//This file handles the raw data state and the translation helper.
// It acts as the "source of truth."

import { useState } from 'react';
import { getClientData } from '@/src/lib/client-data';

export const useMenuManagerState = () => {
    const clientData = getClientData();

    const [menuData, setMenuData] = useState(clientData.menu);
    const [newsData, setNewsData] = useState(clientData.news);
    const [footerData, setFooterData] = useState(clientData.footer);
    const [homeData, setHomeData] = useState(clientData.home);
    const [logo, setLogo] = useState(null);
    const [view, setView] = useState('user');
    const [lang, setLang] = useState('he');
    const [activeSubItem, setActiveSubItem] = useState(null);

    const t = (obj) => obj?.[lang] || obj?.['he'] || '';

    return {
        menuData, setMenuData,
        newsData, setNewsData,
        footerData, setFooterData,
        homeData, setHomeData,
        logo, setLogo,
        view, setView,
        lang, setLang,
        activeSubItem, setActiveSubItem,
        t
    };
};