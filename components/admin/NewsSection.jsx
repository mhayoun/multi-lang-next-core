import React from 'react';
import {Plus, Newspaper, Trash2, Link2, FileText} from 'lucide-react';
import SubMenuEditor from '@/components/admin/SubMenuEditor';
import SliderLinker from '@/components/admin/SliderLinker';
import SliderLinkerOnce from '@/components/admin/SliderLinkerOnce';
import EditorAccordionItem from '@/components/admin/EditorAccordionItem';

const NewsSection = ({
                         newsData, menuData, isHe, t, openItems, toggleAccordion,
                         updateNewsTitle, linkItemToNews, unlinkItemFromNews,
                         removeNews, addNews, handleFileUpload, removeFile, setNewsData, moveNews
                     }) => {

    // Update a specific field for a news item (e.g. contentMode, bgImage)
    const updateNewsField = (id, field, value) => {
        setNewsData(prev => prev.map(n => n.id === id ? {...n, [field]: value} : n));
    };

    return (
        <section className="animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-800">{isHe ? 'ניהול חדשות' : 'News Management'}</h2>
                <button onClick={addNews}
                        className="bg-blue-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg transition">
                    <Plus size={18}/> {isHe ? 'פוסט חדש' : 'New Post'}
                </button>
            </div>

            <div className="space-y-4">
                {newsData.map((news, index) => (
                    <EditorAccordionItem
                        key={news.id}
                        id={news.id}
                        index={index}
                        totalItems={newsData.length}
                        isOpen={openItems[news.id]}
                        onToggle={toggleAccordion}
                        onRemove={removeNews}
                        onMove={moveNews}
                        icon={Newspaper}
                        isHe={isHe}
                        itemData={news}
                        onFileUpload={(e, id, type) => handleFileUpload(e, id, null, type, true)}
                        titleInputs={
                            <>
                                <input
                                    className="border-none bg-transparent font-bold focus:ring-0 text-sm md:text-base"
                                    dir="rtl" placeholder="כותרת בעברית" value={news.title?.he || ''}
                                    onChange={(e) => updateNewsTitle(news.id, 'he', e.target.value)}/>
                                <input
                                    className="border-none bg-transparent font-bold focus:ring-0 text-sm md:text-base"
                                    dir="ltr" placeholder="English Title" value={news.title?.en || ''}
                                    onChange={(e) => updateNewsTitle(news.id, 'en', e.target.value)}/>
                            </>
                        }
                    >
                        <div className="space-y-6">
                            {/* --- CONTENT MODE TOGGLE --- */}
                            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                                <button
                                    onClick={() => updateNewsField(news.id, 'contentMode', 'editor')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${(!news.contentMode || news.contentMode === 'editor') ? 'bg-white text-blue-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <FileText size={14}/> {isHe ? 'עורך תוכן' : 'Content Editor'}
                                </button>
                                <button
                                    onClick={() => updateNewsField(news.id, 'contentMode', 'linker')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${news.contentMode === 'linker' ? 'bg-white text-blue-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Link2 size={14}/> {isHe ? 'קישור לפריט קיים' : 'Link Existing Item'}
                                </button>
                            </div>

                            {/* SECTION IMAGES DE FOND */}

                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                {/* --- MOBILE BACKGROUND --- */}
                                <div className="space-y-2">
                                    <label className="font-bold text-slate-400 block text-[10px] uppercase">
                                        {isHe ? 'תמונת רקע מובייל' : 'Mobile Background Image'}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, news.id, null, isHe ? 'bgImage_mob' : 'bgImage_mob_en', true)}
                                        className="text-[10px] w-full file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                    />
                                    {(() => {
                                        const mobileData = isHe ? news.bgImage_mob : (news.bgImage_mob_en || news.bgImage_mob);
                                        const mobileUrl = Array.isArray(mobileData) ? mobileData[0] : mobileData;

                                        return mobileUrl ? (
                                            <div className="relative w-12 h-20 mt-2 group">
                                                <img
                                                    src={mobileUrl}
                                                    className="w-full h-full object-cover rounded border shadow-sm"
                                                    alt="mobile preview"
                                                />
                                                <button
                                                    onClick={() => updateNewsField(news.id, isHe ? 'bgImage_mob' : 'bgImage_mob_en', '')}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition shadow-sm z-10"
                                                >
                                                    <Trash2 size={10}/>
                                                </button>
                                            </div>
                                        ) : null;
                                    })()}
                                </div>

                                {/* --- WEB BACKGROUND (SLIDER) --- */}
                                <div className="space-y-2">
                                    <label className="font-bold text-slate-400 block text-[10px] uppercase">
                                        {isHe ? 'תמונת רקע דסקטופ' : 'Web Background Image (Slider)'}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, news.id, null, isHe ? 'bgImage_web' : 'bgImage_web_en', true)}
                                        className="text-[10px] w-full file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                    />
                                    {(() => {
                                        const webData = isHe ? news.bgImage_web : (news.bgImage_web_en || news.bgImage_web);
                                        const webUrl = Array.isArray(webData) ? webData[0] : webData;

                                        return webUrl ? (
                                            <div className="relative w-24 h-10 mt-2 group">
                                                <img
                                                    src={webUrl}
                                                    className="w-full h-full object-cover rounded border shadow-sm"
                                                    alt="web preview"
                                                />
                                                <button
                                                    onClick={() => updateNewsField(news.id, isHe ? 'bgImage_web' : 'bgImage_web_en', '')}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition shadow-sm z-10"
                                                >
                                                    <Trash2 size={10}/>
                                                </button>
                                            </div>
                                        ) : null;
                                    })()}
                                </div>
                            </div>

                            {/* --- CONDITIONAL RENDER --- */}
                            {(!news.contentMode || news.contentMode === 'editor') ? (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">{isHe ? 'תוכן הדף' : 'Page Content'}</h4>
                                    <SubMenuEditor sub={news} menuId={news.id} isHe={isHe}
                                                   handleFileUpload={(e, tid, sid, type) => handleFileUpload(e, tid, sid, type, true)}
                                                   removeFile={(tid, sid, type, idx) => removeFile(tid, sid, type, idx, true)}
                                                   setMenuData={setNewsData} menuData={newsData}/>

                                    {/* Keep SliderLinker available for Editor mode if you want 'Related Links' */}
                                    <div className="pt-4 border-t mt-6">
                                        <SliderLinker
                                            isHe={isHe}
                                            menuData={menuData}
                                            linkedItemIds={news.linkedItemIds || []}
                                            onLink={(itemId) => linkItemToNews(news.id, itemId)}
                                            onUnlink={(itemId) => unlinkItemFromNews(news.id, itemId)}
                                            t={t}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <SliderLinkerOnce
                                    isHe={isHe}
                                    menuData={menuData}
                                    selectedId={news.linkedItemId}
                                    onSelect={(val) => updateNewsField(news.id, 'linkedItemId', val)}
                                />
                            )}

                            {/* We keep SliderLinker visible or accessible if you need "Featured Links" even with custom content,
                                but per your request, the toggle logic above handles the primary section behavior. */}
                        </div>
                    </EditorAccordionItem>
                ))}
            </div>
        </section>
    );
};

export default NewsSection;