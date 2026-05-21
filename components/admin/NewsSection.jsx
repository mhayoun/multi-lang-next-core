import React from 'react';
import {Plus, Newspaper, Trash2, Link2, FileText} from 'lucide-react';
import SubMenuEditor from '@/components/admin/SubMenuEditor';
import SliderLinker from '@/components/admin/SliderLinker';
import SliderLinkerOnce from '@/components/admin/SliderLinkerOnce';
import EditorAccordionItem from '@/components/admin/EditorAccordionItem';
import NewsBackgroundEditor from "@/components/admin/utils/NewsBackgroundEditor";
import ContentModeToggle from "@/components/admin/utils/NewsContentModeToggle";

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
                            <ContentModeToggle
                                news={news}
                                isHe={isHe}
                                updateNewsField={updateNewsField}
                            />

                            {/* SECTION IMAGES/VIDEO DE FOND */}
                            <NewsBackgroundEditor
                                news={news}
                                isHe={isHe}
                                handleFileUpload={handleFileUpload}
                                updateNewsField={updateNewsField}
                            />

                            {/* --- CONDITIONAL RENDER --- */}
                            {news.contentMode === 'hidden' ? (
                                    <div
                                        className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm italic">
                                        {isHe ? 'פוסט זה מוסתר מהאתר' : 'This post is hidden from the website'}
                                    </div>
                                ) :
                                (!news.contentMode || news.contentMode === 'editor') ? (
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
                                )
                            }
                        </div>
                    </EditorAccordionItem>
                ))}
            </div>
        </section>
    );
};

export default NewsSection;