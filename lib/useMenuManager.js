import {useState, useEffect} from 'react';
import imageCompression from 'browser-image-compression';
import {getClientData} from '@/src/lib/client-data'; // New Selector
import {createNewMenu, createNewSubMenu, createNewNews} from '@/lib/data';

export const useMenuManager = () => {
    const [mounted, setMounted] = useState(false);

    // Get the specific data for the current deployment
    console.log("PROCESS ENV CHECK:", process.env.NEXT_PUBLIC_CLIENT_ID);

    const clientData = getClientData();

    const [menuData, setMenuData] = useState(clientData.menu);
    const [newsData, setNewsData] = useState(clientData.news);
    const [footerData, setFooterData] = useState(clientData.footer);
    const [homeData, setHomeData] = useState(clientData.home);

    const [logo, setLogo] = useState(null);
    const [view, setView] = useState('user');
    const [lang, setLang] = useState('he');
    const [activeSubItem, setActiveSubItem] = useState(null);

    // --- TRANSLATION HELPER ---
    const t = (obj) => obj?.[lang] || obj?.['he'] || '';

    const logic = {
        t,
        footerData,
        // you can add other shared helpers here
    };

    // 1. INITIAL LOAD: Sync with Cloud (Redis)
    useEffect(() => {
        const syncData = async () => {
            try {
                // Try to fetch from Upstash via our API
                const response = await fetch('/api/settings');
                const cloudData = await response.json();
                console.log("Data LOADED from Cloud:", cloudData); // <--- ADD THIS

                if (cloudData && !cloudData.error && Object.keys(cloudData).length > 0) {
                    // Success! Use Cloud Data
                    if (cloudData.menuData) setMenuData(cloudData.menuData);
                    if (cloudData.newsData) setNewsData(cloudData.newsData);
                    if (cloudData.logo) setLogo(cloudData.logo);
                    if (cloudData.footerData) setFooterData(cloudData.footerData);
                    if (cloudData.homeData) setHomeData(cloudData.homeData);
                } else {
                    // Fallback to LocalStorage if Cloud is empty
                    const savedData = localStorage.getItem('siteData');
                    const savedNews = localStorage.getItem('siteNews');
                    const savedLogo = localStorage.getItem('siteLogo');
                    const savedFooter = localStorage.getItem('siteFooter'); // Local fallback
                    const savedHome = localStorage.getItem('siteHome'); // 1. Lire la clé

                    if (savedData) setMenuData(JSON.parse(savedData));
                    if (savedNews) setNewsData(JSON.parse(savedNews));
                    if (savedLogo) setLogo(savedLogo);
                    if (savedFooter) setFooterData(JSON.parse(savedFooter));
                    if (savedHome) setHomeData(JSON.parse(savedHome)); // 2. Appliquer l'état
                }
            } catch (err) {
                console.error("Cloud sync failed, using local fallback:", err);
            } finally {
                setMounted(true);
            }
        };

        syncData();
    }, []);

    // 2. Local Backup (Persistence for offline editing)
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('siteData', JSON.stringify(menuData));
            localStorage.setItem('siteNews', JSON.stringify(newsData));
            localStorage.setItem('siteFooter', JSON.stringify(footerData));
            localStorage.setItem('siteHome', JSON.stringify(homeData));
            if (logo) localStorage.setItem('siteLogo', logo);

            // Auto-save all data to Cloud whenever footer or others change
            const saveData = async () => {
                await fetch('/api/settings', {
                    method: 'POST',
                    body: JSON.stringify({
                        menuData,
                        newsData,
                        logo,
                        footerData,
                        homeData
                    })
                });
            };
            saveData();
        }
    }, [menuData, newsData, logo, footerData, homeData, mounted]);

    // --- ACTIONS (Menu & News) ---
    const uploadDefaults = () => {
        if (window.confirm("Restore default menu, news, footer structure?")) {
            setMenuData(DEFAULT_MENU);
            setNewsData(DEFAULT_NEWS);
            setFooterData(DEFAULT_FOOTER);
            setHomeData(DEFAULT_HOME);
        }
    };

    const addMenu = () => setMenuData(prev => [...prev, createNewMenu()]);

    const addSubMenu = (menuId) => {
        setMenuData(prev => prev.map(m =>
            m.id === menuId ? {...m, subItems: [...(m.subItems || []), createNewSubMenu()]} : m
        ));
    };

    const removeMenu = (menuId) => setMenuData(prev => prev.filter(m => m.id !== menuId));

    const moveMenu = (fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= menuData.length) return;
        const updatedData = [...menuData];
        const [movedItem] = updatedData.splice(fromIndex, 1);
        updatedData.splice(toIndex, 0, movedItem);
        setMenuData(updatedData);
    };

    const moveSubMenu = (menuId, fromIndex, toIndex) => {
        setMenuData(prev => prev.map(menu => {
            if (menu.id !== menuId) return menu;

            const newSubItems = [...menu.subItems];
            const [movedItem] = newSubItems.splice(fromIndex, 1);
            newSubItems.splice(toIndex, 0, movedItem);

            return {...menu, subItems: newSubItems};
        }));
    };

    const addNews = () => setNewsData(prev => [...prev, createNewNews()]);

    const moveNews = (fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= newsData.length) return;
        const updatedData = [...newsData];
        const [movedItem] = updatedData.splice(fromIndex, 1);
        updatedData.splice(toIndex, 0, movedItem);
        setNewsData(updatedData);
    };

    const removeNews = (id) => setNewsData(prev => prev.filter(n => n.id !== id));

    // --- VERCEL BLOB UPLOAD HANDLING ---
    const handleFileUpload = async (e, targetId, subId, type, isNews = false, isHome = false) => {
        const files = Array.from(e.target.files);

        for (let file of files) {
            try {
                // Check if file is an image and larger than 1MB
                if (file.type.startsWith('image/') && file.size > 1 * 1024 * 1024) {
                    const shouldCompress = window.confirm(
                        `The image "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(2)}MB).\n\nClick "OK" to compress it and continue.\nClick "Cancel" to stop the upload.`
                    );

                    if (shouldCompress) {
                        const oriSizeKB = (file.size / 1024).toFixed(2);
                        const options = {
                            maxSizeMB: 0.9,
                            maxWidthOrHeight: 1920,
                            useWebWorker: true,
                        };

                        const compressedBlob = await imageCompression(file, options);
                        file = new File([compressedBlob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        });

                        console.log(`Compression complete for: ${file.name} (${(file.size / 1024).toFixed(2)} kB)`);
                    } else {
                        console.log(`Upload cancelled by user for: ${file.name}`);
                        continue;
                    }
                }

                // Upload process
                const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
                    method: 'POST',
                    body: file,
                });

                // 1. Determine how to parse the body based on Content-Type
                const contentType = response.headers.get("content-type");
                let responseData;

                if (contentType && contentType.includes("application/json")) {
                    responseData = await response.json();
                } else {
                    responseData = await response.text();
                }

                // 2. Handle Errors
                if (!response.ok) {
                    // If it's an object with an .error property, use that; otherwise use status text
                    const errorMsg = responseData?.error || responseData || `Server returned ${response.status}`;
                    console.error("❌ Server Error:", errorMsg);
                    throw new Error(errorMsg);
                }

                // 3. Success: Use the parsed responseData
                const fileUrl = responseData.url;

                // CAS A : Page d'accueil (Galerie)
                if (isHome) {
                    setHomeData(prev => ({
                        ...prev,
                        [type]: [...(prev[type] || []), fileUrl]
                    }));
                    continue; // On passe au fichier suivant
                }

                // CAS B : Actualités ou Menus
                const setter = isNews ? setNewsData : setMenuData;

                setter(prev => prev.map(item => {
                    if (item.id !== targetId) return item;

                    if (!subId && (type === 'bgImage' || type === 'image' || type === 'logo')) {
                        if (type === 'logo') setLogo(fileUrl);
                        return {...item, [type]: fileUrl};
                    }

                    // News (Tableau de fichiers ou images)
                    if (isNews) {
                        const fileEntry = type === 'pdfs' ? {url: fileUrl, name: file.name} : fileUrl;
                        return {...item, [type]: [...(item[type] || []), fileEntry]};
                    }

                    const updateSubItems = (items) => items.map(s => {
                        if (s.id !== subId) return s;
                        const fileEntry = type === 'pdfs' ? {url: fileUrl, name: file.name} : fileUrl;
                        return {...s, [type]: [...(s[type] || []), fileEntry]};
                    });

                    return {...item, subItems: updateSubItems(item.subItems || [])};
                }));

            } catch (error) {
                console.error("Upload failed:", error);
                alert(`Failed to upload (limit 4.5MB) ${file.name}: ${error.message}`);
            }
        }
    };

    const removeFile = async (targetId, subId, type, index, isNews = false, isHome = false) => {
    // 1. Identification de l'URL à supprimer
    let urlToDelete = null;

    if (isHome) {
        urlToDelete = homeData[type]?.[index];
    } else {
        const currentData = isNews ? newsData : menuData;
        const targetItem = currentData.find(item => item.id === targetId);

        if (isNews) {
            const fileObj = targetItem?.[type]?.[index];
            urlToDelete = typeof fileObj === 'string' ? fileObj : fileObj?.url;
        } else {
            const subItem = targetItem?.subItems?.find(s => s.id === subId);
            const fileObj = subItem?.[type]?.[index];
            urlToDelete = typeof fileObj === 'string' ? fileObj : fileObj?.url;
        }
    }

    if (!urlToDelete) {
        console.error("❌ Could not find URL in state.");
        return;
    }

    // 2. Tentative de suppression sur le Cloud (Vercel Blob)
    try {
        const response = await fetch(`/api/blob/delete?url=${encodeURIComponent(urlToDelete)}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Cloud deletion failed');
        console.log("✅ Vercel Blob deleted");
    } catch (error) {
        console.warn("⚠️ Cloud deletion issue, removing from UI anyway:", error.message);
    }

    // 3. Mise à jour de l'état LOCAL (UI)

    // CAS A : Mise à jour de la Home (Galerie)
    if (isHome) {
        setHomeData(prev => {
            const newList = [...(prev[type] || [])];
            newList.splice(index, 1); // Retire l'élément du tableau
            return {
                ...prev,
                [type]: newList
            };
        });
        return; // On s'arrête ici pour la Home
    }

    // CAS B : Mise à jour des Menus ou News
    const setter = isNews ? setNewsData : setMenuData;
    setter(prev => prev.map(item => {
        if (item.id !== targetId) return item;

        if (isNews) {
            const newList = [...(item[type] || [])];
            newList.splice(index, 1);
            return { ...item, [type]: newList };
        }

        return {
            ...item,
            subItems: (item.subItems || []).map(s => {
                if (s.id !== subId) return s;
                const newList = [...(s[type] || [])];
                newList.splice(index, 1);
                return { ...s, [type]: newList };
            })
        };
    }));
};

    const updateFooter = (newData) => {
        setFooterData(newData);
    };

    return {
        mounted,
        menuData, setMenuData,
        newsData, setNewsData,
        footerData, setFooterData, // Exposed
        updateFooter,              // Exposed
        homeData,      // <--- INDISPENSABLE
        setHomeData,   // <--- INDISPENSABLE
        logo, setLogo,
        view, setView,
        lang, setLang,
        activeSubItem,
        setActiveSubItem,
        t,
        uploadDefaults,
        addMenu, addSubMenu, removeMenu,
        moveMenu, moveSubMenu,
        addNews, moveNews, removeNews,
        handleFileUpload,
        removeFile,
        logic
    };
};