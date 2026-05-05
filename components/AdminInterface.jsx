import React from 'react';
import NewsSection from '@/components/admin/NewsSection';
import MenuSection from '@/components/admin/MenuSection';
import SettingSection from '@/components/admin/SettingSection';
import MessagesSection from '@/components/admin/MessagesSection';
import FooterSection from '@/components/admin/FooterSection';
import AdminTabs from '@/components/admin/AdminTabs';
import {useAdminLogic} from '@/components/admin/useAdminLogic';



const AdminInterface = ({logic, currentLang = 'he'}) => {
    const isHe = currentLang === 'he';

    const {
        activeTab, setActiveTab, openItems, toggleAccordion, updateLogo,
        updateMenuBg, updateMenuTitle, updateNewsTitle, linkItemToNews, unlinkItemFromNews,
        linkItemToSub, unlinkItemFromSub, publishToCloud, moveSubMenu, removeSubMenu,
        moveMenu, moveNews
    } = useAdminLogic(logic);

    const {
        menuData, newsData, footerData, handleFileUpload, removeFile, addMenu,
        addSubMenu, removeMenu, addNews, removeNews, logo, setLogo,
        setMenuData, setNewsData, setFooterData, t
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
                        /* Passing trigger function to open file dialog */
                        importData={() => document.getElementById('admin-import-input').click()}
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
            </main>
        </div>
    );
};

export default AdminInterface;
