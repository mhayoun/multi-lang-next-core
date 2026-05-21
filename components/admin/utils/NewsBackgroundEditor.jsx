import React from 'react';
import { Trash2 } from 'lucide-react';

const NewsBackgroundEditor = ({ news, isHe, handleFileUpload, updateNewsField }) => {
    // Helper to render individual upload columns
    const RenderUploadCol = ({ label, type, fieldHe, fieldEn, previewType = 'image' }) => {
        const fieldName = isHe ? fieldHe : fieldEn;
        const rawData = isHe ? news[fieldHe] : (news[fieldEn] || news[fieldHe]);
        const url = Array.isArray(rawData) ? rawData[0] : rawData;

        return (
            <div className="space-y-2">
                <label className="font-bold text-slate-400 block text-[10px] uppercase">
                    {label}
                </label>
                <input
                    type="file"
                    accept={type}
                    onChange={(e) => handleFileUpload(e, news.id, null, fieldName, true)}
                    className="text-[10px] w-full file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                {url && (
                    <div className={`relative mt-2 group shadow-sm border rounded overflow-hidden ${previewType === 'mobile' ? 'w-12 h-20' : 'w-24 h-12'}`}>
                        {previewType === 'video' ? (
                            <video src={url} muted loop playsInline autoPlay className="w-full h-full object-cover" />
                        ) : (
                            <img src={url} alt="preview" className="w-full h-full object-cover" />
                        )}
                        <button
                            onClick={() => updateNewsField(news.id, fieldName, '')}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition z-10"
                        >
                            <Trash2 size={10} />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <RenderUploadCol
                label={isHe ? 'תמונת רקע מובייל' : 'Mobile Background Image'}
                type="image/*"
                fieldHe="bgImage_mob"
                fieldEn="bgImage_mob_en"
                previewType="mobile"
            />
            <RenderUploadCol
                label={isHe ? 'תמונת רקע דסקטופ' : 'Web Background Image'}
                type="image/*"
                fieldHe="bgImage_web"
                fieldEn="bgImage_web_en"
            />
            <RenderUploadCol
                label={isHe ? 'וידאו רקע' : 'Video Background'}
                type="video/*"
                fieldHe="bgVideo"
                fieldEn="bgVideo_en"
                previewType="video"
            />
        </div>
    );
};

export default NewsBackgroundEditor;