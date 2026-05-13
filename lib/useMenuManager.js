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

    const removeFile = async (targetId, subId, type, index, isNews = false) => {
        // 1. Get the correct data source based on the 'isNews' flag
        const currentData = isNews ? newsData : menuData;
        const setter = isNews ? setNewsData : setMenuData;

        // 2. Find the file URL directly from the current state (Avoids the "locked body" or null issues)
        const targetItem = currentData.find(item => item.id === targetId);
        let urlToDelete = null;

        if (isNews) {
            const fileObj = targetItem?.[type]?.[index];
            urlToDelete = typeof fileObj === 'string' ? fileObj : fileObj?.url;
        } else {
            const subItem = targetItem?.subItems?.find(s => s.id === subId);
            const fileObj = subItem?.[type]?.[index];
            urlToDelete = typeof fileObj === 'string' ? fileObj : fileObj?.url;
        }

        console.log("🔍 URL extracted for deletion:", urlToDelete);

        if (!urlToDelete) {
            console.error("❌ Could not find URL in state. Check targetId/subId/index.");
            return;
        }

        try {
            // 3. Call the API
            const response = await fetch(`/api/blob/delete?url=${encodeURIComponent(urlToDelete)}`, {
                method: 'DELETE',
            });

            // Use a single variable to store result to avoid "disturbing the body"
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Server failed to delete blob');
            }

            console.log("✅ Vercel Blob deleted:", result);

            // 4. Update the Local UI State
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

        } catch (error) {
            console.error("❌ removeFile failed:", error.message);
            alert(`Failed to remove file: ${error.message}`);
        }
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
        removeFile,
        logic
    };
};