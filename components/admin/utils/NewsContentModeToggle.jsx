import React from 'react';
import { FileText, Link2, EyeOff } from 'lucide-react';

const ContentModeToggle = ({ news, isHe, updateNewsField }) => {
    const currentMode = news.contentMode || 'editor';

    return (
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
            {/* EDITOR MODE */}
            <button
                onClick={() => updateNewsField(news.id, 'contentMode', 'editor')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                    currentMode === 'editor' 
                        ? 'bg-white text-blue-600 shadow' 
                        : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <FileText size={14} />
                {isHe ? 'עורך תוכן' : 'Content Editor'}
            </button>

            {/* LINKER MODE */}
            <button
                onClick={() => updateNewsField(news.id, 'contentMode', 'linker')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                    currentMode === 'linker' 
                        ? 'bg-white text-blue-600 shadow' 
                        : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <Link2 size={14} />
                {isHe ? 'קישור לפריט' : 'Link Item'}
            </button>

            {/* NOT VISIBLE MODE */}
            <button
                onClick={() => updateNewsField(news.id, 'contentMode', 'hidden')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                    currentMode === 'hidden' 
                        ? 'bg-white text-red-600 shadow' 
                        : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <EyeOff size={14} />
                {isHe ? 'לא מוצג' : 'Not Visible'}
            </button>
        </div>
    );
};

export default ContentModeToggle;