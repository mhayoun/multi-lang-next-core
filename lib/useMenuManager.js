import {useState, useEffect} from 'react';
import imageCompression from 'browser-image-compression';
import {DEFAULT_MENU} from '@/lib/menuData';
import {DEFAULT_NEWS} from '@/lib/newsData';
import {DEFAULT_FOOTER} from '@/lib/footerData';
import {createNewMenu, createNewSubMenu, createNewNews} from '@/lib/data';

export const useMenuManager = () => {
    const [mounted, setMounted] = useState(false);
    const [menuData, setMenuData] = useState(DEFAULT_MENU);
    const [newsData, setNewsData] = useState(DEFAULT_NEWS);
    const [logo, setLogo] = useState(null);
    const [view, setView] = useState('user');
    const [lang, setLang] = useState('he');
    const [activeSubItem, setActiveSubItem] = useState(null);
    const [siteSettings, setSiteSettings] = useState({
        contact: {
            email: '',
            address: {he: '', en: ''}
        }
    });

    const [footerData, setFooterData] = useState(DEFAULT_FOOTER);

    // 1. INITIAL LOAD: Sync with Cloud (Redis)
    useEffect(() => {
        const syncData = async () => {
            try {
                // Try to fetch from Upstash via our API
                const response = await fetch('/api/settings');
                const cloudData = await response.json();
                console.log("Data loaded from Cloud:", cloudData); // <--- ADD THIS

                if (cloudData && !cloudData.error && Object.keys(cloudData).length > 0) {
                    // Success! Use Cloud Data
                    if (cloudData.menuData) setMenuData(cloudData.menuData);
                    if (cloudData.newsData) setNewsData(cloudData.newsData);
                    if (cloudData.logo) setLogo(cloudData.logo);
                    if (cloudData.siteSettings) setSiteSettings(cloudData.siteSettings);
                    if (cloudData.footerData) setFooterData(cloudData.footerData);
                } else {
                    // Fallback to LocalStorage if Cloud is empty
                    const savedData = localStorage.getItem('siteData');
                    const savedNews = localStorage.getItem('siteNews');
                    const savedLogo = localStorage.getItem('siteLogo');
                    const savedFooter = localStorage.getItem('siteFooter'); // Local fallback

                    if (savedData) setMenuData(JSON.parse(savedData));
                    if (savedNews) setNewsData(JSON.parse(savedNews));
                    if (savedLogo) setLogo(savedLogo);
                    if (savedFooter) setFooterData(JSON.parse(savedFooter));
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
            localStorage.setItem('siteFooter', JSON.stringify(footerData));
            if (logo) localStorage.setItem('siteLogo', logo);

            // Auto-save all data to Cloud whenever footer or others change
            const saveData = async () => {
                await fetch('/api/settings', {
                    method: 'POST',
                    body: JSON.stringify({
                        menuData,
                        newsData,
                        logo,
                        siteSettings,
                        footerData // Include footer in payload
                    })
                });
            };
            saveData();
        }
    }, [menuData, newsData, logo, footerData, siteSettings, mounted]);

    // --- TRANSLATION HELPER ---
    const t = (obj) => obj?.[lang] || obj?.['he'] || '';

    // --- ACTIONS (Menu & News) ---
    const uploadDefaults = () => {
        if (window.confirm("Restore default menu, news, footer structure?")) {
            setMenuData(DEFAULT_MENU);
            setNewsData(DEFAULT_NEWS);
            setFooterData(DEFAULT_FOOTER);
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
    const handleFileUpload = async (e, targetId, subId, type, isNews = false) => {
        const files = Array.from(e.target.files);
        const setter = isNews ? setNewsData : setMenuData;

        for (let file of files) {
            try {
                // Check if file is an image and larger than 1MB
                if (file.type.startsWith('image/') && file.size > 1 * 1024 * 1024) {
                    const shouldCompress = window.confirm(
                        `The image "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(2)}MB).\n\nClick "OK" to compress it and continue.\nClick "Cancel" to stop the upload.`
                    );

                    if (shouldCompress) {
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
                    } else {
                        // USER CANCELLED: Stop the process for this file
                        console.log(`Upload cancelled by user for: ${file.name}`);
                        continue; // Skip to the next file in the loop (or exit if only one)
                    }
                }

                // Upload process (only runs if file is < 1MB or user clicked OK)
                const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
                    method: 'POST',
                    body: file,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Upload failed");
                }

                const newBlob = await response.json();
                const fileUrl = newBlob.url;

                setter(prev => prev.map(item => {
                    if (item.id !== targetId) return item;

                    if (!subId && (type === 'bgImage' || type === 'image' || type === 'logo')) {
                        if (type === 'logo') setLogo(fileUrl);
                        return {...item, [type]: fileUrl};
                    }

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
                alert(`Failed to upload ${file.name}: ${error.message}`);
            }
        }
    };

    const removeFile = (targetId, subId, type, index, isNews = false) => {
        const setter = isNews ? setNewsData : setMenuData;
        setter(prev => prev.map(item => {
            if (item.id !== targetId) return item;

            if (isNews) {
                const newList = [...(item[type] || [])];
                newList.splice(index, 1);
                return {...item, [type]: newList};
            }

            return {
                ...item,
                subItems: (item.subItems || []).map(s => {
                    if (s.id !== subId) return s;
                    const newList = [...(s[type] || [])];
                    newList.splice(index, 1);
                    return {...s, [type]: newList};
                })
            };
        }));
    };

    const updateSettings = (key, value) => {
        setSiteSettings(prev => {
            // We use the spread operator to ensure we don't mutate the original state
            if (key === 'email') {
                return {
                    ...prev,
                    contact: {
                        ...prev.contact,
                        email: value
                    }
                };
            }

            if (key === 'address_he') {
                return {
                    ...prev,
                    contact: {
                        ...prev.contact,
                        address: {
                            ...prev.contact.address,
                            he: value
                        }
                    }
                };
            }

            return prev; // If no key matches, return original state
        });
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
        logo, setLogo,
        view, setView,
        lang, setLang,
        activeSubItem,
        setActiveSubItem,
        siteSettings,
        updateSettings,
        t,
        uploadDefaults,
        addMenu, addSubMenu, removeMenu,
        moveMenu, moveSubMenu,
        addNews, moveNews, removeNews,
        handleFileUpload,
        removeFile
    };
};