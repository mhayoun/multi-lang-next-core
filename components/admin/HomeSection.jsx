// components/admin/HomeSection.jsx
import * as Lucide from 'lucide-react';
import React, { useEffect } from 'react';

// Import specific brand icons from FontAwesome (part of react-icons)
import {FaYoutube} from 'react-icons/fa6';

const HomeSection = ({homeData, setHomeData, handleFileUpload, removeFile, isHe}) => {

    // 1. Instead of returning "Loading", provide an empty structure if data is null
    const activeData = homeData || {
        images: [],
        videos: [],
        youtubes: [],
        settings: {title: {he: '', en: ''}, showGallery: false}
    };

    // Auto-sync showGallery toggle with content presence
    useEffect(() => {
        // 1. Logic must use homeData (The Real State)
        // If homeData doesn't exist yet, we stop here.
        if (!homeData) return;

        const hasContent =
            (homeData.images?.length > 0) ||
            (homeData.videos?.length > 0) ||
            (homeData.youtubes?.length > 0);

        const currentShowGallery = homeData.settings?.showGallery;

        // 2. Only trigger if there's a difference
        if (hasContent !== currentShowGallery) {
            setHomeData(prev => {
                // Safety check: if prev is null, use the activeData defaults as base
                const base = prev || activeData;
                return {
                    ...base,
                    settings: {
                        ...base.settings,
                        showGallery: hasContent
                    }
                };
            });
        }
    // Watch homeData specifically
    }, [
        homeData?.images?.length,
        homeData?.videos?.length,
        homeData?.youtubes?.length,
        homeData?.settings?.showGallery,
        setHomeData
    ]);

    // Safety check to prevent "Cannot read properties of undefined (reading 'settings')"
    if (!activeData) {
        return (
            <div className="p-10 text-center text-slate-500">
                {isHe ? 'טוען נתונים...' : 'Loading home data...'}
            </div>
        );
    }

    const addYoutube = (url) => {
        if (!url || !url.trim()) return;
        setHomeData(prev => ({
            ...prev,
            youtubes: [...(prev.youtubes || []), url.trim()]
        }));
    };

    const updateTitle = (lang, value) => {
        setHomeData(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                title: {
                    ...prev.settings?.title,
                    [lang]: value
                }
            }
        }));
    };

    return (
        <div className="space-y-6 bg-white p-6 rounded-2xl border shadow-sm" dir={isHe ? 'rtl' : 'ltr'}>
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-slate-800">
                    {isHe ? 'ניהול דף הבית והגלריה' : 'Home Page & Gallery Management'}
                </h2>
            </div>

            {/* Gallery Title Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">
                        {isHe ? 'כותרת הגלריה (עברית)' : 'Gallery Title (Hebrew)'}
                    </label>
                    <input
                        type="text"
                        value={activeData.settings?.title?.he || ''}
                        onChange={(e) => updateTitle('he', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">
                        {isHe ? 'כותרת הגלריה (English)' : 'Gallery Title (English)'}
                    </label>
                    <input
                        type="text"
                        value={activeData.settings?.title?.en || ''}
                        onChange={(e) => updateTitle('en', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                    />
                </div>
            </div>

            {/* Image Gallery */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 font-bold text-slate-700">
                    <Lucide.Image size={18} className="text-blue-500"/>
                    {isHe ? 'גלריית תמונות' : 'Image Gallery'}
                </label>
                <div className="flex items-center justify-center w-full">
                    <label
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Lucide.Plus size={24} className="text-slate-400 mb-2"/>
                            <p className="text-sm text-slate-500">{isHe ? 'לחץ להעלאת תמונות' : 'Click to upload images'}</p>
                        </div>
                        <input type="file" multiple accept="image/*" className="hidden"
                               onChange={(e) => handleFileUpload(e, 'home', 'main', 'images', false, true)}/>
                    </label>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                    {activeData.images?.map((img, i) => (
                        <div key={i} className="relative group aspect-square">
                            <img src={img} className="w-full h-full object-cover rounded-lg border shadow-sm" alt=""/>
                            <button onClick={() => removeFile('home', 'main', 'images', i, false, true)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-lg">
                                <Lucide.Trash2 size={12}/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video Section */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 font-bold text-slate-700">
                    <Lucide.Video size={18} className="text-purple-600"/>
                    {isHe ? 'סרטוני MP4' : 'MP4 Videos'}
                </label>
                <input type="file" multiple accept="video/*"
                       onChange={(e) => handleFileUpload(e, 'home', 'main', 'videos', false, true)}
                       className="text-sm text-slate-500"/>
                <div className="flex gap-2 flex-wrap">
                    {activeData.videos?.map((vid, i) => (
                        <div key={i} className="relative group w-20 h-20 bg-black rounded border">
                            <video src={vid} className="w-full h-full object-cover opacity-60"/>
                            <button onClick={() => removeFile('home', 'main', 'videos', i, false, true)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                                <Lucide.Trash2 size={10}/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* YouTube Links using FontAwesome */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 font-bold text-slate-700">
                    <FaYoutube size={18} className="text-red-600"/>
                    {isHe ? 'קישורי יוטיוב' : 'YouTube Links'}
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="https://www.youtube.com/..."
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                addYoutube(e.target.value);
                                e.target.value = '';
                            }
                        }}
                    />
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {activeData.youtubes?.map((url, i) => (
                        <div key={i}
                             className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 group">
                            <span className="text-xs text-slate-600 truncate max-w-[90%]">{url}</span>
                            <button
                                onClick={() => setHomeData(prev => ({
                                    ...prev,
                                    youtubes: prev.youtubes.filter((_, idx) => idx !== i)
                                }))}
                                className="text-slate-400 hover:text-red-500 transition"
                            >
                                <Lucide.Trash2 size={14}/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeSection;