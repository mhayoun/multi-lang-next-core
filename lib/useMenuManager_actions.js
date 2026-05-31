//This file contains the logic for adding, moving, and removing items (Menu and News).
import {createNewMenu, createNewSubMenu, createNewNews} from '@/lib/data';

export const useMenuManagerActions = (menuData, setMenuData, newsData, setNewsData, setFooterData, setHomeData) => {

    const uploadDefaults = () => {
        if (window.confirm("Restore default structures?")) {
            // Note: Define DEFAULT_ constants or import them here
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

    const removeNews = (id) => setNewsData(prev => prev.filter(n => n.id !== id));

    // Add this inside useMenuManager_actions.js
    const moveNews = (fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= newsData.length) return;
        const updatedData = [...newsData];
        const [movedItem] = updatedData.splice(fromIndex, 1);
        updatedData.splice(toIndex, 0, movedItem);
        setNewsData(updatedData);
    };

    return {uploadDefaults, addMenu, addSubMenu, removeMenu, moveMenu, moveSubMenu, addNews, removeNews, moveNews};
};