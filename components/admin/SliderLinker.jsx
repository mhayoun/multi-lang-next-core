import React from 'react';
import { LayoutGrid, X } from 'lucide-react';

const SliderLinker = ({
  isHe,
  menuData,
  linkedItemIds = [],
  onLink,
  onUnlink,
  t
}) => {
  const getTitle = (id) => {
    let foundTitle = "Unknown";
    menuData.forEach(cat => cat.subItems.forEach(s => {
      if(s.id === id) foundTitle = t(s.title);
    }));
    return foundTitle;
  };

  return (
    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
      <div className="flex items-center gap-2 mb-3 text-blue-800 font-bold text-xs">
        <LayoutGrid size={16} />
        <span>{isHe ? 'קישור פריטים לסליידר' : 'Link items to slider'}</span>
      </div>

      <select
        className="w-full bg-white border border-blue-200 rounded-lg p-2 text-sm outline-none shadow-sm focus:ring-2 focus:ring-blue-400"
        value=""
        onChange={(e) => onLink(Number(e.target.value))}
      >
        <option value="">{isHe ? '-- בחר פריט --' : '-- Select item --'}</option>
        {menuData.map(category => (
          <optgroup key={category.id} label={t(category.title)}>
            {category.subItems.map(sub => (
              <option key={sub.id} value={sub.id}>{t(sub.title)}</option>
            ))}
          </optgroup>
        ))}
      </select>

      <div className="flex flex-wrap gap-2 mt-3">
        {linkedItemIds.map(id => (
          <div key={id} className="flex items-center gap-2 bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm">
            <span>{getTitle(id)}</span>
            <button onClick={() => onUnlink(id)} className="text-red-400 hover:text-red-600">
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};



export default SliderLinker;