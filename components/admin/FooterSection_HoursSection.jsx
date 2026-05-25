import React from 'react';
import {Plus, Trash2, ChevronUp, ChevronDown, Link as LinkIcon, LayoutGrid} from 'lucide-react';

const HoursSection = ({footer, lang, isHe, menuData, t, onTitleChange, onItemChange, onAdd, onRemove, onMove}) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
                {/* Box 1: Section Title */}
                <div className="flex-1 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                    <label className="block text-[10px] font-bold text-blue-600 uppercase px-1 mb-1">
                        {isHe ? 'כותרת אזור' : 'Section Title'}
                    </label>
                    <input
                        className="w-full p-2 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        value={footer.hours.title?.[lang] || ''}
                        onChange={(e) => onTitleChange('hours', e.target.value)}
                    />
                </div>

                {/* Box 2: Add New Item Action */}
                <div
                    className="flex-1 p-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase px-1">
                            {isHe ? 'הוספת פריט חדש' : 'Add New Item'}
                        </p>
                        <p className="text-[11px] text-slate-400 px-1 leading-tight">
                            {isHe
                                ? 'לחץ על הכפתור כדי להוסיף שורת חדשה'
                                : 'Click to add a new row to the list'}
                        </p>
                    </div>

                    <button
                        onClick={onAdd}
                        className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-sm hover:shadow active:scale-95 shrink-0"
                    >
                        <Plus size={16}/> {isHe ? 'הוסף' : 'Add'}
                    </button>
                </div>
            </div>

            {footer.hours.items?.map((item, idx) => (
                <div key={idx}
                     className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3 relative group">
                    {/* Move & Delete Controls */}
                    <div
                        className="absolute -top-2 -left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button onClick={() => onRemove(idx)}
                                className="bg-white text-red-600 p-1.5 rounded-full border border-red-100 shadow-sm hover:bg-red-50">
                            <Trash2 size={14}/>
                        </button>
                        <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm">
                            <button disabled={idx === 0} onClick={() => onMove(idx, 'up')}
                                    className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30"><ChevronUp
                                size={14}/></button>
                            <button disabled={idx === footer.hours.items.length - 1} onClick={() => onMove(idx, 'down')}
                                    className="p-1 text-slate-400 hover:text-blue-600 border-t border-slate-100 disabled:opacity-30">
                                <ChevronDown size={14}/></button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1">
                            <label
                                className="text-[10px] font-bold text-slate-400 uppercase px-1">{isHe ? 'תווית' : 'Label'}</label>
                            <input className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                                   value={item.label?.[lang] || ''}
                                   onChange={(e) => onItemChange(idx, 'label', e.target.value)}/>
                        </div>
                        <div className="flex-1">
                            <label
                                className="text-[10px] font-bold text-slate-400 uppercase px-1">{isHe ? 'תיאור' : 'Description'}</label>
                            <input className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                                   value={item.value?.[lang] || ''}
                                   onChange={(e) => onItemChange(idx, 'value', e.target.value)}/>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 px-1">
                            <input type="checkbox" id={`link-${idx}`} checked={item.isLink || false}
                                   onChange={(e) => onItemChange(idx, 'isLink', e.target.checked)}
                                   className="rounded text-blue-600"/>
                            <label htmlFor={`link-${idx}`}
                                   className="text-[10px] font-bold text-slate-500 uppercase cursor-pointer flex items-center gap-1"><LinkIcon
                                size={12}/> {isHe ? 'קישור לפריט בתפריט' : 'Link to Menu'}</label>
                        </div>
                        {item.isLink && (
                            <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg border border-blue-100">
                                <LayoutGrid size={14} className="text-blue-500"/>
                                <select className="bg-transparent text-xs outline-none w-full font-medium"
                                        value={item.linkedSubItemId || ""}
                                        onChange={(e) => onItemChange(idx, 'linkedSubItemId', e.target.value)}>
                                    <option value="">{isHe ? '-- בחר פריט --' : '-- Select Item --'}</option>
                                    {menuData.map(cat => (
                                        <optgroup key={cat.id} label={t(cat.title)}>
                                            {cat.subItems.map(sub => <option key={sub.id}
                                                                             value={sub.id}>{t(sub.title)}</option>)}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HoursSection;