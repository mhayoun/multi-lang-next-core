import {useState, useRef, useEffect} from 'react';
import {updateMenuField, copyToClipboard} from '@/components/admin/htmlManagement';

export const useSubMenuEditor = (sub, menuId, setMenuData, menuData) => {
    const [viewMode, setViewMode] = useState('edit'); // 'edit' | 'preview'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalLang, setModalLang] = useState('he');
    const [copied, setCopied] = useState(false);
    const [leftWidth, setLeftWidth] = useState(50);

    const isResizing = useRef(false);

    const handleUpdateField = (field, lang, value) => {
        const newData = updateMenuField(menuData, menuId, sub.id, field, lang, value);
        setMenuData(newData);
    };

    const handleCopy = async () => {
        const success = await copyToClipboard(sub.content?.[modalLang] || '');
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const startResizing = () => {
        isResizing.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

    const stopResizing = () => {
        isResizing.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
    };

    useEffect(() => {
        const onMouseMove = (e) => {
            if (!isResizing.current) return;
            const newWidth = (e.clientX / window.innerWidth) * 100;
            if (newWidth > 15 && newWidth < 85) setLeftWidth(newWidth);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, []);

    const updateSubMenu = (menuId, subId, newData) => {
        console.log("--- UpdateSubMenu Debug ---");
        console.log("Targeting Menu:", menuId, "SubMenu:", subId);
        console.log("Payload:", newData);

        setMenuData(prevData => prevData.map(menu => {
            // Find the parent Menu (e.g., 'Solutions', 'Products')
            if (menu.id == menuId) {
                console.log('found menu.id='+menu.id + ' subId='+subId);
                return {
                    ...menu,
                    // The ?. ensures we don't crash if subMenus is missing
                    subItems: menu.subItems?.map(sub => {
                        // Find the specific SubMenu by ID
                        console.log('sub.id='+sub.id);
                        if (sub.id == subId) {
                            console.log("✅ Found Target SubMenu. Old Data:", sub);
                            // Merge existing sub-menu data with the new keys (like 'youtubes')
                            const updatedSub = { ...sub, ...newData };
                            console.log("🚀 New Merged SubMenu:", updatedSub);
                            return updatedSub;
                        }
                        return sub;
                    }) || []
                };
            }
            return menu;
        }));
    };

    return {
        viewMode, setViewMode,
        isModalOpen, setIsModalOpen,
        modalLang, setModalLang,
        copied, leftWidth,
        handleUpdateField,
        handleCopy,
        startResizing,
        updateSubMenu
    };
};