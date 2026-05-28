import React from 'react';
import NewsSection from '@/components/admin/NewsSection';
import MenuSection from '@/components/admin/MenuSection';
import HomeSection from '@/components/admin/HomeSection';
import SettingSection from '@/components/admin/SettingSection';
import MessagesSection from '@/components/admin/MessagesSection';
import FooterSection from '@/components/admin/FooterSection';
import AdminTabs from '@/components/admin/AdminTabs';
import {useAdminLogic} from '@/components/admin/useAdminLogic';


const AdminInterface = ({logic, currentLang = 'he'}) => {
    const isHe = currentLang === 'he';

    const {
        activeTab, setActiveTab, openItems, toggleAccordion, publishToCloud,
        moveMenu, moveNews, updateLogo, updateMenuBg, updateMenuTitle,
        updateNewsTitle, linkItemToNews, unlinkItemFromNews, linkItemToSub,
        unlinkItemFromSub, addSubMenu, removeSubMenu, moveSubMenu,
    } = useAdminLogic(logic);

    const {
        menuData, newsData, footerData, homeData,
        handleFileUpload, removeFile,
        addMenu, addNews, removeMenu, removeNews,
        logo, setLogo, setMenuData, setNewsData, setFooterData,
        setHomeData,
        siteSettings, setSiteSettings, t
    } = logic;

    const exportData = () => {
        const downloadJSON = (data, fileName) => {
            const blob = new Blob(
                [JSON.stringify(data, null, 2)],
                {type: 'application/json'});
            const href = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        };
        downloadJSON(menuData, 'DEFAULT_MENU.json');
        downloadJSON(newsData, 'DEFAULT_NEWS.json');
        downloadJSON(footerData, 'DEFAULT_FOOTER.json');
    };

    const exportFullData = () => {
        const fullConfig = {
            menuData,
            newsData,
            logo,
            siteSettings,
            footerData
        };

        const blob = new Blob([JSON.stringify(fullConfig, null, 2)], {type: 'application/json'});
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = `${process.env.NEXT_PUBLIC_CLIENT_ID || 'unknown'}_config.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };

    /**
     * Single File Import Handler
     * Detects filename and updates the specific data slice
     */
    const handleImportChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                const fileName = file.name;

                if (fileName === 'DEFAULT_MENU.json') {
                    setMenuData(json);
                    console.log("✅ Menu Data Updated:", json);
                } else if (fileName === 'DEFAULT_NEWS.json') {
                    setNewsData(json);
                    console.log("✅ News Data Updated:", json);
                } else if (fileName === 'DEFAULT_FOOTER.json') {
                    // Since your hook defines this, we can call it directly
                    setFooterData(json);
                    console.log("✅ Footer Data Updated:", json);
                } else {
                    alert(`Filename mismatch: ${fileName}`);
                }
            } catch (err) {
                console.error("Import Error:", err);
                alert("Failed to parse JSON. Check file format.");
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    // --- NEW FULL IMPORT (Updates all states at once) ---
    const handleImportFullChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                // Validation check for full config keys
                if (json.menuData || json.newsData || json.footerData) {
                    if (json.menuData) setMenuData(json.menuData);
                    if (json.newsData) setNewsData(json.newsData);
                    if (json.footerData) setFooterData(json.footerData);
                    if (json.logo !== undefined) setLogo(json.logo);
                    if (json.siteSettings && setSiteSettings) setSiteSettings(json.siteSettings);
                    alert(isHe ? "הגדרות המערכת עודכנו בהצלחה" : "System configuration updated successfully");
                } else {
                    alert("Invalid config format");
                }
            } catch (err) {
                alert("Error parsing Full Config");
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    console.log("Type de setHomeData:", typeof setHomeData);

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20 px-4" dir={isHe ? "rtl" : "ltr"}>

            {/* Hidden Input for Import */}
            <input
                type="file"
                id="admin-import-input"
                multiple
                accept=".json"
                className="hidden"
                onChange={handleImportChange}
            />

            <input
                type="file"
                id="admin-import-full-input"
                accept=".json"
                className="hidden"
                onChange={handleImportFullChange}
            />

            {/* Navigation & Publish Control */}
            <AdminTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isHe={isHe}
                publishToCloud={publishToCloud}
            />

            <main className="min-h-[400px]">
                {activeTab === 'footer' && (
                    <FooterSection logic={logic} isHe={isHe}/>
                )}

                {activeTab === 'settings' && (
                    <SettingSection
                        logic={logic}
                        isHe={isHe}
                        exportData={exportData}
                        exportFullData={exportFullData}
                        importData={() => document.getElementById('admin-import-input').click()}
                        importFullData={() => document.getElementById('admin-import-full-input').click()}
                        logo={logo}
                        setLogo={setLogo}
                        updateLogo={updateLogo}
                    />
                )}

                {/* Added Messages Section */}
                {activeTab === 'messages' && (
                    <MessagesSection isHe={isHe}/>
                )}

                {activeTab === 'menu' && (
                    <MenuSection
                        menuData={menuData}
                        isHe={isHe}
                        openItems={openItems}
                        toggleAccordion={toggleAccordion}
                        moveMenu={moveMenu}
                        updateMenuTitle={updateMenuTitle}
                        updateMenuBg={updateMenuBg}
                        addMenu={addMenu}
                        removeMenu={removeMenu}
                        addSubMenu={addSubMenu}
                        removeSubMenu={removeSubMenu}
                        moveSubMenu={moveSubMenu}
                        handleFileUpload={handleFileUpload}
                        removeFile={removeFile}
                        setMenuData={setMenuData}
                        linkItemToSub={linkItemToSub}
                        unlinkItemFromSub={unlinkItemFromSub}
                        publishToCloud={publishToCloud}
                    />
                )}

                {activeTab === 'news' && (
                    <NewsSection
                        newsData={newsData}
                        menuData={menuData}
                        isHe={isHe}
                        t={t}
                        openItems={openItems}
                        toggleAccordion={toggleAccordion}
                        updateNewsTitle={updateNewsTitle}
                        linkItemToNews={linkItemToNews}
                        unlinkItemFromNews={unlinkItemFromNews}
                        removeNews={removeNews}
                        addNews={addNews}
                        moveNews={moveNews}
                        handleFileUpload={handleFileUpload}
                        removeFile={removeFile}
                        setNewsData={setNewsData}
                    />
                )}

                {/* Home Section Rendering */}
                {activeTab === 'home' && (
                    <HomeSection
                        homeData={homeData}
                        setHomeData={setHomeData}
                        handleFileUpload={handleFileUpload}
                        removeFile={removeFile}
                        isHe={isHe}
                    />
                )}
            </main>
        </div>
    );
};

export default AdminInterface;
