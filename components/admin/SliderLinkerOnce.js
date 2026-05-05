import React from 'react';
import { Link2, Target } from 'lucide-react';

const SliderLinkerOnce = ({ menuData, selectedId, onSelect, isHe }) => {
    return (
        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-600 text-white rounded-lg">
                    <Target size={16} />
                </div>
                <label className="block text-xs font-black text-blue-900 uppercase tracking-tight">
                    {isHe ? 'יעד קישור ישיר' : 'Direct Link Destination'}
                </label>
            </div>

            <select
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer hover:border-blue-300"
                value={selectedId || ''}
                onChange={(e) => onSelect(e.target.value)}
            >
                <option value="">{isHe ? '-- בחר פריט מהתפריט --' : '-- Select Menu Item --'}</option>

                {menuData?.map((menu) => (
                    /* Groups the sub-items under their parent menu title */
                    <optgroup key={menu.id} label={isHe ? menu.title.he : menu.title.en}>
                        {menu.subItems?.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                                {isHe ? sub.title.he : sub.title.en}
                            </option>
                        ))}
                    </optgroup>
                ))}
            </select>

            <div className="mt-3 flex items-start gap-2 text-[11px] text-blue-600/80 leading-relaxed">
                <Link2 size={12} className="mt-0.5 flex-shrink-0" />
                <p>
                    {isHe
                        ? 'במצב זה, דף החדשות לא יוצג. לחיצה על "קרא עוד" תעביר את המשתמש ישירות לעמוד שנבחר כאן.'
                        : 'In this mode, the news page content is bypassed. Clicking "Read More" sends the user directly to the selected page.'}
                </p>
            </div>
        </div>
    );
};

export default SliderLinkerOnce;