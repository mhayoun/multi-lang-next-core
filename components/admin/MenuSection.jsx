import React from 'react';
import {Plus, Trash2, FileText, Link2} from 'lucide-react';
import SubMenuEditor from '@/components/admin/SubMenuEditor';
import SliderLinker from '@/components/admin/SliderLinker';
import SliderLinkerOnce from '@/components/admin/SliderLinkerOnce';
import EditorAccordionItem from '@/components/admin/EditorAccordionItem';
import MenuBackgroundEditor from "@/components/admin/MenuBackgroundEditor";

const MenuSection = ({
                         menuData, isHe, openItems, toggleAccordion, moveMenu,
                         moveSubMenu, removeSubMenu,
                         updateMenuTitle, updateMenuBg, addMenu, removeMenu,
                         addSubMenu, handleFileUpload, removeFile, setMenuData,
                         linkItemToSub, unlinkItemFromSub, publishToCloud
                     }) => {
    const t = (obj) => isHe ? obj?.he || '' : obj?.en || '';

    // Helper to update specific fields within a sub-item
    const updateSubMenuField = (menuId, subId, field, value) => {
        console.log("Updating:", {menuId, subId, field, value}); // Check your console!
        setMenuData(prev => prev.map(m => {
            if (m.id === menuId) {
                return {
                    ...m,
                    subItems: m.subItems.map(s => s.id === subId ? {...s, [field]: value} : s)
                };
            }
            return m;
        }));
    };

    return (
        <section className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-800">{isHe ? 'ניהול תפריטים' : 'Menu Management'}</h2>
                <button onClick={addMenu}
                        className="bg-blue-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg transition">
                    <Plus size={18}/> {isHe ? 'תפריט חדש' : 'New Menu'}
                </button>
            </div>

            {menuData.map((menu, index) => (
                <EditorAccordionItem
                    key={menu.id}
                    id={menu.id}
                    index={index}
                    totalItems={menuData.length}
                    isOpen={openItems[menu.id]}
                    onToggle={toggleAccordion}
                    onRemove={removeMenu}
                    onMove={moveMenu}
                    titleInputs={
                        <>
                            {(isHe ? ['he', 'en'] : ['en', 'he']).map((lang) => (
                                <input
                                    key={lang}
                                    className="border-none bg-transparent font-bold focus:ring-0 flex-1"
                                    dir={lang === 'he' ? 'rtl' : 'ltr'}
                                    value={menu.title?.[lang] || ''}
                                    onChange={(e) => updateMenuTitle(menu.id, lang, e.target.value)}
                                    placeholder={lang === 'he' ? "כותרת בעברית" : "English Title"}
                                />
                            ))}
                        </>
                    }>
                    {/* Card background image */}
                    <MenuBackgroundEditor
                        menu={menu}
                        isHe={isHe}
                        updateMenuBg={updateMenuBg}
                        onRemoveImage={(id) => {
                            setMenuData(menuData.map(m => m.id === id ? {...m, bgImage: null} : m));
                        }}
                    />


                    {/* Sub-items Section */}
                    <div className={`space-y-4 border-blue-100 ${isHe ? 'border-r-4 pr-6' : 'border-l-4 pl-6'}`}>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            {isHe ? 'תת-תפריטים' : 'Sub-items'}
                        </h4>

                        <div className="space-y-3">
                            {menu.subItems.map((sub, subIndex) => (
                                <EditorAccordionItem
                                    key={sub.id}
                                    id={sub.id}
                                    index={subIndex}
                                    totalItems={menu.subItems.length}
                                    isOpen={openItems[sub.id]} // Ensure your toggle logic supports sub-ids
                                    onToggle={toggleAccordion}
                                    onRemove={() => removeSubMenu(menu.id, sub.id)}
                                    onMove={(from, to) => moveSubMenu(menu.id, from, to)}
                                    titleInputs={
                                        <>
                                            {(isHe ? ['he', 'en'] : ['en', 'he']).map((lang) => (
                                                <input
                                                    key={lang}
                                                    className="border-none bg-transparent focus:ring-0 flex-1"
                                                    dir={lang === 'he' ? 'rtl' : 'ltr'}
                                                    value={sub.title?.[lang] || ''}
                                                    onChange={(e) => updateSubMenuField(
                                                        menu.id,
                                                        sub.id,
                                                        'title',
                                                        {...sub.title, [lang]: e.target.value}
                                                    )}
                                                    placeholder={lang === 'he' ? "כותרת בעברית" : "English Title"}
                                                />
                                            ))}
                                        </>
                                    }
                                >
                                    <div className="space-y-6">
                                        {/* --- NEW FEATURE: CONTENT MODE TOGGLE --- */}
                                        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                                            <button
                                                onClick={() => updateSubMenuField(menu.id, sub.id, 'contentMode', 'editor')}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${(!sub.contentMode || sub.contentMode === 'editor') ? 'bg-white text-blue-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                <FileText size={14}/> {isHe ? 'עורך תוכן' : 'Content Editor'}
                                            </button>
                                            <button
                                                onClick={() => updateSubMenuField(menu.id, sub.id, 'contentMode', 'linker')}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${sub.contentMode === 'linker' ? 'bg-white text-blue-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                <Link2 size={14}/> {isHe ? 'קישור לפריט קיים' : 'Link Existing Item'}
                                            </button>
                                        </div>

                                        {/* --- NEW FEATURE: CONDITIONAL RENDER --- */}
                                        {(!sub.contentMode || sub.contentMode === 'editor') ? (
                                            <div
                                                className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <SubMenuEditor
                                                    sub={sub}
                                                    menuId={menu.id}
                                                    isHe={isHe}
                                                    handleFileUpload={handleFileUpload}
                                                    removeFile={removeFile}
                                                    setMenuData={setMenuData}
                                                    menuData={menuData}
                                                    publishToCloud={publishToCloud}
                                                />

                                                <SliderLinker
                                                    isHe={isHe}
                                                    menuData={menuData}
                                                    linkedItemIds={sub.linkedItemIds || []}
                                                    onLink={(itemId) => linkItemToSub(menu.id, sub.id, itemId)}
                                                    onUnlink={(itemId) => unlinkItemFromSub(menu.id, sub.id, itemId)}
                                                    t={t}
                                                />
                                            </div>
                                        ) : (
                                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                <SliderLinkerOnce
                                                    isHe={isHe}
                                                    menuData={menuData}
                                                    selectedId={sub.linkedItemId}
                                                    onSelect={(val) => updateSubMenuField(menu.id, sub.id, 'linkedItemId', val)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </EditorAccordionItem>
                            ))}
                        </div>
                        <button onClick={() => addSubMenu(menu.id)}
                                className="text-blue-600 text-xs font-bold hover:underline">+ {isHe ? 'הוסף תת-תפריט' : 'Add Sub-item'}</button>
                    </div>
                </EditorAccordionItem>
            ))}
        </section>
    );
};

export default MenuSection;