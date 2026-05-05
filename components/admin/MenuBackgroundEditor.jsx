import React from 'react';
import { Trash2 } from 'lucide-react';

const MenuBackgroundEditor = ({ menu, isHe, updateMenuBg, onRemoveImage }) => {
    return (
        <div className="flex flex-col md:flex-row items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
            <div className="space-y-2 w-full">
                {/* Label */}
                <label className="font-bold text-slate-400 block text-[10px] uppercase">
                    {isHe ? 'תמונת רקע לכרטיס' : 'Card background image'}
                </label>

                {/* Input File */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => updateMenuBg(e, menu.id)}
                    className="text-[10px] w-full file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />

                {/* Preview Thumbnail */}
                {menu.bgImage && (
                    <div className="flex gap-2 mt-2">
                        <div className="relative w-16 h-10 group">
                            <img
                                src={menu.bgImage}
                                className="w-full h-full object-cover rounded border shadow-sm"
                                alt="background preview"
                            />
                            <button
                                onClick={() => onRemoveImage(menu.id)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition shadow-sm z-10"
                            >
                                <Trash2 size={10}/>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuBackgroundEditor;