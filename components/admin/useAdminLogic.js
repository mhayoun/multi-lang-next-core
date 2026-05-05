import {useState} from 'react';

export const useAdminLogic = (logic) => {
    // 1. Ensure 'logo' is extracted from the logic passed in
    const {menuData, setMenuData, newsData, setNewsData,
        logo, setLogo, siteSettings, moveMenu, moveNews} = logic;
    const [activeTab, setActiveTab] = useState('menu');
    const [openItems, setOpenItems] = useState({});

    const toggleAccordion = (id) => {
        setOpenItems(prev => ({...prev, [id]: !prev[id]}));
    };

    // --- GENERIC VERCEL UPLOAD HELPER ---
    const handleVercelUpload = async (e, callback) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await fetch(`/api/upload?filename=${file.name}`, {
                method: 'POST',
                body: file,
            });

            if (!response.ok) throw new Error('Upload failed');

            const newBlob = await response.json();
            callback(newBlob.url);
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Failed to upload image to Vercel.");
        }
    };

    // --- SPECIFIC UPLOAD ACTIONS ---
    const updateLogo = (e) => {
        handleVercelUpload(e, (url) => setLogo(url));
    };

    const updateMenuBg = (e, menuId) => {
        handleVercelUpload(e, (url) => {
            setMenuData(prev => prev.map(m =>
                m.id === menuId ? {...m, bgImage: url} : m
            ));
        });
    };

    // --- DATA UPDATES ---
    const updateMenuTitle = (menuId, lang, value) => {
        setMenuData(prev => prev.map(m =>
            m.id === menuId ? {...m, title: {...m.title, [lang]: value}} : m
        ));
    };

    const updateNewsTitle = (newsId, lang, value) => {
        setNewsData(prev => prev.map(n =>
            n.id === newsId ? {...n, title: {...n.title, [lang]: value}} : n
        ));
    };

    // --- SUB-MENU LINKING LOGIC ---
    const linkItemToSub = (menuId, subId, itemIdToLink) => {
        if (!itemIdToLink) return;
        setMenuData(prev => prev.map(menu => {
            if (menu.id !== menuId) return menu;
            return {
                ...menu,
                subItems: (menu.subItems || []).map(sub => {
                    if (sub.id !== subId) return sub;
                    if (sub.linkedItemIds?.includes(itemIdToLink)) return sub;
                    return {
                        ...sub,
                        linkedItemIds: [...(sub.linkedItemIds || []), itemIdToLink]
                    };
                })
            };
        }));
    };

    const unlinkItemFromSub = (menuId, subId, itemIdToRemove) => {
        setMenuData(prev => prev.map(menu => {
            if (menu.id !== menuId) return menu;
            return {
                ...menu,
                subItems: (menu.subItems || []).map(sub => {
                    if (sub.id !== subId) return sub;
                    return {
                        ...sub,
                        linkedItemIds: (sub.linkedItemIds || []).filter(id => id !== itemIdToRemove)
                    };
                })
            };
        }));
    };

    // --- NEWS LINKING LOGIC ---
    const linkItemToNews = (newsId, selectedId) => {
        if (!selectedId) return;
        setNewsData(prev => prev.map(n => {
            if (n.id === newsId) {
                const current = n.linkedItemIds || [];
                if (!current.includes(selectedId)) {
                    return {...n, linkedItemIds: [...current, selectedId]};
                }
            }
            return n;
        }));
    };

    const unlinkItemFromNews = (newsId, linkedId) => {
        setNewsData(prev => prev.map(n => n.id === newsId ?
            {...n, linkedItemIds: (n.linkedItemIds || []).filter(id => id !== linkedId)} : n
        ));
    };

    const showToast = (message, type = "success") => {
        // Create the element
        const toast = document.createElement("div");
        toast.innerText = message;

        // Style based on success or error
        toast.className = `toast-popup ${type}`;

        document.body.appendChild(toast);

        // Remove it after 2 seconds
        setTimeout(() => {
            toast.classList.add("fade-out");
            setTimeout(() => toast.remove(), 500); // Wait for fade animation
        }, 2000);
    };

    // --- CLOUD PUBLISHING ---
    const publishToCloud = async () => {
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    menuData,
                    newsData,
                    logo,
                    siteSettings
                }),
            });

            if (response.ok) {
                showToast("🚀 Changes are now live for everyone!", "success");
            } else {
                showToast("❌ Failed to save to the cloud.", "error");
            }
        } catch (err) {
            console.error("Publish error:", err);
            showToast("⚠️ Network error while publishing.", "error");
        }
    };

    // Add a new sub-item to a specific menu
    const addSubMenu = (menuId) => {
        setMenuData(prev => prev.map(m => {
            if (m.id !== menuId) return m;
            const newSub = {
                id: `sub-${Date.now()}`,
                title: {he: '', en: ''},
                linkedItemIds: []
            };
            return {...m, subItems: [...(m.subItems || []), newSub]};
        }));
    };

// Remove a sub-item from a specific menu
    const removeSubMenu = (menuId, subId) => {
        setMenuData(prev => prev.map(m => {
            if (m.id !== menuId) return m;
            return {...m, subItems: m.subItems.filter(s => s.id !== subId)};
        }));
    };

// Reorder sub-items
    const moveSubMenu = (menuId, fromIndex, toIndex) => {
        setMenuData(prev => prev.map(menu => {
            if (menu.id !== menuId) return menu;
            const newSubItems = [...(menu.subItems || [])];
            const [movedItem] = newSubItems.splice(fromIndex, 1);
            newSubItems.splice(toIndex, 0, movedItem);
            return {...menu, subItems: newSubItems};
        }));
    };
    return {
        activeTab, setActiveTab,
        openItems, toggleAccordion,
        updateLogo, updateMenuBg,
        updateMenuTitle, updateNewsTitle,
        linkItemToNews, unlinkItemFromNews,
        linkItemToSub, unlinkItemFromSub,
        publishToCloud,
        addSubMenu,
        removeSubMenu,
        moveSubMenu,
        moveMenu,
        moveNews
    };
};